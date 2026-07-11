import { buildAnalytics } from "./compositionRoot";
import { createNoopProvider } from "./providers/noopProvider";
import type { AnalyticsEvent, AnalyticsEventName, AnalyticsProps, AnalyticsProvider } from "./types";

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

export async function setAnalyticsConsent(granted: boolean): Promise<void> {
  if (granted && !consentActive) {
    await consentGated.init();
    consentActive = true;
  } else if (!granted && consentActive) {
    consentGated.reset?.();
    consentActive = false;
  }
}

export function trackEvent(name: AnalyticsEventName, props?: AnalyticsProps): void {
  if (!booted) {
    buffer.push({ name, props });
    return;
  }
  dispatch({ name, props });
}

export function identify(id: string, traits?: AnalyticsProps): void {
  alwaysOn.identify?.(id, traits);
  if (consentActive) {
    consentGated.identify?.(id, traits);
  }
}

export function pageView(url?: string): void {
  alwaysOn.pageView?.(url);
  if (consentActive) {
    consentGated.pageView?.(url);
  }
}

export function resetAnalytics(): void {
  alwaysOn.reset?.();
  consentGated.reset?.();
}
