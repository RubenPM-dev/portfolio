import {
  contentfulFetch,
  contentfulFetchOne,
} from "./client";
import {
  type Kicker,
  type Project,
  type Experience,
  type Skills,
  type About,
  type Contact,
  type Settings,
  type MediaImage,
} from "./types";

// `locale` is the Contentful locale code (e.g. "en-GB", "es"). When omitted,
// Contentful returns the space's default locale.
export async function getSettings(locale?: string): Promise<Settings | null> {
  return contentfulFetchOne<Settings>({
    content_type: "settings",
    locale,
    limit: 1,
  });
}

export async function getKicker(locale?: string): Promise<Kicker | null> {
  return contentfulFetchOne<Kicker>({
    content_type: "kicker",
    locale,
    limit: 1,
  });
}

export async function getAbout(locale?: string): Promise<About | null> {
  return contentfulFetchOne<About>({
    content_type: "about",
    locale,
    limit: 1,
  });
}

export async function getProjects(locale?: string): Promise<Project[]> {
  const result = await contentfulFetch<Project>({
    content_type: "project",
    locale,
    order: "fields.featuredOrder,-sys.createdAt",
    limit: 100,
  });
  return result?.items.sort((a, b) => (a.fields.featuredOrder || 0) - (b.fields.featuredOrder || 0)) || [];
}

export async function getProjectBySlug(
  slug: string,
  locale?: string
): Promise<Project | null> {
  return contentfulFetchOne<Project>({
    content_type: "project",
    "fields.slug": slug,
    locale,
  });
}

export async function getProjectSlugs(locale?: string): Promise<string[]> {
  const result = await contentfulFetch<Project>({
    content_type: "project",
    locale,
    limit: 100,
  });
  return result?.items.map((p) => p.fields.slug) || [];
}

export async function getExperiences(locale?: string): Promise<Experience[]> {
  const result = await contentfulFetch<Experience>({
    content_type: "experience",
    locale,
    order: "fields.orderRank,-sys.createdAt",
    limit: 100,
  });
  return result?.items || [];
}

export async function getSkills(locale?: string): Promise<Skills | null> {
  return contentfulFetchOne<Skills>({
    content_type: "skills",
    locale,
    limit: 1,
  });
}

export async function getContact(locale?: string): Promise<Contact | null> {
  return contentfulFetchOne<Contact>({
    content_type: "contact",
    locale,
    limit: 1,
  });
}

export async function getPhotography(locale?: string): Promise<MediaImage[]> {
  const result = await contentfulFetch<MediaImage>({
    content_type: "mediaImage",
    "fields.category": "photography",
    locale,
    limit: 100,
  });
  console.log("getPhotography result:", result, result?.items.map((p) => `${p.fields.title} url: ${p.fields.image.fields.file.url}`));
  return result?.items || [];
}
