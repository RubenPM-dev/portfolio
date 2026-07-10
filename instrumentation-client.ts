// Next.js runs this file on the client before the app's frontend code starts.
// It's the composition-root bootstrap: initialize analytics providers once,
// here, so every view can call `trackEvent` without wiring up a provider.
// See node_modules/next/dist/docs/01-app/02-guides/analytics.md
import { initAnalytics } from "@/lib/analytics";

void initAnalytics();
