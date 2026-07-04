"use client";

import { usePathname, useRouter } from "next/navigation";

import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// Persist the choice so the proxy keeps honouring it on later visits.
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

  function switchTo(next: Locale) {
    if (next === locale) {
      return;
    }

    // pathname always begins with the current locale segment, e.g. /en/work/x.
    const segments = pathname.split("/");
    segments[1] = next;
    const nextPath = segments.join("/") || `/${next}`;

    persistLocale(next);
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="relative inline-flex items-center rounded-full border border-line p-0.5 text-xs font-medium uppercase tracking-[0.1em]"
    >
      {/* Sliding highlight behind the active language. Translates by its own
          width per locale index, so it works for any number of locales. */}
      <span
        aria-hidden="true"
        style={{ transform: `translateX(${locales.indexOf(locale) * 100}%)` }}
        className="pointer-events-none absolute inset-y-0.5 left-0.5 w-12 rounded-full bg-ink transition-transform duration-300 ease-out"
      />
      {locales.map((option) => {
        // Labels are "CODE FLAG" (e.g. "EN 🇬🇧") — split so the code can be
        // sized down without shrinking the flag.
        const [code, flag] = localeLabels[option].split(" ");
        return (
          <button
            key={option}
            type="button"
            onClick={() => switchTo(option)}
            aria-pressed={option === locale}
            className={cn(
              "focus-ring relative z-10 w-12 rounded-full py-0.4 text-center whitespace-nowrap transition-colors",
              option === locale ? "text-background" : "text-muted hover:text-ink",
            )}
          >
            <span className="text-[0.6rem]">{code}</span>
            <span className="ml-1">{flag}</span>
          </button>
        );
      })}
    </div>
  );
}
