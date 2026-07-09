import type { MetadataRoute } from "next";

import { fallbackProjects, siteBaseUrl } from "@/lib/siteConfig";
import { getProjectSlugs } from "@/lib/contentful/queries";
import { contentfulLocale, defaultLocale, locales } from "@/lib/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs(contentfulLocale[defaultLocale]);
  const slugList = slugs?.length ? slugs : fallbackProjects.map((p) => p.fields.slug);

  return locales.flatMap((locale) => [
    {
      url: `${siteBaseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...slugList.map((slug) => ({
      url: `${siteBaseUrl}/${locale}/work/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]);
}
