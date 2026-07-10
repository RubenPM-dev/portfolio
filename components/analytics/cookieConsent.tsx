"use client";

import { useEffect } from "react";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

import { setAnalyticsConsent } from "@/lib/analytics";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

// Guard against React Strict Mode's double-invoked effect in development.
let initialized = false;

/** Keep vanilla-cookieconsent's dark theme in sync with the site theme toggle. */
function syncDarkMode() {
  const isDark = document.documentElement.dataset.theme !== "light";
  document.documentElement.classList.toggle("cc--darkmode", isDark);
}

function buildTranslations(): Record<Locale, CookieConsent.Translation> {
  const entries = locales.map((locale) => {
    const c = getDictionary(locale).cookies;
    const translation: CookieConsent.Translation = {
      consentModal: {
        title: c.consentModal.title,
        description: c.consentModal.description,
        acceptAllBtn: c.consentModal.acceptAllBtn,
        acceptNecessaryBtn: c.consentModal.rejectAllBtn,
        showPreferencesBtn: c.consentModal.showPreferencesBtn,
      },
      preferencesModal: {
        title: c.preferencesModal.title,
        acceptAllBtn: c.preferencesModal.acceptAllBtn,
        acceptNecessaryBtn: c.preferencesModal.rejectAllBtn,
        savePreferencesBtn: c.preferencesModal.savePreferencesBtn,
        closeIconLabel: c.preferencesModal.closeIconLabel,
        sections: [
          {
            title: c.preferencesModal.necessary.title,
            description: c.preferencesModal.necessary.description,
            linkedCategory: "necessary",
          },
          {
            title: c.preferencesModal.analytics.title,
            description: c.preferencesModal.analytics.description,
            linkedCategory: "analytics",
          },
        ],
      },
    };
    return [locale, translation] as const;
  });
  return Object.fromEntries(entries) as Record<Locale, CookieConsent.Translation>;
}

/**
 * GDPR / UK GDPR / LSSI consent banner. Cookieless analytics (Vercel) runs
 * regardless; the "analytics" category gates the consent-requiring providers
 * (Mixpanel) through `setAnalyticsConsent`. Copy is provided in English and
 * Spanish and auto-selected from <html lang>, which the [lang] layout sets.
 */
export function CookieConsentBanner() {
  useEffect(() => {
    if (initialized) {
      return;
    }
    initialized = true;

    syncDarkMode();
    const themeObserver = new MutationObserver(syncDarkMode);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const applyConsent = () => {
      void setAnalyticsConsent(CookieConsent.acceptedCategory("analytics"));
    };

    void CookieConsent.run({
      guiOptions: {
        consentModal: { layout: "box inline", position: "bottom left" },
        preferencesModal: { layout: "box" },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {},
      },
      language: {
        default: "en",
        autoDetect: "document",
        translations: buildTranslations(),
      },
      onFirstConsent: applyConsent,
      onConsent: applyConsent,
      onChange: applyConsent,
    });

    return () => themeObserver.disconnect();
  }, []);

  return null;
}
