"use client";

import { usePathname, useRouter } from "next/navigation";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";

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
    <div className="relative inline-flex items-center">
      <select
        aria-label={label}
        value={locale}
        onChange={(event) => switchTo(event.target.value as Locale)}
        className="focus-ring h-6 cursor-pointer appearance-none rounded-full border border-line bg-transparent pl-3.5 pr-8 text-xs uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
      >
        {locales.map((option) => (
          <option key={option} value={option}>
            {localeLabels[option]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
