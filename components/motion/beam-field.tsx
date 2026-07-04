"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// How quickly the fan catches up to the cursor each frame (0..1). Lower is more
// damped — a softer, floatier trail. ~0.07 tracked fairly tightly; 0.035 eases
// out roughly twice as slowly.
const FOLLOW_EASE = 0.015;

// A fan of god-rays that tilt toward the cursor — like sunlight filtering down
// through water. Cursor motion is driven by a requestAnimationFrame lerp writing
// CSS custom properties, so it stays smooth and never re-renders React.
// `min` is how far a ray's brightness dips each cycle. Rays with min: 0 fade
// out completely, so the number of visible rays drifts (here between ~5 and 9).
// Tighter `blur` keeps the ray edges crisp; higher `opacity` makes them read.
const RAYS = [
  { offset: -20, width: "5vmax", blur: "24px", opacity: 0.6, min: 0, dur: "22s", delay: "-2s" },
  { offset: -15, width: "8vmax", blur: "32px", opacity: 0.9, min: 0.18, dur: "18s", delay: "-9s" },
  { offset: -10, width: "5vmax", blur: "22px", opacity: 0.7, min: 0, dur: "25s", delay: "-14s" },
  { offset: -6, width: "12vmax", blur: "40px", opacity: 1, min: 0.28, dur: "16s", delay: "-5s" },
  { offset: -1, width: "7vmax", blur: "26px", opacity: 0.85, min: 0.06, dur: "24s", delay: "-12s" },
  { offset: 4, width: "6vmax", blur: "24px", opacity: 0.8, min: 0, dur: "20s", delay: "-7s" },
  { offset: 9, width: "13vmax", blur: "40px", opacity: 0.95, min: 0.24, dur: "17s", delay: "-3s" },
  { offset: 14, width: "6vmax", blur: "26px", opacity: 0.7, min: 0, dur: "23s", delay: "-10s" },
  { offset: 19, width: "9vmax", blur: "32px", opacity: 0.8, min: 0.12, dur: "21s", delay: "-6s" },
];

export function BeamField() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const el = ref.current;
    if (!el) {
      return;
    }

    // Normalised cursor position (0..1). Start slightly above centre.
    let targetX = 0.5;
    let targetY = 0.25;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth;
      targetY = event.clientY / window.innerHeight;
    };

    const tick = () => {
      // Ease the current values toward the target for a soft trailing feel.
      currentX += (targetX - currentX) * FOLLOW_EASE;
      currentY += (targetY - currentY) * FOLLOW_EASE;

      // Tilt the fan so it leans toward the cursor (top-anchored, so the sign
      // is inverted relative to the rotation direction).
      const angle = (0.5 - currentX) * 30;
      const shift = (currentX - 0.5) * 8; // source drifts toward the cursor (vw)
      const intensity = 0.55 + (1 - currentY) * 0.45; // brighter toward the top

      el.style.setProperty("--beam-angle", `${angle.toFixed(2)}deg`);
      el.style.setProperty("--beam-shift", `${shift.toFixed(2)}vw`);
      el.style.setProperty("--beam-opacity", intensity.toFixed(3));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduceMotion]);

  return (
    <div ref={ref} className="beam-field" aria-hidden="true">
      <div className="beam-source" />
      <div className="beam-fan">
        {RAYS.map((ray, index) => (
          <span
            key={index}
            className="ray"
            style={
              {
                "--ray-offset": `${ray.offset}deg`,
                "--ray-width": ray.width,
                "--ray-blur": ray.blur,
                "--ray-opacity": `${ray.opacity}`,
                "--ray-min": `${ray.min}`,
                "--ray-dur": ray.dur,
                "--ray-delay": ray.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
