import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { notFound } from "next/navigation";

import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fallbackAbout,
  fallbackContact,
  fallbackExperiences,
  fallbackPhotography,
  fallbackProjects,
  fallbackSettings,
  fallbackSkills,
} from "@/lib/site-config";
import { getAbout, getContact, getExperiences, getPhotography, getProjects, getSettings, getSkills } from "@/lib/contentful/queries";
import { getImageUrl } from "@/lib/contentful/image";
import { contentfulLocale, defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const revalidate = 120;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const settings = await getSettings(contentfulLocale[locale]);
  const settingsFields = settings?.fields || fallbackSettings.fields;

  return {
    title: settingsFields.siteTitle,
    description: settingsFields.siteDescription,
  };
}

function skillWidth(level: number) {
  return `${Math.max(10, Math.min(100, level * 20))}%`;
}

export default async function Home({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const cfLocale = contentfulLocale[lang];

  const [settings, about, projects, experiences, skills, contact, photography] =
    await Promise.all([
      getSettings(cfLocale),
      getAbout(cfLocale),
      getProjects(cfLocale),
      getExperiences(cfLocale),
      getSkills(cfLocale),
      getContact(cfLocale),
      getPhotography(cfLocale),
    ]);


  const mergedSettings = settings?.fields || fallbackSettings.fields;
  const mergedAbout = about?.fields || fallbackAbout.fields;
  const mergedProjects = projects.length ? projects : fallbackProjects;
  const mergedExperiences = experiences.length ? experiences : fallbackExperiences;
  const mergedSkills = skills?.fields || fallbackSkills.fields;
  const mergedContact = contact?.fields || fallbackContact.fields;
  const mergedPhotography = photography.length ? photography : fallbackPhotography;

  return (
    <main>
      <header className="grid-shell py-7">
        <nav className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between" aria-label="Main">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">{mergedSettings.siteTitle}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-muted">
            <a href="#work" className="focus-ring rounded-sm">{dict.nav.work}</a>
            <a href="#about" className="focus-ring rounded-sm">{dict.nav.about}</a>
            <a href="#contact" className="focus-ring rounded-sm">{dict.nav.contact}</a>
            <div className="flex-1 grow-1" />
            <LanguageSwitcher locale={lang} label={dict.language.label} />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <section className="grid-shell flex min-h-[78vh] flex-col justify-center py-10 lg:py-16">
        <div className="editorial-grid items-end">
          <Reveal className="col-span-12 lg:col-span-7">
            <p className="kicker mb-5">{dict.hero.kicker}</p>
            <h1 className="text-balance text-[clamp(2rem,6vw,4rem)] leading-[0.94]">
              {dict.hero.headline}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              {dict.hero.subhead}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <a href="#work">{dict.hero.ctaWork}</a>
              </Button>
              <Button asChild variant="outline">
                <a href="#contact">{dict.hero.ctaContact}</a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="col-span-12 lg:col-span-4">
            <div className="ambient-panel relative h-[28rem] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,#d8d3c4_0,#f6f1e4_42%,#eee7d7_100%)]" />
              <div className="absolute inset-x-7 top-14 border-t border-black/20" />
              <div className="absolute inset-x-7 bottom-9 border-t border-black/20" />
              <p className="absolute left-7 top-7 z-10 text-xs uppercase tracking-[0.12em] text-black/65">
                {dict.hero.panelLocation}
              </p>
              <p className="absolute left-7 bottom-7 max-w-[15rem] text-sm leading-7 text-black/70">
                {dict.hero.panelNote}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about" className="section-gap hairline">
        <div className="grid-shell editorial-grid items-start">
          <Reveal className="col-span-12 lg:col-span-6">
            <p className="kicker">{dict.sections.aboutKicker}</p>
            <h2 className="section-heading mt-4 max-w-xl text-balance">{mergedAbout.heading}</h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted">{mergedAbout.story}</p>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted">{mergedAbout.philosophy}</p>
          </Reveal>
          <Reveal delay={0.15} className="col-span-12 lg:col-span-6">
            {mergedAbout.portrait && getImageUrl(mergedAbout.portrait) ? (
              <ParallaxImage
                src={getImageUrl(mergedAbout.portrait)!}
                alt={mergedAbout.portrait.fields?.title || "Portrait"}
                width={880}
                height={1120}
                className="rounded-[2rem] border border-line"
              />
            ) : (
              <div className="ambient-panel h-[34rem]" aria-hidden="true" />
            )}
            <ul className="mt-6 space-y-3">
              {(mergedAbout.journey || []).map((item: any) => (
                <li key={item.year || item} className="border-b border-line pb-3 text-sm leading-7 text-muted">
                  {typeof item === "string" ? item : `${item.year}: ${item.event}`}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="work" className="section-gap hairline">
        <div className="grid-shell">
          <Reveal>
            <p className="kicker">{dict.sections.workKicker}</p>
            <h2 className="section-heading mt-4 max-w-3xl text-balance">
              {dict.sections.workHeading}
            </h2>
          </Reveal>

          <div className="mt-14 space-y-12">
            {mergedProjects.map((project, index) => {
              const projectImage = project.fields.heroImage
                ? getImageUrl(project.fields.heroImage)
                : null;

              return (
                <Reveal key={project.sys.id} delay={index * 0.04}>
                  <Card className="overflow-hidden rounded-[2rem] border-line bg-surface">
                    <div className="grid gap-0 lg:grid-cols-5">
                      <div className="relative min-h-72 lg:col-span-3">
                        {projectImage ? (
                          <Image
                            src={projectImage}
                            alt={project.fields.heroImage?.fields?.title || project.fields.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-[linear-gradient(140deg,#efe7d8,#ddd3be)]" aria-hidden="true" />
                        )}
                      </div>
                      <CardContent className="flex flex-col gap-6 p-8 lg:col-span-2 lg:p-10">
                        <div>
                          <p className="kicker">{project.fields.company || dict.projectCard.featuredFallback}</p>
                          <h3 className="mt-3 text-3xl leading-tight">{project.fields.title}</h3>
                          <p className="mt-4 text-sm leading-7 text-muted">{project.fields.excerpt}</p>
                        </div>
                        <dl className="grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.08em] text-muted">
                          <div>
                            <dt>{dict.projectCard.role}</dt>
                            <dd className="mt-1 text-sm normal-case tracking-normal text-ink">{project.fields.role || "-"}</dd>
                          </div>
                          <div>
                            <dt>{dict.projectCard.team}</dt>
                            <dd className="mt-1 text-sm normal-case tracking-normal text-ink">{project.fields.teamSize || "-"}</dd>
                          </div>
                        </dl>
                        <Button asChild variant="secondary" className="w-fit">
                          <Link href={`/${lang}/work/${project.fields.slug}`}>{dict.projectCard.cta}</Link>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-gap hairline">
        <div className="grid-shell">
          <Reveal>
            <p className="kicker">{dict.sections.experienceKicker}</p>
            <h2 className="section-heading mt-4 max-w-3xl">{dict.sections.experienceHeading}</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {mergedExperiences.map((experience, index) => (
              <Reveal key={experience.sys.id} delay={index * 0.05}>
                <Card className="rounded-[1.75rem] border-line bg-surface">
                  <CardContent className="p-8">
                    <p className="kicker">{experience.fields.period}</p>
                    <h3 className="mt-3 text-2xl leading-tight">{experience.fields.title}</h3>
                    <p className="mt-1 text-sm text-muted">{experience.fields.company}</p>
                    <p className="mt-5 text-sm leading-7 text-muted">{experience.fields.summary}</p>
                    <ul className="mt-6 space-y-2 text-sm text-ink">
                      {(experience.fields.highlights || []).map((highlight: string) => (
                        <li key={highlight}>- {highlight}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-gap hairline">
        <div className="grid-shell">
          <Reveal>
            <p className="kicker">{dict.sections.skillsKicker}</p>
            <h2 className="section-heading mt-4">{mergedSkills.heading}</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted">{mergedSkills.description}</p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {mergedSkills.groups.map((group: any, index: number) => (
              <Reveal key={group.title} delay={index * 0.07}>
                <Card className="rounded-[1.5rem] border-line bg-surface">
                  <CardContent className="p-7">
                    <h3 className="text-xl">{group.title}</h3>
                    <div className="mt-6 space-y-5">
                      {group.items.map((item: any) => (
                        <div key={item.name}>
                          <div className="mb-2 flex items-end justify-between gap-2">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.note ? <p className="text-xs text-muted">{item.note}</p> : null}
                          </div>
                          <div className="h-2 rounded-full bg-zinc-200">
                            <div
                              className="h-2 rounded-full bg-accent transition-all duration-700"
                              style={{ width: skillWidth(item.level) }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {mergedPhotography.length > 0 ? (
        <section className="section-gap hairline">
          <div className="grid-shell">
            <Reveal>
              <p className="kicker">{dict.sections.photographyKicker}</p>
              <h2 className="section-heading mt-4 max-w-3xl">
                {dict.sections.photographyHeading}
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mergedPhotography.map((item: any, index) => {
                const source = item.fields.image ? getImageUrl(item.fields.image) : null;

                return (
                  <Reveal key={item.sys.id} delay={index * 0.03}>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-line bg-zinc-200">
                      {source ? (
                        <Image
                          src={source}
                          alt={item.fields.image?.fields?.title || item.fields.title}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section id="contact" className="section-gap hairline">
        <div className="grid-shell editorial-grid">
          <Reveal className="col-span-12 lg:col-span-6">
            <p className="kicker">{dict.sections.contactKicker}</p>
            <h2 className="section-heading mt-4 max-w-xl">{mergedContact.heading}</h2>
            <p className="mt-6 max-w-md text-base leading-8 text-muted">{mergedContact.description}</p>
            <div className="mt-8 space-y-2 text-sm text-muted">
              <p>{mergedContact.email}</p>
              <p>{mergedContact.location}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 lg:col-span-6">
            <form action={`mailto:${mergedContact.email}`} method="post" encType="text/plain" className="space-y-4 rounded-[1.75rem] border border-line bg-surface p-7">
              <label className="block text-sm font-medium text-ink" htmlFor="name">
                {dict.contactForm.name}
              </label>
              <Input id="name" name="name" placeholder={dict.contactForm.namePlaceholder} required />
              <label className="block text-sm font-medium text-ink" htmlFor="email">
                {dict.contactForm.email}
              </label>
              <Input id="email" name="email" type="email" placeholder={dict.contactForm.emailPlaceholder} required />
              <label className="block text-sm font-medium text-ink" htmlFor="message">
                {dict.contactForm.message}
              </label>
              <Textarea id="message" name="message" placeholder={dict.contactForm.messagePlaceholder} required />
              <Button type="submit" className="w-full sm:w-auto">
                {dict.contactForm.submit}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <footer className="hairline">
        <div className="grid-shell flex flex-col justify-between gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>{mergedSettings.siteTitle} / {dict.footer.role}</p>
          <div className="flex gap-5">
            {(mergedSettings.socialLinks || []).map((link: any) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="focus-ring rounded-sm hover:text-ink">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
