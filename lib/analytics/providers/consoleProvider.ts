import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "../types";

/**
 * Development adapter that logs events to the browser console instead of
 * sending them anywhere. Enabled with NEXT_PUBLIC_ANALYTICS_DEBUG=true so you
 * can confirm instrumentation fires without wiring a real provider.
 */
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
