export type AnalyticsPropertyValue = string | number | boolean | null | undefined;

export type AnalyticsProps = Record<string, AnalyticsPropertyValue>;

export type AnalyticsEventName =
  | "button_click"
  | "section_view"
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  props?: AnalyticsProps;
}

export interface AnalyticsProvider {
  readonly name: string;
  readonly requiresConsent?: boolean;
  init(): void | Promise<void>;
  track(name: AnalyticsEventName, props?: AnalyticsProps): void;
  identify?(id: string, traits?: AnalyticsProps): void;
  pageView?(url?: string): void;
  reset?(): void;
}
