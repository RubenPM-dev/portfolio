import type { AnalyticsProvider } from "../types";

/**
 * Null-object provider. Used when no analytics is configured (e.g. local dev
 * without keys) so the facade always has something safe to delegate to.
 */
export function createNoopProvider(): AnalyticsProvider {
  return {
    name: "noop",
    init() {},
    track() {},
  };
}
