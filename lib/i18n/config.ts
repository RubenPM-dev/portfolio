// Locales used in the URL (kept short and clean: /en, /es).
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Map the URL locale to the Contentful locale code configured in the space.
// Contentful uses "en-GB" as the default locale and "es" for Spanish.
export const contentfulLocale: Record<Locale, string> = {
  en: "en-GB",
  es: "es",
};

// Human-readable labels for the language switcher.
export const localeLabels: Record<Locale, string> = {
  en: "EN 🇬🇧",
  es: "ES 🇪🇸",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
