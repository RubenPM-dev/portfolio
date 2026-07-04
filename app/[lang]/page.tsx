import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/common/site-header";
import { fallbackSettings } from "@/lib/site-config";
import { getSettings } from "@/lib/contentful/queries";
import { contentfulLocale, defaultLocale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import IntroSection from "@/components/homePage/introSection";
import AboutSection from "@/components/homePage/aboutSection";
import ProjectsSection from "@/components/homePage/projectsSection";
import ExperienceSection from "@/components/homePage/experienceSection";
import SkillsSection from "@/components/homePage/skillsSection";
import ContactForm from "@/components/common/contactForm";
import Footer from "@/components/common/footer";

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

export default async function Home({ params }: Props) {
  const { lang } = await params;

  if (!isLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const settings = await getSettings(contentfulLocale[lang]);
  const mergedSettings = settings?.fields || fallbackSettings.fields;

  return (
    <main>
      <SiteHeader
        locale={lang}
        languageLabel={dict.language.label}
        left={
          <p className="text-xs uppercase tracking-[0.13em] text-muted">{mergedSettings.siteTitle}</p>
        }
      >
        <a href="#work" className="focus-ring text-xs font-bold">{dict.nav.work}</a>
        {/* <a href="#about" className="focus-ring text-xs font-bold">{dict.nav.about}</a> */}
        <a href="#skills" className="focus-ring text-xs font-bold">{dict.nav.skills}</a>
        <a href="#contact" className="focus-ring text-xs font-bold">{dict.nav.contact}</a>
      </SiteHeader>

      <IntroSection lang={lang} />
      {/* <AboutSection lang={lang} /> */}
      <ProjectsSection lang={lang} />
      <ExperienceSection lang={lang} />
      <SkillsSection lang={lang} />
      <ContactForm lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
