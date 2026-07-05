"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";

import { cn } from "@/lib/utils";

export function ProjectsCarousel({
  children,
  dotLabel,
}: {
  children: ReactNode;
  dotLabel: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(elCenter - center);
      if (distance < min) {
        min = distance;
        closest = index;
      }
    });
    setActive(closest);
  }

  function goTo(index: number) {
    const track = trackRef.current;
    const el = track?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  return (
    <>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="carousel-track -mx-6 px-6 pt-4 pb-6 max-sm:pt-4 max-sm:pb-12"
      >
        {children}
      </div>

      <div className="mt-4 flex justify-center gap-2 sm:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              track("button_click", { id: "carousel_dot", index: index + 1 });
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
    </>
  );
}
