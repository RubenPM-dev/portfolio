import type { Locale } from "./config";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";

// Dictionaries hold the hardcoded UI microcopy (nav, buttons, section labels).
// Editorial content comes from Contentful via the `locale` query param instead.
// This runs only in Server Components, so the JSON never reaches the client bundle.
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
