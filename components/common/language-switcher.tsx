"use client";

import { usePathname, useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

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

  function switchTo(next: Locale) {
    if (next === locale) {
      return;
    }

    track("button_click", { id: "language_switch", locale: next });

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
      className="relative inline-flex shrink-0 items-center rounded-full border border-line p-0.5 text-xs font-medium uppercase tracking-[0.1em]"
    >
      <span
        aria-hidden="true"
        style={{ transform: `translateX(${locales.indexOf(locale) * 100}%)` }}
        className="pointer-events-none absolute inset-y-0.5 left-0.5 w-12 rounded-full bg-ink transition-transform duration-300 ease-out"
      />
      {locales.map((option) => {
        const [code, flag] = localeLabels[option].split(" ");
        return (
          <button
            key={option}
            type="button"
            onClick={() => switchTo(option)}
            aria-pressed={option === locale}
            aria-label={`Switch to ${localeNames[option]}`}
            className={cn(
              "focus-ring relative z-10 w-12 rounded-full py-0.4 text-center whitespace-nowrap transition-colors",
              option === locale
                ? "text-background"
                : "text-muted hover:text-ink",
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
