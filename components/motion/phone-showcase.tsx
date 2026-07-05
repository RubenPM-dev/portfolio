"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import ScrollIndicator from "@/components/common/scrollIndicator";
import { StoreBadges } from "@/components/common/store-badges";
import { Project } from "@/lib/contentful/types";

// Scroll distance each screen occupies. Higher = slower overall.
const VH_PER_SCREEN = 150;

// Fraction of a screen's slot spent cross-fading; the rest is a full-opacity
// hold. Smaller = longer hold, snappier fades.
const FADE_FRACTION = 0.3;

// The last screen has no screen after it, so it gets only a short hold (a
// fraction of a normal band) before the section unpins — otherwise you'd scroll
// a whole empty band of static phone at the end. Total scroll bands = (n-1)+TAIL.
const TAIL = 0.5;

const bandUnits = (count: number) => count - 1 + TAIL;

// iOS-style push/pop between screens. Only the TOP screen slides; the other
// stays full-screen and static underneath (just dimmed), so a complete image
// always fills the frame — no black edge is ever exposed, in either direction.
// Forward (dir >= 0): new screen slides in from the right over the old.
// Backward (pop): current screen slides off to the right, revealing the previous.
const SCREEN_VARIANTS = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "0%",
    zIndex: dir >= 0 ? 2 : 1,
    filter: dir >= 0 ? "brightness(1)" : "brightness(0.6)",
  }),
  center: (dir: number) => ({
    x: "0%",
    zIndex: dir >= 0 ? 2 : 1,
    filter: "brightness(1)",
  }),
  exit: (dir: number) => ({
    x: dir >= 0 ? "0%" : "100%",
    zIndex: dir >= 0 ? 1 : 2,
    filter: dir >= 0 ? "brightness(0.6)" : "brightness(1)",
  }),
};

export type ShowcaseCaption = { heading: string; body: string };

function defaultCaption(index: number): ShowcaseCaption {
  return { heading: `Feature ${index + 1}`, body: "" };
}

// Vertical distance a caption travels across the pinned area.
const CAPTION_TRAVEL = "42vh";

function captionSlot(index: number, count: number) {
  const units = bandUnits(count);
  const bandStart = index / units;
  // The last band is only TAIL long; the rest are a full unit each.
  const bandEnd = (index < count - 1 ? index + 1 : count - 1 + TAIL) / units;
  const len = bandEnd - bandStart;
  const t1 = bandStart + FADE_FRACTION * len;
  const t2 = bandEnd - FADE_FRACTION * len;
  return {
    range: [bandStart, t1, t2, bandEnd],
    opacity: [0, 1, 1, 0],
    y: [`-${CAPTION_TRAVEL}`, "0vh", "0vh", CAPTION_TRAVEL],
  };
}

function Caption({
  caption,
  index,
  count,
  side,
  progress,
  invert = false,
}: {
  caption: ShowcaseCaption;
  index: number;
  count: number;
  side: "left" | "right";
  progress: MotionValue<number>;
  invert?: boolean;
}) {
  const { range, opacity: opacityOut, y: yOut } = captionSlot(index, count);
  const opacity = useTransform(progress, range, opacityOut);
  // Travels top -> centre (hold) -> bottom with scroll; `invert` reverses it
  // (bottom -> centre -> top) so the text moves upward as you scroll down.
  const y = useTransform(progress, range, invert ? [...yOut].reverse() : yOut);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center ${
        side === "left" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <div className="max-w-xs">
        <p className="kicker mb-3">{caption.heading}</p>
        <p className="text-sm leading-7 text-muted">{caption.body}</p>
      </div>
    </motion.div>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-frame">
      <span className="phone-island" aria-hidden="true" />
      <div className="phone-screen">{children}</div>
    </div>
  );
}

export function PhoneShowcase({
  screens,
  captions,
  header,
  alt = "App screen",
  project,
}: {
  screens: string[];
  captions?: ShowcaseCaption[];
  header?: ReactNode;
  alt?: string;
  project?: Project;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const count = screens.length;
    if (!count) {
      return;
    }
    const pos = progress * bandUnits(count);
    const current = activeRef.current;
    const margin = 0.12;
    let next = current;
    if (pos > current + 1 + margin) {
      next = Math.min(count - 1, Math.floor(pos));
    } else if (pos < current - margin) {
      next = Math.max(0, Math.floor(pos));
    }
    if (next !== current) {
      setDirection(next > current ? 1 : -1);
      activeRef.current = next;
      setActive(next);
    }
  });

  if (!screens.length) {
    return null;
  }

  const captionFor = (index: number) => {
    const caption = captions?.[index] ?? defaultCaption(index);
    return caption;
  };
  const animate = !reduceMotion && screens.length > 1;

  // Static fallback (reduced motion, or a single screen): framed screens with
  // their captions in a simple centered grid.
  if (!animate) {
    return (
      <div className="grid-shell flex flex-wrap justify-center gap-10">
        {screens.map((src, index) => {
          const caption = captionFor(index);
          return (
            <div key={index} className="w-64 max-w-full">
              <PhoneFrame>
                <Image
                  src={src}
                  alt={`${alt} ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </PhoneFrame>
              <p className="kicker mt-5">{caption.heading}</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                {caption.body}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        height: `calc(var(--phone-vh-per-screen, ${VH_PER_SCREEN}) * ${bandUnits(screens.length)} * 1.4vh)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
      >
        {screens.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 70vw, 340px"
            loading="eager"
          />
        ))}
      </div>
      <div
        className="sticky flex flex-col"
        style={{
          top: "calc(var(--site-header-height, 5rem) + 0.5rem)",
          height: "calc(100dvh - var(--site-header-height, 5rem) - 0.5rem)",
        }}
      >
        {header ? (
          <div className="flex w-full justify-center pt-2">{header}</div>
        ) : null}

        <div className="grid-shell grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          {/* Desktop-only left column: even-indexed captions + the pre-scroll cue. */}
          <div className="relative hidden lg:block">
            {screens.map((_, index) =>
              index % 2 === 0 ? (
                <Caption
                  key={index}
                  caption={captionFor(index)}
                  index={index}
                  count={screens.length}
                  side="left"
                  progress={scrollYProgress}
                />
              ) : null,
            )}
          </div>

          <div className="flex flex-col items-start lg:mx-auto lg:items-center">
            <PhoneFrame>
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={SCREEN_VARIANTS}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={screens[active]}
                    alt={`${alt} ${active + 1}`}
                    fill
                    sizes="(max-width: 768px) 70vw, 340px"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>

            {project ? (
              <div className="store-badges">
                <StoreBadges
                  appStoreUrl={project.fields.links?.appStore}
                  googlePlayUrl={project.fields.links?.googlePlay}
                />
              </div>
            ) : null}
          </div>

          {/* Right column. Mobile: ALL captions on this single side next to the
              phone. Desktop: only the odd-indexed captions (the evens sit left). */}
          <div className="relative">
            <div className="lg:hidden">
              {screens.map((_, index) => (
                <Caption
                  key={`m-${index}`}
                  caption={captionFor(index)}
                  index={index}
                  count={screens.length}
                  side="right"
                  progress={scrollYProgress}
                  invert
                />
              ))}
            </div>
            <div className="hidden lg:block">
              {screens.map((_, index) =>
                index % 2 === 1 ? (
                  <Caption
                    key={index}
                    caption={captionFor(index)}
                    index={index}
                    count={screens.length}
                    side="right"
                    progress={scrollYProgress}
                  />
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
