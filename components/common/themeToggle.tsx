"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Theme = "light" | "dark";

const storageKey = "rp-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  // Defaults to dark regardless of the system setting; a saved toggle wins.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    const initial: Theme =
      saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    trackEvent("button_click", { id: "theme_toggle", theme: next });

    window.localStorage.setItem(storageKey, next);
    applyTheme(next);
    setTheme(next);
  };

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
