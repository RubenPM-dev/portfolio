/**
 * Composition-root input: turn env vars into a typed config.
 *
 * Each `process.env.NEXT_PUBLIC_*` is referenced by its literal name because
 * Next.js only inlines literal references into the client bundle (a computed
 * `process.env[key]` lookup is NOT inlined). A provider is enabled purely by
 * the presence of its key, so switching providers is an env change with zero
 * code edits.
 *
 * Supported env vars:
 *   NEXT_PUBLIC_ANALYTICS_VERCEL   "false" to disable Vercel (default: enabled)
 *   NEXT_PUBLIC_MIXPANEL_TOKEN     Mixpanel project token (enables Mixpanel)
 *   NEXT_PUBLIC_MIXPANEL_API_HOST  Mixpanel API host, e.g. EU residency (optional)
 *   NEXT_PUBLIC_ANALYTICS_DEBUG    "true" to log every event to the console
 */

export interface AnalyticsConfig {
  vercel: boolean;
  mixpanel?: { token: string; apiHost?: string };
  debug: boolean;
}

export function readAnalyticsConfig(): AnalyticsConfig {
  const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

  return {
    vercel: process.env.NEXT_PUBLIC_ANALYTICS_VERCEL !== "false",
    mixpanel: mixpanelToken
      ? {
          token: mixpanelToken,
          apiHost: process.env.NEXT_PUBLIC_MIXPANEL_API_HOST,
        }
      : undefined,
    debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
  };
}
