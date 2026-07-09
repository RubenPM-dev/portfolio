import { Button } from "@/components/ui/button";
import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
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
        <aside className="glass-surface rounded-[var(--radius)] border border-line p-6 lg:col-span-1">
          <dl className="space-y-5 text-sm leading-8">
            <div>
              <dt className="kicker">{dict.project.role}</dt>
              <dd className="mt-1 text-ink">{project.fields.role || "-"}</dd>
            </div>
            {project.fields.company ? (
              <div>
                <dt className="kicker">{dict.project.company}</dt>
                <dd className="mt-1 text-ink">
                  {project.fields.company || "-"}
                </dd>
              </div>
            ) : null}
            {project.fields.teamSize ? (
              <div>
                <dt className="kicker">{dict.project.teamSize}</dt>
                <dd className="mt-1 text-ink">
                  {project.fields.teamSize || "-"}
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="kicker">{dict.project.technologies}</dt>
              <ul className="mt-1 text-ink">
                {(project.fields.technologies || []).map((tech) => (
                  <li key={tech} className="list-inside list-disc">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </dl>
        </aside>

        <article className="space-y-10 lg:col-span-3">
          <div>
            <h2 className="text-3xl text-muted">{dict.project.challenges}</h2>
            <p className="mt-4 space-y-3 text-base leading-8">
              {project.fields.challenges}
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-muted">
              {dict.project.contributions}
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-8">
              {(project.fields.contributions || []).map(
                (contribution: string) => (
                  <li key={contribution}>{contribution}</li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl text-muted">{dict.project.outcome}</h2>
            <p className="mt-4 text-base leading-8">
              {project.fields.outcome || dict.project.outcomeFallback}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.fields.links?.website ? (
              <Button
                asChild
                trackId="project_website"
                trackProps={{ project: project.fields.slug }}
                aria-label="Open project website"
              >
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
