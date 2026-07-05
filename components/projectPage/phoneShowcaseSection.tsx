import { PhoneShowcase } from "@/components/motion/phone-showcase";
import { getImageUrl } from "@/lib/contentful/image";
import { Project } from "@/lib/contentful/types";

export default function PhoneShowcaseSection({ project }: { project: Project }) {
  const galleryScreens = (project.fields.gallery || [])
    .map((image) => getImageUrl(image))
    .filter((src): src is string => Boolean(src));

  if (!galleryScreens.length || !project.fields.features) {
    return null;
  }

  return (
    <section>
      <PhoneShowcase
        screens={galleryScreens}
        alt={project.fields.title}
        captions={project.fields.features || []}
        header={
          <>
            <h1 className="max-w-4xl text-balance text-[clamp(1.25rem,1.5vw,1.5rem)] font-bold">
              {project.fields.title}
            </h1>
          </>
        }
        project={project}
      />
    </section>
  );
}
