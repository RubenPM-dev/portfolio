import Image from "next/image";
import { ProjectsCarousel } from "@/components/homePage/projectsCarousel";
import { ProjectCardLink } from "@/components/homePage/projectCardLink";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { getProjects } from "@/lib/contentful/queries";
import { getImageUrl } from "@/lib/contentful/image";
import { contentfulLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { fallbackProjects } from "@/lib/siteConfig";

export default async function ProjectsSection({
  lang,
  excludeSlug,
}: {
  lang: Locale;
  excludeSlug?: string;
}) {
  const dict = getDictionary(lang);
  const projects = await getProjects(contentfulLocale[lang]);
  const allProjects = projects.length ? projects : fallbackProjects;
  const mergedProjects = excludeSlug
    ? allProjects.filter((project) => project.fields.slug !== excludeSlug)
    : allProjects;

  if (!mergedProjects.length) {
    return null;
  }

  return (
    <section
      id="work"
      className="max-sm:pt-6 max-sm:pb-4 sm:pt-[calc(var(--site-header-height,5rem)+6rem)] sm:pb-[calc(var(--site-header-height,5rem)+6rem)]"
    >
      <div className="grid-shell text-center">
        <Reveal>
          <p className="kicker">{dict.sections.workKicker}</p>
          <h2 className="section-heading mt-4 max-w-3xl mx-auto text-balance">
            {excludeSlug ? dict.sections.otherWorkeHeading : dict.sections.workHeading}
          </h2>
        </Reveal>
      </div>

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
                  className="carousel-item carousel-item-fill w-[85vw] max-w-[26rem] sm:aspect-[16/21] sm:w-auto sm:max-w-none"
                >
                  <Card className="floating-card flex h-full flex-1 flex-col overflow-hidden">
                    <div className="relative aspect-[16/9] w-full shrink-0">
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
                      <p className="text-sm leading-6 text-muted">
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
    </section>
  );
}
