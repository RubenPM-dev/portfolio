import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/common/site-header";
import {
  fallbackProjects,
  fallbackSettings,
  siteBaseUrl,
} from "@/lib/site-config";
import {
  getProjectBySlug,
  getProjectSlugs,
  getSettings,
} from "@/lib/contentful/queries";
import {
  contentfulLocale,
  defaultLocale,
  isLocale,
  locales,
} from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import Footer from "@/components/common/footer";
import { Props } from "@/app/types/props";
import PhoneShowcaseSection from "@/components/projectPage/phoneShowcaseSection";
import RolleAndChallengesSection from "@/components/projectPage/rolleAndChallengesSection";
import HeroImageSection from "@/components/projectPage/heroImageSection";

export const revalidate = 120;

// Route params arrive URL-encoded (e.g. "EA%20SPORTS%20App"), so decode before
// matching against the raw Contentful slug. (Prefer URL-safe slugs regardless.)
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

async function getProject({ params }: Props) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const decoded = decodeSlug(slug || "");
  const project = await getProjectBySlug(decoded, contentfulLocale[locale]);

  return (
    project ||
    fallbackProjects.find((item) => item.fields.slug === decoded) ||
    null
  );
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs(contentfulLocale[defaultLocale]);
  const slugList = slugs?.length
    ? slugs
    : fallbackProjects.map((project) => project.fields.slug);

  return locales.flatMap((lang) => slugList.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const cfLocale = contentfulLocale[locale];
  const project = await getProject({ params: Promise.resolve({ lang, slug }) });
  const settings = await getSettings(cfLocale);

  if (!project) {
    return {
      title: getDictionary(locale).project.notFound,
    };
  }

  const settingsFields = settings?.fields || fallbackSettings.fields;

  return {
    title: `${project.fields.title} / ${settingsFields.siteTitle}`,
    description: project.fields.excerpt || settingsFields.siteDescription,
    openGraph: {
      title: project.fields.title,
      description: project.fields.excerpt || settingsFields.siteDescription,
      type: "article",
      url: `${siteBaseUrl}/${locale}/work/${project.fields.slug}`,
      images: [{ url: "/og" }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const project = await getProject({ params: Promise.resolve({ lang, slug }) });

  if (!project) {
    notFound();
  }

  return (
    <>
      <SiteHeader
        locale={lang}
        languageLabel={dict.language.label}
        left={
          <Link
            href={`/${lang}`}
            className="kicker focus-ring rounded-sm hover:text-ink"
          >
            {`< ${dict.project.back}`}
          </Link>
        }
      />

      <PhoneShowcaseSection project={project} />
      <RolleAndChallengesSection project={project} lang={lang} />
      <HeroImageSection project={project} />

      <Footer lang={lang} />
    </>
  );
}
