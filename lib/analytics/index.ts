/**
 * Public analytics API. Views import ONLY from here:
 *
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("button_click", { id: "cv_download" });
 *
 * The concrete provider(s) are chosen at runtime by the composition root from
 * env vars, so swapping Vercel <-> Mixpanel never touches a view.
 */
export {
  initAnalytics,
  setAnalyticsConsent,
  trackEvent,
  identify,
  pageView,
  resetAnalytics,
} from "./analytics";
export type {
  AnalyticsProvider,
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsProps,
  AnalyticsPropertyValue,
} from "./types";
