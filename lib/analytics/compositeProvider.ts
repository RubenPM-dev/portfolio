import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

function safe(label: string, fn: () => void) {
  try {
    fn();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[analytics] ${label} failed`, error);
  }
}

export function createCompositeProvider(providers: AnalyticsProvider[]): AnalyticsProvider {
  return {
    name: `composite(${providers.map((p) => p.name).join(",") || "none"})`,
    async init() {
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
