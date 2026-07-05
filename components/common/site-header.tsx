"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import type { Locale } from "@/lib/i18n/config";

const NARROW_MAX_WIDTH = 1024;

// Layout effect on the client (runs before paint), plain effect on the server
// (avoids the SSR warning). Used to publish the header height before the first
// paint so pages sizing off `--site-header-height` are correct immediately,
// even after client-side navigation.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

  // Narrow detection via matchMedia (drives which layout renders).
  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${NARROW_MAX_WIDTH - 1}px)`);
    const updateNarrow = () => setIsNarrow(query.matches);
    updateNarrow();
    query.addEventListener("change", updateNarrow);
    return () => query.removeEventListener("change", updateNarrow);
  }, []);

  // Publish the header height to `--site-header-height` BEFORE paint, and again
  // whenever the layout switches (`isNarrow`), so pages that size off it (the
  // phone showcase) are correct on the first frame. Critically this fixes
  // client-side navigation: without a layout effect the variable would keep the
  // previous page's (taller) header height until a post-paint effect corrected
  // it. A ResizeObserver catches any later reflow (fonts, wrapping).
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const publishHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${el.offsetHeight}px`,
      );
    };
    publishHeight();
    const observer = new ResizeObserver(() =>
      requestAnimationFrame(publishHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isNarrow]);

  const pageSettings = (
    <div className={"flex-row flex items-center gap-x-2 gap-y-4"}>
      <LanguageSwitcher locale={locale} label={languageLabel} />
      <ThemeToggle />
    </div>
  );

  const desktopHeader = (
    <div className="flex w-full items-center justify-between gap-x-4 gap-y-0">
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
    <div className="flex-col w-full items-center justify-between gap-x-4">
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
