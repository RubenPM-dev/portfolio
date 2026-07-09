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
import { StoreBadges } from "@/components/common/storeBadges";
import { Project } from "@/lib/contentful/types";

const VH_PER_SCREEN = 150;

const FADE_FRACTION = 0.3;

const TAIL = 0.5;

const bandUnits = (count: number) => count - 1 + TAIL;

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

const CAPTION_TRAVEL = "42vh";

function captionSlot(index: number, count: number) {
  const units = bandUnits(count);
  const bandStart = index / units;
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
  children,
}: {
  caption: ShowcaseCaption;
  index: number;
  count: number;
  side: "left" | "right";
  progress: MotionValue<number>;
  invert?: boolean;
  children?: ReactNode;
}) {
  const { range, opacity: opacityOut, y: yOut } = captionSlot(index, count);
  const opacity = useTransform(progress, range, opacityOut);
  const y = useTransform(progress, range, invert ? [...yOut].reverse() : yOut);

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center ${
        side === "left" ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <div className="max-w-xs">
        {children ?? (
          <>
            <p className="kicker mb-3">{caption.heading}</p>
            <p className="text-sm leading-7">{caption.body}</p>
          </>
        )}
      </div>
    </motion.div>
  );
}

export type PhoneVariant = "island" | "notch" | "none";

function PhoneFrame({
  children,
  variant = "island",
  compact = false,
}: {
  children: React.ReactNode;
  variant?: PhoneVariant;
  compact?: boolean;
}) {
  if (variant === "none") {
    return (
      <div
        className={
          compact ? "phone-bare phone-bare--sm relative" : "phone-bare relative"
        }
      >
        {children}
      </div>
    );
  }
  const isNotch = variant === "notch";
  const frameClass = isNotch ? "phone-frame phone-frame--notch" : "phone-frame";
  return (
    <div
      className={
        compact
          ? `${frameClass} phone-frame--sm relative`
          : `${frameClass} relative`
      }
    >
      <span
        className={isNotch ? "phone-notch" : "phone-island"}
        aria-hidden="true"
      />
      <div className="phone-screen relative">{children}</div>
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
  const reduceMotion = useReducedMotion();
  const phoneVariant: PhoneVariant =
    project?.fields.dynamicIslandFrame == null
      ? "none"
      : project.fields.dynamicIslandFrame === true
        ? "island"
        : "notch";

  if (!screens.length) {
    return null;
  }

  const captionFor = (index: number) => {
    const caption = captions?.[index] ?? defaultCaption(index);
    return caption;
  };
  const animate = !reduceMotion && screens.length > 1;

  if (!animate) {
    if (screens.length === 1) {
      const f0 = captions?.[0];
      const f1 = captions?.[1];
      const hasF0 = Boolean(f0 && (f0.heading || f0.body));
      const hasF1 = Boolean(f1 && (f1.heading || f1.body));
      const captionBlock = (c: ShowcaseCaption) => (
        <div>
          <p className="kicker mb-3">{c.heading}</p>
          <p className="text-sm leading-7 text-muted">{c.body}</p>
        </div>
      );

      return (
        <div 
        style={{ paddingTop: "calc(var(--site-header-height, 5rem) + 3rem)", paddingBottom: "calc(var(--site-header-height, 5rem) + 3rem)" }}
        className="grid-shell grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 pb-16 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div className="hidden max-w-sm lg:block lg:justify-self-end lg:text-right">
            {header}
          </div>

          {phoneVariant === "none" ? (
            <img
              src={`${screens[0]}?w=680&fm=webp&q=80`}
              alt={`${alt} 1`}
              style={{ maxWidth: "40vw" }}
              className="h-auto w-[40vw] shrink-0 rounded-[var(--radius)] lg:h-[340px] lg:w-auto"
            />
          ) : (
            <PhoneFrame variant={phoneVariant} compact>
              <Image
                src={screens[0]}
                alt={`${alt} 1`}
                priority
                fill
                sizes="(max-width: 768px) 40vw, 340px"
                className="object-cover border-1"
              />
            </PhoneFrame>
          )}

          <div className="max-w-sm">
            <div className="space-y-4 lg:hidden">
              {header}
              {hasF0 ? captionBlock(f0!) : null}
              {hasF1 ? captionBlock(f1!) : null}
            </div>
            <div className="hidden lg:block">
              {hasF0 ? captionBlock(f0!) : null}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid-shell flex flex-wrap justify-center gap-10 pb-16 pt-[calc(var(--site-header-height,5rem)+2rem)]">
        {screens.map((src, index) => {
          const caption = captionFor(index);
          return (
            <div key={index} className="w-64 max-w-full">
              <PhoneFrame variant={phoneVariant} compact>
                <Image
                  src={src}
                  alt={`${alt} ${index + 1}`}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
              </PhoneFrame>
              {index === 0 && header ? (
                <div className="mt-5">{header}</div>
              ) : (
                <>
                  <p className="kicker mt-5">{caption.heading}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {caption.body}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <AnimatedShowcase
      screens={screens}
      captions={captions}
      header={header}
      alt={alt}
      project={project}
      phoneVariant={phoneVariant}
    />
  );
}

function AnimatedShowcase({
  screens,
  captions,
  header,
  alt,
  project,
  phoneVariant,
}: {
  screens: string[];
  captions?: ShowcaseCaption[];
  header?: ReactNode;
  alt: string;
  project?: Project;
  phoneVariant: PhoneVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const activeRef = useRef(0);
  const captionFor = (index: number) =>
    captions?.[index] ?? defaultCaption(index);
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
        <div className="grid-shell grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-center gap-5 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
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
                >
                  {index === 0 ? header : undefined}
                </Caption>
              ) : null,
            )}
          </div>

          <div className="flex flex-col items-start lg:mx-auto lg:items-center">
            <PhoneFrame variant={phoneVariant}>
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
                >
                  {index === 0 ? header : undefined}
                </Caption>
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
