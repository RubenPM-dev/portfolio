"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "rp-theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  // Effective theme, used only for the icon/label. `null` until mounted so SSR
  // and the first client render agree (both show the moon).
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // A saved value means the user explicitly picked a theme -> honour it.
    // Otherwise follow the system: leave `data-theme` off so the CSS
    // `prefers-color-scheme` rules drive the colours (and keep following live
    // system changes).
    const sync = () => {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark") {
        document.documentElement.dataset.theme = saved;
        document.documentElement.style.colorScheme = saved;
        setTheme(saved);
      } else {
        delete document.documentElement.dataset.theme;
        document.documentElement.style.removeProperty("color-scheme");
        setTheme(media.matches ? "dark" : "light");
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const toggleTheme = () => {
    const next: Theme = (theme ?? getSystemTheme()) === "light" ? "dark" : "light";
    // Only persist on an explicit user choice.
    window.localStorage.setItem(storageKey, next);
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    setTheme(next);
  };

  // Show the icon for the theme you'd switch TO. Default to the moon before
  // mount so SSR and first client paint agree.
  const showSun = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring flex h-6 w-6 items-center justify-center rounded-full border border-line text-muted transition-colors hover:bg-zinc-200/50 hover:text-ink"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {showSun ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
