import type { Media } from "@/lib/types";

// Resolves the image URL from a Contentful asset, falling back to externalUrl.
function resolveUrl(media?: Media): string | undefined {
  const file = media?.fields?.asset?.fields?.file?.url;
  if (file) return file.startsWith("//") ? `https:${file}` : file;
  return media?.fields?.externalUrl;
}

export function MediaImg({
  media, className, priority = false,
}: { media?: Media; className?: string; priority?: boolean }) {
  const url = resolveUrl(media);
  if (!url) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={media?.fields?.altText ?? ""}
      aria-label={media?.fields?.ariaLabel || undefined}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
