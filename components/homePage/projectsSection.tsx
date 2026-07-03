import Image from "next/image";
import Link from "next/link";

import { ProjectsCarousel } from "@/components/homePage/projectsCarousel";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
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
      className="hairline pt-[clamp(4rem,8vw,8rem)] pb-[clamp(4rem,8vw,8rem)] max-sm:pt-6 max-sm:pb-4"
    >
      <div className="grid-shell">
        <Reveal>
          <p className="kicker">{dict.sections.workKicker}</p>
          <h2 className="section-heading mt-4 max-w-3xl text-balance">
            {dict.sections.workHeading}
          </h2>
        </Reveal>

        <div className="mt-14 max-sm:mt-6">
          <ProjectsCarousel dotLabel={dict.projectCard.goToProject}>
            {mergedProjects.map((project, _) => {
              const projectImage = project.fields.heroSmall
                ? getImageUrl(project.fields.heroSmall)
                : null;

              return (
                <div
                  key={project.sys.id}
                  className="carousel-item carousel-item-fill w-[85vw] max-w-[26rem] sm:h-auto sm:w-[24rem]"
                >
                  <Card className="floating-card flex flex-1 flex-col overflow-hidden bg-surface">
                    <div className="relative aspect-[16/9] w-full shrink-0">
                      {projectImage ? (
                        <Image
                          src={projectImage}
                          alt={
                            project.fields.heroSmall?.fields?.title ||
                            project.fields.title
                          }
                          fill
                          sizes="(max-width: 640px) 85vw, 24rem"
                          className="object-cover object-left-top"
                        />
                      ) : (
                        <div
                          className="h-full w-full bg-[linear-gradient(140deg,#efe7d8,#ddd3be)]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <CardContent className="flex flex-1 flex-col justify-between gap-6 p-8 max-sm:gap-4 max-sm:p-6">
                      <div>
                        <p className="kicker">
                          {project.fields.company ||
                            dict.projectCard.featuredFallback}
                        </p>
                        <h3 className="mt-3 text-2xl leading-tight">
                          {project.fields.title}
                        </h3>
                        <p className="mt-4 text-sm leading-7 text-muted">
                          {project.fields.excerpt}
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="secondary"
                        size="sm"
                        className="w-fit"
                      >
                        <Link href={`/${lang}/work/${project.fields.slug}`}>
                          {dict.projectCard.cta}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </ProjectsCarousel>
        </div>
      </div>
    </section>
  );
}
