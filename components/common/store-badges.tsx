"use client";

import { useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

// Localized accessible labels. The badge artwork (SVG) also carries this text
// baked in, so the matching /badges/{app-store,google-play}-<lang>.svg files
// must be the official localized badges for each language.
const LABELS: Record<Locale, { appStore: string; googlePlay: string }> = {
  en: { appStore: "Download on the App Store", googlePlay: "Get it on Google Play" },
  es: { appStore: "Descárgalo en el App Store", googlePlay: "Disponible en Google Play" },
};

export function StoreBadges({
  appStoreUrl,
  googlePlayUrl,
  className,
}: {
  appStoreUrl?: string;
  googlePlayUrl?: string;
  className?: string;
}) {
  const params = useParams();
  const rawLang = Array.isArray(params?.lang) ? params.lang[0] : params?.lang;
  const lang: Locale = isLocale(rawLang ?? "") ? (rawLang as Locale) : defaultLocale;
  const labels = LABELS[lang];

  if (!appStoreUrl && !googlePlayUrl) {
    return null;
  }

  return (
    <div className={cn("store-badges", className)}>
      {appStoreUrl ? (
        <a
          href={appStoreUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={labels.appStore}
          className="focus-ring rounded-lg transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/badges/app-store-${lang}.svg`} alt={labels.appStore} className="h-12 w-auto" />
        </a>
      ) : null}
      {googlePlayUrl ? (
        <a
          href={googlePlayUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={labels.googlePlay}
          className="focus-ring rounded-lg transition-opacity hover:opacity-80"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/badges/google-play-${lang}.svg`} alt={labels.googlePlay} className="h-12 w-auto" />
        </a>
      ) : null}
    </div>
  );
}
