"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import type { SkillGroup, SkillItem } from "@/lib/contentful/types";

// Auto-scroll speed in pixels per millisecond.
const SPEED = 0.03;

function Chip({ item, hidden }: { item: SkillItem; hidden?: boolean }) {
  return (
    <span className="skill-chip" aria-hidden={hidden}>
      <span className="font-medium text-ink">{item.name}</span>
      {item.note ? <span className="ml-2 text-xs text-muted">{item.note}</span> : null}
    </span>
  );
}

function MarqueeRow({
  label,
  items,
  reverse,
}: {
  label: string;
  items: SkillItem[];
  reverse: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const interacting = useRef(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  // Repeat the items so one "copy" is wider than the viewport, then render it
  // twice: scrollLeft wraps at the halfway point for a seamless loop.
  const repeats = Math.max(3, Math.ceil(12 / items.length));
  const copy = Array.from({ length: repeats }, () => items).flat();
  const track = [...copy, ...copy];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const half = () => el.scrollWidth / 2;
    if (reverse) {
      el.scrollLeft = half();
    }

    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      if (!last) last = t;
      const dt = t - last;
      last = t;
      if (!hovering.current && !interacting.current) {
        el.scrollLeft += (reverse ? -1 : 1) * SPEED * dt;
        const h = half();
        if (el.scrollLeft >= h) el.scrollLeft -= h;
        else if (el.scrollLeft <= 0) el.scrollLeft += h;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reverse]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    interacting.current = true;
    const el = ref.current;
    if (!el) return;
    // Mouse: drive scrollLeft manually. Touch: let native scrolling handle it.
    if (e.pointerType === "mouse") {
      drag.current = {
        active: true,
        startX: e.clientX,
        startScroll: el.scrollLeft,
      };
      el.style.cursor = "grabbing";
      el.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!drag.current.active || !el) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  };

  const endInteract = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (el?.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    if (el) el.style.cursor = "";
    drag.current.active = false;
    interacting.current = false;
  };

  return (
    <div>
      <p className="kicker mb-3">{label}</p>
      <div
        ref={ref}
        className="marquee"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endInteract}
        onPointerCancel={endInteract}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={() => {
          hovering.current = false;
        }}
      >
        <div className="marquee-track">
          {track.map((item, i) => (
            <Chip
              key={`${item.name}-${i}`}
              item={item}
              hidden={i >= items.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkillsShowcase({ groups }: { groups: SkillGroup[] }) {
  const reduceMotion = useReducedMotion();

  if (!groups.length) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6">
      {groups.map((group, index) =>
        reduceMotion ? (
          <div key={group.title}>
            <p className="kicker mb-3">{group.title}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {group.items.map((item) => (
                <Chip key={item.name} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <MarqueeRow
            key={group.title}
            label={group.title}
            items={group.items}
            reverse={index % 2 === 1}
          />
        ),
      )}
    </div>
  );
}
