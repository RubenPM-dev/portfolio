export function getImageUrl(image?: {
  sys?: { id: string };
  fields?: {
    file: { url: string };
  };
}): string | null {
  if (!image?.fields?.file?.url) {
    return null;
  }

  // Contentful URLs need https:// prefix if missing
  const url = image.fields.file.url;
  return url.startsWith("http") ? url : `https:${url}`;
}
