import { track as vercelTrack } from "@vercel/analytics";

import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "../types";

/**
 * Vercel Web Analytics adapter.
 *
 * Pageviews and the transport script are handled by the `<Analytics />`
 * component mounted in the root layout, so `init` is a no-op here. This adapter
 * only forwards custom events. Note: custom events require a Vercel Pro team to
 * be *viewable*; on Hobby they are silently dropped by the dashboard.
 */

/** Vercel only accepts string | number | boolean | null; drop undefined keys. */
function toVercelProps(
  props?: AnalyticsProps,
): Record<string, string | number | boolean | null> | undefined {
  if (!props) {
    return undefined;
  }
  const out: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}

export function createVercelProvider(): AnalyticsProvider {
  return {
    name: "vercel",
    init() {
      // Handled by <Analytics /> in the root layout.
    },
    track(name: AnalyticsEventName, props?: AnalyticsProps) {
      vercelTrack(name, toVercelProps(props));
    },
  };
}
