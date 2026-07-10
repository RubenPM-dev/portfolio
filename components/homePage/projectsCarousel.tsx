"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const DRAG_THRESHOLD = 5;

export function ProjectsCarousel({
  children,
  dotLabel,
}: {
  children: ReactNode;
  dotLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // null = not yet measured (safe start-aligned default), false = fits (center),
  // true = overflows (start-aligned + gutter + dots + drag).
  const [overflowing, setOverflowing] = useState<boolean | null>(null);
  const count = Children.count(children);

  const drag = useRef({
    active: false,
    dragging: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const items = Array.from(el.children) as HTMLElement[];
      if (!items.length) return setOverflowing(false);
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const cardsWidth =
        items.reduce((sum, item) => sum + item.offsetWidth, 0) +
        gap * (items.length - 1);
      setOverflowing(cardsWidth > el.clientWidth - 48 + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [count]);

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    Array.from(el.children).forEach((child, index) => {
      const node = child as HTMLElement;
      const elCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(elCenter - center);
      if (distance < min) {
        min = distance;
        closest = index;
      }
    });
    setActive(closest);
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !overflowing) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      dragging: false,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const el = trackRef.current;
    if (!state.active || !el) return;
    const dx = e.clientX - state.startX;
    if (!state.dragging) {
      if (Math.abs(dx) <= DRAG_THRESHOLD) return;
      state.dragging = true;
      state.moved = true;
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = state.startScroll - dx;
  }

  function endDrag(e: PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    const state = drag.current;
    if (el && state.dragging) {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      el.style.scrollSnapType = "";
    }
    state.active = false;
    state.dragging = false;
  }

  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  }

  function goTo(index: number) {
    const el = trackRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        className={cn(
          "carousel-track pt-4 pb-6 max-sm:pt-4 max-sm:pb-12",
          overflowing === true &&
            "carousel-track--overflow select-none sm:cursor-grab sm:active:cursor-grabbing",
          overflowing === false && "carousel-track--fits",
        )}
      >
        {children}
      </div>

      {overflowing ? (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                trackEvent("button_click", { id: "carousel_dot", index: index + 1 });
                goTo(index);
              }}
              aria-label={`${dotLabel} ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === active ? "w-6 bg-ink" : "w-2 bg-line",
              )}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
