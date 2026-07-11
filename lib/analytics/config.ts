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
