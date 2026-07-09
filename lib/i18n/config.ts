export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const contentfulLocale: Record<Locale, string> = {
  en: "en-GB",
  es: "es",
};

export const localeLabels: Record<Locale, string> = {
  en: "EN 🇬🇧",
  es: "ES 🇪🇸",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
