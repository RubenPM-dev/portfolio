import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

const LOCALE_COOKIE = "NEXT_LOCALE";

// Pick a locale: an explicit cookie choice wins, then the browser's
// Accept-Language header, then the default.
function detectLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) {
    return cookie;
  }

  const header = request.headers.get("accept-language");
  if (header) {
    const preferred = header
      .split(",")
      .map((part) => part.split(";")[0].trim().toLowerCase());

    for (const lang of preferred) {
      const base = lang.split("-")[0];
      const match = locales.find((locale) => locale === lang || locale === base);
      if (match) {
        return match;
      }
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    return;
  }

  const locale = detectLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Skip Next internals, the OG route handler, and any file with an extension
  // (sitemap.xml, robots.txt, icon.svg, images, etc.).
  matcher: ["/((?!_next|og|.*\\.).*)"],
};
