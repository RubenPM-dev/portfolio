import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Project } from "@/lib/contentful/types";

export default function RolleAndChallengesSection({
  project,
  lang,
}: {
  project: Project;
  lang: Locale;
}) {
  const dict = getDictionary(lang);

  return (
    <section className="section-gap">
      <div className="grid-shell grid gap-8 lg:grid-cols-4">
        <aside className="rounded-[var(--radius)] border border-line bg-surface p-6 lg:col-span-1">
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
              <dd className="mt-1 text-ink">
                {(project.fields.technologies || []).join(", ") || "-"}
              </dd>
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
            <p className="mt-4 text-base leading-8 text-muted">
              {project.fields.outcome || dict.project.outcomeFallback}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.fields.links?.website ? (
              <Button asChild>
                <a
                  href={project.fields.links.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {dict.project.website}
                </a>
              </Button>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
