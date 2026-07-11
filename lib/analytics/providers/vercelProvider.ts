import { track as vercelTrack } from "@vercel/analytics";

import type { AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "../types";

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
    init() {},
    track(name: AnalyticsEventName, props?: AnalyticsProps) {
      vercelTrack(name, toVercelProps(props));
    },
  };
}
