"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { Locale } from "@/lib/i18n/config";

const NARROW_MAX_WIDTH = 1024;

// Shared floating header used on every page. `left` is the page-specific
// content (site title, or a back link); `children` are any extra controls
// (e.g. the home nav links) placed alongside the language + theme controls.
//
// It publishes its own rendered height to the `--site-header-height` CSS
// variable (kept in sync via ResizeObserver), so pages can offset content
// relative to the header on any screen size.
export function SiteHeader({
  locale,
  languageLabel,
  left,
  children,
}: {
  locale: Locale;
  languageLabel: string;
  left: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    // Narrow detection via matchMedia — independent of the header element, so
    // it ALWAYS runs on mount (must not be gated behind the ref check).
    const query = window.matchMedia(`(max-width: ${NARROW_MAX_WIDTH - 1}px)`);
    const updateNarrow = () => setIsNarrow(query.matches);
    updateNarrow();
    query.addEventListener("change", updateNarrow);

    // Publish the header height as a CSS var. Needs the element; the observer
    // callback only writes the var (no React re-render) to avoid a
    // "ResizeObserver loop", guarded to changes and deferred to next frame.
    const el = ref.current;
    let observer: ResizeObserver | undefined;
    if (el) {
      let lastHeight = -1;
      const publishHeight = () => {
        const height = el.offsetHeight;
        if (height !== lastHeight) {
          lastHeight = height;
          document.documentElement.style.setProperty(
            "--site-header-height",
            `${height}px`,
          );
        }
      };
      publishHeight();
      observer = new ResizeObserver(() => requestAnimationFrame(publishHeight));
      observer.observe(el);
    }

    return () => {
      query.removeEventListener("change", updateNarrow);
      observer?.disconnect();
    };
  }, []);

  const pageSettings = (
    <div className={"flex-row flex items-center gap-x-2 gap-y-4"}>
      <LanguageSwitcher locale={locale} label={languageLabel} />
      <ThemeToggle />
    </div>
  );

  const desktopHeader = (
    <div className="flex w-full items-center justify-between gap-x-4 gap-y-4">
      <div className="m-2 flex items-center whitespace-nowrap">{left}</div>
      <div className="flex-grow" />
      <div className="flex flex-row whitespace-nowrap justify-around gap-x-4">
        {children}
      </div>
      <LanguageSwitcher locale={locale} label={languageLabel} />
      <ThemeToggle />
    </div>
  );

  const mobileHeader = (
    <div className="flex-col w-full items-center justify-between gap-x-4 gap-y-4">
      <div className="flex items-center justify-between w-full">
        {left}
        {pageSettings}
      </div>
      {children ? (
        <div className="flex w-full justify-center gap-x-6 pt-1">{children}</div>
      ) : null}
    </div>
  );

  return (
    <header ref={ref} data-narrow={isNarrow} className="header">
      <div className="site-header-root">
        {isNarrow ? mobileHeader : desktopHeader}
      </div>
    </header>
  );
}
