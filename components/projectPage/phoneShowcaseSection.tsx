import {
  PhoneShowcase,
  type ShowcaseCaption,
} from "@/components/motion/phoneShowcase";
import { getImageUrl } from "@/lib/contentful/image";
import { Project } from "@/lib/contentful/types";

export default function PhoneShowcaseSection({ project }: { project: Project }) {
  const galleryScreens = (project.fields.gallery || [])
    .map((image) => getImageUrl(image))
    .filter((src): src is string => Boolean(src));

  if (!galleryScreens.length || !project.fields.features) {
    return null;
  }

  // Contentful returns `features` as an array on some projects and a single
  // {heading, body} object on others — normalize to an array either way.
  const rawFeatures = project.fields.features as unknown;
  const captions: ShowcaseCaption[] = Array.isArray(rawFeatures)
    ? (rawFeatures as ShowcaseCaption[])
    : rawFeatures
      ? [rawFeatures as ShowcaseCaption]
      : [];

  return (
    <section>
      <PhoneShowcase
        screens={galleryScreens}
        alt={project.fields.title}
        captions={captions}
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
