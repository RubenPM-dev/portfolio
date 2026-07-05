import Image from "next/image";
import { ProjectsCarousel } from "@/components/homePage/projectsCarousel";
import { ProjectCardLink } from "@/components/homePage/projectCardLink";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getProjects } from "@/lib/contentful/queries";
import { getImageUrl } from "@/lib/contentful/image";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { fallbackProjects } from "@/lib/site-config";

export default async function ProjectsSection({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  const projects = await getProjects(contentfulLocale[lang]);
  const mergedProjects = projects.length ? projects : fallbackProjects;

  return (
    <section
      id="work"
      className="hairline max-sm:pt-6 max-sm:pb-4 sm:pt-[calc(var(--site-header-height,5rem)+1rem)] sm:pb-4"
    >
      <div className="grid-shell">
        <Reveal>
          <p className="kicker">{dict.sections.workKicker}</p>
          <h2 className="section-heading mt-4 max-w-3xl mx-auto text-balance">
            {dict.sections.workHeading}
          </h2>
        </Reveal>

        <div className="mt-4 max-sm:mt-6">
          <ProjectsCarousel dotLabel={dict.projectCard.goToProject}>
            {mergedProjects.map((project, _) => {
              const projectImage = project.fields.heroSmall
                ? getImageUrl(project.fields.heroSmall)
                : null;

              return (
                <ProjectCardLink
                  key={project.sys.id}
                  href={`/${lang}/work/${project.fields.slug}`}
                  slug={project.fields.slug}
                  ariaLabel={`${dict.projectCard.cta}: ${project.fields.title}`}
                  className="carousel-item carousel-item-fill w-[85vw] max-w-[26rem] sm:w-[32rem] sm:max-w-[32rem]"
                >
                  <Card className="floating-card flex h-full flex-1 flex-col overflow-hidden bg-surface">
                    <div className="relative aspect-[16/9] w-full shrink-0 sm:max-h-[50%]">
                      {projectImage ? (
                        <Image
                          src={projectImage}
                          alt={
                            project.fields.heroSmall?.fields?.title ||
                            project.fields.title
                          }
                          fill
                          sizes="(max-width: 640px) 85vw, 32rem"
                          className="object-cover object-left-top"
                        />
                      ) : (
                        <div
                          className="h-full w-full bg-[linear-gradient(140deg,#efe7d8,#ddd3be)]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <CardContent className="flex min-h-0 flex-1 flex-col items-start gap-2 p-6 text-left max-sm:p-5">
                      <p className="kicker">
                        {project.fields.company ||
                          dict.projectCard.featuredFallback}
                      </p>
                      <h3 className="text-2xl leading-tight">
                        {project.fields.title}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-6 text-muted">
                        {project.fields.excerpt}
                      </p>
                      <span className="mt-auto inline-flex shrink-0 items-center justify-center rounded-full bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-900">
                        {dict.projectCard.cta}
                      </span>
                    </CardContent>
                  </Card>
                </ProjectCardLink>
              );
            })}
          </ProjectsCarousel>
        </div>
      </div>
    </section>
  );
}
