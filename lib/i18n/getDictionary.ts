import { isLocale, type Locale } from "./config";
import en from "./dictionaries/en.json";
import es from "./dictionaries/es.json";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: string | undefined): Dictionary {
  if (locale && isLocale(locale)) {
    return dictionaries[locale] || dictionaries.en;
  }
  return dictionaries.en;
}
