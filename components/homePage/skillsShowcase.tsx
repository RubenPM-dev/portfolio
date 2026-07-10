"use client";

import { useReducedMotion } from "framer-motion";

import type { SkillGroup, SkillItem } from "@/lib/contentful/types";
import { cn } from "@/lib/utils";

function Chip({ item, hidden }: { item: SkillItem; hidden?: boolean }) {
  return (
    <span className="skill-chip" aria-hidden={hidden}>
      <span className="font-medium text-ink">{item.name}</span>
      {item.note ? <span className="ml-2 text-xs text-muted">{item.note}</span> : null}
    </span>
  );
}

export function SkillsShowcase({ groups }: { groups: SkillGroup[] }) {
  const reduceMotion = useReducedMotion();

  if (!groups.length) {
    return null;
  }

  return (
    <div className="mt-12 space-y-6">
      {groups.map((group, rowIndex) => {
        if (reduceMotion) {
          return (
            <div key={group.title}>
              <p className="kicker mb-3">{group.title}</p>
              <div className="flex flex-wrap justify-center gap-3">
                {group.items.map((item) => (
                  <Chip key={item.name} item={item} />
                ))}
              </div>
            </div>
          );
        }

        const repeats = Math.max(3, Math.ceil(12 / group.items.length));
        const copy = Array.from({ length: repeats }, () => group.items).flat();
        const track = [...copy, ...copy];
        const duration = copy.length * 10;

        return (
          <div key={group.title}>
            <p className="kicker mb-3">{group.title}</p>
            <div className="marquee">
              <div
                className={cn(
                  "marquee-track",
                  rowIndex % 2 === 1 && "marquee-track--reverse",
                )}
                style={{ ["--marquee-duration" as string]: `${duration}s` }}
              >
                {track.map((item, i) => (
                  <Chip
                    key={`${item.name}-${i}`}
                    item={item}
                    hidden={i >= group.items.length}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
