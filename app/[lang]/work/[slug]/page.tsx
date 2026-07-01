import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  fallbackProjects,
  fallbackSettings,
  siteBaseUrl,
} from "@/lib/site-config";
import { getProjectBySlug, getProjectSlugs, getSettings } from "@/lib/contentful/queries";
import { getImageUrl } from "@/lib/contentful/image";
import { contentfulLocale, defaultLocale, isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const revalidate = 120;

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

async function getProject(slug: string, locale: string) {
  const project = await getProjectBySlug(slug, locale);

  return project || fallbackProjects.find((item) => item.fields.slug === slug) || null;
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
  const project = await getProject(slug, cfLocale);
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
  const project = await getProject(slug, contentfulLocale[lang]);

  if (!project) {
    notFound();
  }

  const hero = project.fields.heroImage
    ? getImageUrl(project.fields.heroImage)
    : null;

  return (
    <main className="pb-16">
      <header className="grid-shell flex items-center justify-between py-8">
        <Link href={`/${lang}`} className="kicker focus-ring rounded-sm hover:text-ink">
          {dict.project.back}
        </Link>
        <LanguageSwitcher locale={lang} label={dict.language.label} />
      </header>

      <section className="grid-shell">
        <p className="kicker">{dict.project.eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-balance text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95]">
          {project.fields.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{project.fields.excerpt}</p>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-line">
          {hero ? (
            <Image src={hero} alt={project.fields.heroImage?.fields?.title || project.fields.title} width={2200} height={1200} className="h-auto w-full" priority />
          ) : (
            <div className="h-[28rem] bg-[linear-gradient(140deg,#efe7d8,#ddd3be)]" aria-hidden="true" />
          )}
        </div>
      </section>

      <section className="section-gap">
        <div className="grid-shell grid gap-8 lg:grid-cols-4">
          <aside className="rounded-3xl border border-line bg-surface p-6 lg:col-span-1">
            <dl className="space-y-5 text-sm">
              <div>
                <dt className="kicker">{dict.project.role}</dt>
                <dd className="mt-1 text-ink">{project.fields.role || "-"}</dd>
              </div>
              <div>
                <dt className="kicker">{dict.project.company}</dt>
                <dd className="mt-1 text-ink">{project.fields.company || "-"}</dd>
              </div>
              <div>
                <dt className="kicker">{dict.project.teamSize}</dt>
                <dd className="mt-1 text-ink">{project.fields.teamSize || "-"}</dd>
              </div>
              <div>
                <dt className="kicker">{dict.project.technologies}</dt>
                <dd className="mt-1 text-ink">{(project.fields.technologies || []).join(", ") || "-"}</dd>
              </div>
            </dl>
          </aside>

          <article className="space-y-10 lg:col-span-3">
            <div>
              <h2 className="text-3xl">{dict.project.challenges}</h2>
              <ul className="mt-4 space-y-3 text-base leading-8 text-muted">
                {(project.fields.challenges || []).map((challenge: string) => (
                  <li key={challenge}>- {challenge}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl">{dict.project.contributions}</h2>
              <ul className="mt-4 space-y-3 text-base leading-8 text-muted">
                {(project.fields.contributions || []).map((contribution: string) => (
                  <li key={contribution}>- {contribution}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-3xl">{dict.project.outcome}</h2>
              <p className="mt-4 text-base leading-8 text-muted">{project.fields.outcome || dict.project.outcomeFallback}</p>
            </div>

            {project.fields.gallery?.length ? (
              <div>
                <h2 className="text-3xl">{dict.project.gallery}</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.fields.gallery.map((image: any, index: number) => {
                    const src = getImageUrl(image);

                    if (!src) {
                      return null;
                    }

                    return (
                      <div key={`${image.sys?.id || "image"}-${index}`} className="overflow-hidden rounded-2xl border border-line">
                        <Image src={src} alt={image.fields?.title || `${project.fields.title} gallery image`} width={1200} height={900} className="h-auto w-full" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              {project.fields.links?.appStore ? (
                <Button asChild variant="secondary">
                  <a href={project.fields.links.appStore} target="_blank" rel="noreferrer">
                    {dict.project.appStore}
                  </a>
                </Button>
              ) : null}
              {project.fields.links?.googlePlay ? (
                <Button asChild variant="secondary">
                  <a href={project.fields.links.googlePlay} target="_blank" rel="noreferrer">
                    {dict.project.googlePlay}
                  </a>
                </Button>
              ) : null}
              {project.fields.links?.website ? (
                <Button asChild>
                  <a href={project.fields.links.website} target="_blank" rel="noreferrer">
                    {dict.project.website}
                  </a>
                </Button>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
