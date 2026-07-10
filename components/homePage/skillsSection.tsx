import { Reveal } from "@/components/motion/reveal";
import { SkillsShowcase } from "@/components/homePage/skillsShowcase";
import { getSkills } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackSkills } from "@/lib/siteConfig";

export default async function SkillsSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const skills = await getSkills(contentfulLocale[lang]);
  const mergedSkills = skills?.fields || fallbackSkills.fields;

  return (
    <section
      id="skills"
      className="max-sm:py-[clamp(3rem,6vw,6rem)] sm:pt-[calc(var(--site-header-height,5rem)+6rem)] sm:pb-[calc(var(--site-header-height,5rem)+6rem)]"
    >
      <div className="grid-shell text-center">
        <Reveal>
          <p className="kicker">{dict.sections.skillsKicker}</p>
          <h2 className="section-heading mt-4">{mergedSkills.heading}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-muted">{mergedSkills.description}</p>
        </Reveal>

        <SkillsShowcase groups={mergedSkills.groups} />
      </div>
    </section>
  );
}
