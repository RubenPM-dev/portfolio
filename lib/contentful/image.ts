type MediaLike = {
  sys?: { id: string };
  fields?: {
    file?: { url?: string };
  };
};

export function getImageUrl(image?: MediaLike | MediaLike[] | null): string | null {
  const asset = Array.isArray(image) ? image[0] : image;
  const url = asset?.fields?.file?.url;

  if (!url) {
    return null;
  }

  return url.startsWith("http") ? url : `https:${url}`;
}
