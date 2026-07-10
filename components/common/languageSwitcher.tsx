"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

const localeNames: Record<Locale, string> = { en: "English", es: "Spanish" };

function persistLocale(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`;
}

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [selected, setSelected] = useState(locale);

  function switchTo(next: Locale) {
    if (next === selected) {
      return;
    }
    setSelected(next);
    trackEvent("button_click", { id: "language_switch", locale: next });

    const segments = pathname.split("/");
    segments[1] = next;
    const nextPath = segments.join("/") || `/${next}`;

    persistLocale(next);
    router.push(nextPath, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="relative inline-flex shrink-0 items-center rounded-full border border-line p-0.5 text-xs font-medium uppercase tracking-[0.1em]"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0.5 w-12 rounded-full bg-ink"
        animate={{ x: `${locales.indexOf(selected) * 100}%` }}
        transition={{ type: "spring", stiffness: 520, damping: 30, mass: 0.7 }}
      />
      {locales.map((option) => {
        const [code, flag] = localeLabels[option].split(" ");
        const active = option === selected;
        return (
          <motion.button
            key={option}
            type="button"
            onClick={() => switchTo(option)}
            aria-pressed={active}
            aria-label={`Switch to ${localeNames[option]}`}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "focus-ring relative z-10 flex w-12 items-center justify-center rounded-full py-0.4 whitespace-nowrap transition-colors",
              active ? "text-background" : "text-muted hover:text-ink",
            )}
          >
            <span className="text-[0.7rem]">{code}</span>
            <motion.span
              className="ml-0.5 text-[15px]"
              animate={{ scale: active ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 12 }}
            >
              {flag}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}
