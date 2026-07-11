import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "../types";

export function createConsoleProvider(): AnalyticsProvider {
  return {
    name: "console",
    init() {
      // eslint-disable-next-line no-console
      console.info("[analytics] console provider active");
    },
    track(name: AnalyticsEventName, props?: AnalyticsProps) {
      // eslint-disable-next-line no-console
      console.info("[analytics] track", name, props ?? {});
    },
    identify(id: string, traits?: AnalyticsProps) {
      // eslint-disable-next-line no-console
      console.info("[analytics] identify", id, traits ?? {});
    },
    pageView(url?: string) {
      // eslint-disable-next-line no-console
      console.info("[analytics] pageView", url ?? "");
    },
    reset() {
      // eslint-disable-next-line no-console
      console.info("[analytics] reset");
    },
  };
}
