"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export function SectionTracker() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]"),
    );
    if (!sections.length) {
      return;
    }

    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!entry.isIntersecting || !id || seen.has(id)) {
            continue;
          }
          seen.add(id);
          track("section_view", { section: id });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
}
