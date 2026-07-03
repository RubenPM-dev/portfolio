type MediaLike = {
  sys?: { id: string };
  fields?: {
    file?: { url?: string };
  };
};

// Accepts a single media asset or a list (some Contentful fields are configured
// as a list of media). Falls back to the first asset when given an array.
export function getImageUrl(image?: MediaLike | MediaLike[] | null): string | null {
  const asset = Array.isArray(image) ? image[0] : image;
  const url = asset?.fields?.file?.url;

  if (!url) {
    return null;
  }

  // Contentful URLs need https:// prefix if missing
  return url.startsWith("http") ? url : `https:${url}`;
}
