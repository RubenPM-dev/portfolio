import { createClient } from "contentful";

let client: any | null = null;

const hasCFConfig =
  process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID &&
  process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (hasCFConfig) {
  client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
    host: "cdn.contentful.com", // Use preview API for drafts if needed
  });
}

interface ContentfulErrorInfo {
  status?: number;
  details?: { errors?: Array<{ name?: string; value?: string; path?: string[] }> };
}

// A query for a content type that isn't in the space yet (e.g. a singleton
// authored later). Expected during setup — degrade to the fallback quietly
// rather than logging a scary error.
function isUnknownContentType(info: ContentfulErrorInfo): boolean {
  return Boolean(
    info.details?.errors?.some((entry) => entry.name === "unknownContentType"),
  );
}

// contentful.js (v11) throws an Error whose `message` is a JSON string holding
// `status`/`details`/etc. — they are NOT exposed as top-level properties. Older
// shapes do expose them directly, so support both.
function parseContentfulError(error: unknown): ContentfulErrorInfo {
  const maybeError = error as ContentfulErrorInfo & { message?: string };

  if (typeof maybeError.status === "number" || maybeError.details) {
    return maybeError;
  }

  if (typeof maybeError.message === "string") {
    try {
      return JSON.parse(maybeError.message) as ContentfulErrorInfo;
    } catch {
      // message wasn't JSON — fall through
    }
  }

  return {};
}

export async function contentfulFetch<T>(
  query: Record<string, any>
): Promise<{ items: T[]; total: number } | null> {
  if (!client) {
    console.warn("Contentful client not configured. Using fallback data.");
    return null;
  }

  try {
    const response = await (client as any).getEntries(query);
    return {
      items: response.items as T[],
      total: response.total,
    };
  } catch (error) {
    const errorInfo = parseContentfulError(error);

    const hasUnknownFieldError = errorInfo.status === 422
      && errorInfo.details?.errors?.some((entry) => entry.name === "unknown");

    if (hasUnknownFieldError && typeof query.order === "string") {
      try {
        const { order, ...queryWithoutOrder } = query;
        const fallbackResponse = await (client as any).getEntries(queryWithoutOrder);
        return {
          items: fallbackResponse.items as T[],
          total: fallbackResponse.total,
        };
      } catch (retryError) {
        console.error("Contentful fetch retry error:", retryError);
        return null;
      }
    }

    if (isUnknownContentType(errorInfo)) {
      console.warn(
        `Contentful: content type "${query.content_type}" not found yet — using fallback.`,
      );
      return null;
    }

    console.error("Contentful fetch error:", error);
    return null;
  }
}

export async function contentfulFetchOne<T>(
  query: Record<string, any>
): Promise<T | null> {
  if (!client) {
    console.warn("Contentful client not configured. Using fallback data.");
    return null;
  }

  try {
    const response = await (client as any).getEntries(query);
    return (response.items[0] as T) || null;
  } catch (error) {
    if (isUnknownContentType(parseContentfulError(error))) {
      console.warn(
        `Contentful: content type "${query.content_type}" not found yet — using fallback.`,
      );
      return null;
    }
    console.error("Contentful fetch error:", error);
    return null;
  }
}
