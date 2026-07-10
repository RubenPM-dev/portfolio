/**
 * Analytics port (CLEAN-style boundary).
 *
 * Views never talk to a vendor SDK. They call `trackEvent` from the facade,
 * which delegates to whatever `AnalyticsProvider` the composition root wired
 * up from env. Swapping Vercel <-> Mixpanel is a config change, not
 * a change to any consumer.
 */

/** Values a provider can safely serialize as event properties. */
export type AnalyticsPropertyValue = string | number | boolean | null | undefined;

export type AnalyticsProps = Record<string, AnalyticsPropertyValue>;

/**
 * Known event names, kept as a loose union so call sites get autocomplete for
 * the events we already emit while still accepting new ad-hoc names.
 */
export type AnalyticsEventName =
  | "button_click"
  | "section_view"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  props?: AnalyticsProps;
}

/**
 * The port every adapter implements. Only `name`, `init`, and `track` are
 * required; the rest are optional so a minimal provider (e.g. Vercel) can skip
 * what it doesn't support.
 */
export interface AnalyticsProvider {
  /** Stable identifier, used in debug logs. */
  readonly name: string;
  /**
   * Whether this provider may only run after the visitor opts in to the
   * "analytics" consent category. Cookieless providers (e.g. Vercel) leave this
   * false and run immediately; SDKs that set cookies / localStorage or process
   * IP (Mixpanel) set it true and stay dormant until consent.
   */
  readonly requiresConsent?: boolean;
  /** Load/boot the underlying SDK. May be async (lazy dynamic import). */
  init(): void | Promise<void>;
  /** Record a custom event. */
  track(name: AnalyticsEventName, props?: AnalyticsProps): void;
  /** Associate the current visitor with a stable id. */
  identify?(id: string, traits?: AnalyticsProps): void;
  /** Explicit pageview, for SPA route changes the SDK doesn't auto-capture. */
  pageView?(url?: string): void;
  /** Clear identity/session state (e.g. on logout). */
  reset?(): void;
}
