import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getSkills } from "@/lib/contentful/queries";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackSkills } from "@/lib/siteConfig";

function skillWidth(level: number) {
  return `${Math.max(10, Math.min(100, level * 20))}%`;
}

export default async function SkillsSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const skills = await getSkills(contentfulLocale[lang]);
  const mergedSkills = skills?.fields || fallbackSkills.fields;

  return (
    <section
      id="skills"
      className="max-sm:py-[clamp(3rem,6vw,6rem)] sm:pt-[calc(var(--site-header-height,5rem)+6rem)] sm:pb-[calc(var(--site-header-height,5rem)+6rem)]"
    >
      <div className="grid-shell">
        <Reveal>
          <p className="kicker">{dict.sections.skillsKicker}</p>
          <h2 className="section-heading mt-4">{mergedSkills.heading}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-8 text-muted">{mergedSkills.description}</p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {mergedSkills.groups.map((group, index) => (
            <Reveal key={group.title} delay={index * 0.07}>
              <Card className="border-line">
                <CardContent className="p-7">
                  <h3 className="text-xl">{group.title}</h3>
                  <div className="mt-6 space-y-5">
                    {group.items.map((item) => (
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
  );
}
