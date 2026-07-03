import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getExperiences } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { fallbackExperiences } from "@/lib/site-config";

export default async function ExperienceSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const experiences = await getExperiences(contentfulLocale[lang]);
  const mergedExperiences = experiences.length ? experiences : fallbackExperiences;

  return (
    <section className="section-gap hairline">
      <div className="grid-shell">
        <Reveal>
          <p className="kicker">{dict.sections.experienceKicker}</p>
          <h2 className="section-heading mt-4 max-w-3xl">{dict.sections.experienceHeading}</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {mergedExperiences.map((experience, index) => (
            <Reveal key={experience.sys.id} delay={index * 0.05}>
              <Card className="border-line bg-surface">
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
  );
}
