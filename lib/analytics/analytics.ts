import { buildAnalytics } from "./compositionRoot";
import { createNoopProvider } from "./providers/noopProvider";
import type { AnalyticsEvent, AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

/**
 * The facade views consume. It owns two provider groups from the composition
 * root:
 *
 *   - `alwaysOn`     cookieless providers (Vercel), booted immediately.
 *   - `consentGated` providers that require "analytics" consent (Mixpanel),
 *                    dormant until `setAnalyticsConsent(true)` is called by the
 *                    cookie banner.
 *
 * A small pre-boot buffer holds events fired before `initAnalytics` resolves and
 * flushes them once the always-on group is ready. Consent-gated providers only
 * ever receive events that occur AFTER consent is granted; nothing from before
 * consent is replayed to them.
 */

let alwaysOn: AnalyticsProvider = createNoopProvider();
let consentGated: AnalyticsProvider = createNoopProvider();

let booted = false;
let started = false;
let consentActive = false;
const buffer: AnalyticsEvent[] = [];

function dispatch(event: AnalyticsEvent) {
  alwaysOn.track(event.name, event.props);
  if (consentActive) {
    consentGated.track(event.name, event.props);
  }
}

/**
 * Boot analytics once, on the client. Called from `instrumentation-client.ts`.
 * Only the cookieless (always-on) group starts here; consent-gated providers
 * wait for `setAnalyticsConsent`. Safe to call multiple times (HMR).
 */
export async function initAnalytics(): Promise<void> {
  if (started || typeof window === "undefined") {
    return;
  }
  started = true;
  const built = buildAnalytics();
  alwaysOn = built.alwaysOn;
  consentGated = built.consentGated;
  await alwaysOn.init();
  booted = true;
  for (const event of buffer) {
    dispatch(event);
  }
  buffer.length = 0;
}

/**
 * Grant or withdraw consent for the "analytics" category. Driven by the cookie
 * banner. Granting boots the consent-gated providers (once); withdrawing resets
 * them and stops further delivery.
 */
export async function setAnalyticsConsent(granted: boolean): Promise<void> {
  if (granted && !consentActive) {
    await consentGated.init();
    consentActive = true;
  } else if (!granted && consentActive) {
    consentGated.reset?.();
    consentActive = false;
  }
}

/** Record a custom event. Buffered until the always-on group is ready. */
export function trackEvent(name: AnalyticsEventName, props?: AnalyticsProps): void {
  if (!booted) {
    buffer.push({ name, props });
    return;
  }
  dispatch({ name, props });
}

/** Associate the current visitor with a stable id across active providers. */
export function identify(id: string, traits?: AnalyticsProps): void {
  alwaysOn.identify?.(id, traits);
  if (consentActive) {
    consentGated.identify?.(id, traits);
  }
}

/** Record an explicit pageview (for SPA route changes). */
export function pageView(url?: string): void {
  alwaysOn.pageView?.(url);
  if (consentActive) {
    consentGated.pageView?.(url);
  }
}

/** Clear identity/session state across active providers. */
export function resetAnalytics(): void {
  alwaysOn.reset?.();
  consentGated.reset?.();
}
