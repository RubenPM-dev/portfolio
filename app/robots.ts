import type { MetadataRoute } from "next";

import { siteBaseUrl } from "@/lib/siteConfig";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteBaseUrl}/sitemap.xml`,
    host: siteBaseUrl,
  };
}
