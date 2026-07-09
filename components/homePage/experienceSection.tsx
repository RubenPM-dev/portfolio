import { ProjectsCarousel } from "@/components/homePage/projectsCarousel";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getExperiences } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackExperiences } from "@/lib/siteConfig";

export default async function ExperienceSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const experiences = await getExperiences(contentfulLocale[lang]);
  const mergedExperiences = experiences.length ? experiences : fallbackExperiences;

  const experienceCard = (
    experience: (typeof mergedExperiences)[number],
  ) => (
    <Card className="h-full border-line">
      <CardContent className="p-8 max-sm:p-6">
        <p className="kicker">{experience.fields.period}</p>
        <h3 className="mt-3 text-2xl leading-tight">{experience.fields.title}</h3>
        <p className="mt-1 text-sm text-muted">{experience.fields.company}</p>
        <p className="mt-5 text-sm leading-6">{experience.fields.summary}</p>
        <ul className="mt-6 list-disc list-outside space-y-2 pl-5 text-sm text-ink marker:text-muted">
          {(experience.fields.highlights || []).map((highlight: string) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <section
      id="experience"
      className="max-sm:py-[clamp(3rem,6vw,6rem)] sm:pt-[calc(var(--site-header-height,5rem)+6rem)] sm:pb-[calc(var(--site-header-height,5rem)+6rem)]"
    >
      <div className="grid-shell">
        <Reveal>
          <p className="kicker">{dict.sections.experienceKicker}</p>
          <h2 className="section-heading mt-4 max-w-3xl mx-auto">{dict.sections.experienceHeading}</h2>
        </Reveal>
        <div className="mt-10 hidden gap-6 text-left md:grid md:grid-cols-2">
          {mergedExperiences.map((experience, index) => (
            <Reveal key={experience.sys.id} delay={index * 0.05} className="h-full">
              {experienceCard(experience)}
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-8 md:hidden">
        <ProjectsCarousel dotLabel={dict.sections.experienceKicker}>
          {mergedExperiences.map((experience) => (
            <div
              key={experience.sys.id}
              className="carousel-item w-[85vw] max-w-[26rem] text-left"
            >
              {experienceCard(experience)}
            </div>
          ))}
        </ProjectsCarousel>
      </div>
    </section>
  );
}
