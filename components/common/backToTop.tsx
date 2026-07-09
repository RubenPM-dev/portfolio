"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

export function BackToTop({ threshold = 0.6 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const firstSection = document.querySelector("section");

    const update = () => {
      const reference = firstSection?.offsetHeight ?? window.innerHeight;
      setVisible(window.scrollY >= reference * threshold);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [threshold]);

  const scrollToTop = () => {
    track("button_click", { id: "back_to_top" });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`focus-ring fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface/80 text-muted shadow-sm backdrop-blur transition-[opacity,transform,color] duration-300 hover:bg-zinc-200/50 hover:text-ink ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
