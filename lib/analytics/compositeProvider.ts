import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

/** Run a side effect, swallowing errors so one provider can't break the others. */
function safe(label: string, fn: () => void) {
  try {
    fn();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[analytics] ${label} failed`, error);
  }
}

/**
 * Fans a single call out to every wrapped provider. This is what lets the app
 * run Vercel + Mixpanel at once without any
 * consumer knowing more than one provider exists.
 */
export function createCompositeProvider(providers: AnalyticsProvider[]): AnalyticsProvider {
  return {
    name: `composite(${providers.map((p) => p.name).join(",") || "none"})`,
    async init() {
      // allSettled: a failing SDK (missing key, blocked by an ad blocker)
      // must not prevent the others from initializing.
      await Promise.allSettled(providers.map((p) => Promise.resolve(p.init())));
    },
    track(name: AnalyticsEventName, props?: AnalyticsProps) {
      for (const provider of providers) {
        safe(`${provider.name}.track`, () => provider.track(name, props));
      }
    },
    identify(id: string, traits?: AnalyticsProps) {
      for (const provider of providers) {
        safe(`${provider.name}.identify`, () => provider.identify?.(id, traits));
      }
    },
    pageView(url?: string) {
      for (const provider of providers) {
        safe(`${provider.name}.pageView`, () => provider.pageView?.(url));
      }
    },
    reset() {
      for (const provider of providers) {
        safe(`${provider.name}.reset`, () => provider.reset?.());
      }
    },
  };
}
