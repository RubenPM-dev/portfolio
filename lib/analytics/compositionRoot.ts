import { readAnalyticsConfig, type AnalyticsConfig } from "./config";
import { createCompositeProvider } from "./compositeProvider";
import { createConsoleProvider } from "./providers/consoleProvider";
import { createMixpanelProvider } from "./providers/mixpanelProvider";
import { createNoopProvider } from "./providers/noopProvider";
import { createVercelProvider } from "./providers/vercelProvider";
import type { AnalyticsProvider } from "./types";

/** Analytics split by consent requirement, each a single composite. */
export interface BuiltAnalytics {
  /** Cookieless providers that run immediately (no consent needed). */
  alwaysOn: AnalyticsProvider;
  /** Providers that may only run after "analytics" consent is granted. */
  consentGated: AnalyticsProvider;
}

function toProvider(providers: AnalyticsProvider[]): AnalyticsProvider {
  return providers.length > 0 ? createCompositeProvider(providers) : createNoopProvider();
}

/**
 * The composition root: the ONE place that knows which concrete adapters exist
 * and how to build them from config. Everything else depends only on the
 * `AnalyticsProvider` port. Providers are partitioned by `requiresConsent` so
 * the facade can boot the cookieless group at once and hold the rest until the
 * visitor opts in. To add a provider, add an adapter and one line here.
 */
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
