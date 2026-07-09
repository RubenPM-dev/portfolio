import Image from "next/image";

import { getImageUrl } from "@/lib/contentful/image";
import { Project } from "@/lib/contentful/types";

export default function HeroImageSection({ project }: { project: Project }) {
  const hero = project.fields.heroImage
    ? getImageUrl(project.fields.heroImage)
    : null;

  return (
    <>
      {hero ? (
        <section className="grid-shell max-w-[800px] sm:pt-[calc(var(--site-header-height,5rem)+6rem)]">
          <div className="mt-10 overflow-hidden rounded-[var(--radius)]">
            {hero && (
              <Image
                src={hero}
                alt={
                  project.fields.heroImage?.fields?.title ||
                  project.fields.title
                }
                width={4400}
                height={2400}
                className="h-auto max-w-[800px]"
                priority
              />
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
