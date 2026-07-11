import type { Mixpanel } from "mixpanel-browser";

import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "../types";

export interface MixpanelOptions {
  token: string;
  apiHost?: string;
}

export function createMixpanelProvider({ token, apiHost }: MixpanelOptions): AnalyticsProvider {
  let client: Mixpanel | null = null;

  return {
    name: "mixpanel",
    requiresConsent: true,
    async init() {
      const { default: mixpanel } = await import("mixpanel-browser");
      mixpanel.init(token, {
        track_pageview: true,
        persistence: "localStorage",
        debug: process.env.NODE_ENV !== "production",
        ...(apiHost ? { api_host: apiHost } : {}),
      });
      client = mixpanel;
    },
    track(name: AnalyticsEventName, props?: AnalyticsProps) {
      client?.track(name, props);
    },
    identify(id: string, traits?: AnalyticsProps) {
      client?.identify(id);
      if (traits) {
        client?.people.set(traits);
      }
    },
    reset() {
      client?.reset();
    },
  };
}
