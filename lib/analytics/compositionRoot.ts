import { readAnalyticsConfig, type AnalyticsConfig } from "./config";
import { createCompositeProvider } from "./compositeProvider";
import { createConsoleProvider } from "./providers/consoleProvider";
import { createMixpanelProvider } from "./providers/mixpanelProvider";
import { createNoopProvider } from "./providers/noopProvider";
import { createVercelProvider } from "./providers/vercelProvider";
import type { AnalyticsProvider } from "./types";

export interface BuiltAnalytics {
  alwaysOn: AnalyticsProvider;
  consentGated: AnalyticsProvider;
}

function toProvider(providers: AnalyticsProvider[]): AnalyticsProvider {
  return providers.length > 0 ? createCompositeProvider(providers) : createNoopProvider();
}

export function buildAnalytics(config: AnalyticsConfig = readAnalyticsConfig()): BuiltAnalytics {
  const providers: AnalyticsProvider[] = [];

  if (config.vercel) {
    providers.push(createVercelProvider());
  }
  if (config.mixpanel) {
    providers.push(createMixpanelProvider(config.mixpanel));
  }
  if (config.debug) {
    providers.push(createConsoleProvider());
  }

  return {
    alwaysOn: toProvider(providers.filter((p) => !p.requiresConsent)),
    consentGated: toProvider(providers.filter((p) => p.requiresConsent)),
  };
}
