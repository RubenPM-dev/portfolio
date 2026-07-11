"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

import { setAnalyticsConsent } from "@/lib/analytics";
import { locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";

let initialized = false;
let lastPath: string | null = null;

function syncDarkMode() {
  const isDark = document.documentElement.dataset.theme !== "light";
  document.documentElement.classList.toggle("cc--darkmode", isDark);
}

function restoreConsentBanner() {
  syncDarkMode();
  const el = document.documentElement;
  if (!CookieConsent.validConsent() && !el.classList.contains("show--consent")) {
    el.classList.add("show--consent");
  }
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

function applyConsent() {
  void setAnalyticsConsent(CookieConsent.acceptedCategory("analytics"));
}

function consentConfig(): CookieConsent.CookieConsentConfig {
  return {
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
  };
}

export function CookieConsentBanner() {
  const pathname = usePathname();

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

    void CookieConsent.run(consentConfig());

    return () => themeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (lastPath === null) {
      lastPath = pathname;
      return;
    }
    if (lastPath === pathname || !initialized) {
      return;
    }
    lastPath = pathname;

    CookieConsent.reset(false);
    void CookieConsent.run(consentConfig());
    restoreConsentBanner();

    const navObserver = new MutationObserver(restoreConsentBanner);
    navObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const timer = window.setTimeout(() => navObserver.disconnect(), 1200);
    return () => {
      navObserver.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
