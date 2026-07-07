import Image from "next/image";
import type { Media } from "@/lib/types";

// Pure helpers (exported for unit tests).
export function resolveUrl(media?: Media): string | undefined {
  const file = media?.fields?.asset?.fields?.file?.url;
  if (file) return file.startsWith("//") ? `https:${file}` : file;
  return media?.fields?.externalUrl;
}

export function resolveDimensions(media?: Media): { width?: number; height?: number } {
  const img = media?.fields?.asset?.fields?.file?.details?.image;
  return {
    width: media?.fields?.width ?? img?.width,
    height: media?.fields?.height ?? img?.height,
  };
}

// `fill` for background/cover images (parent must be positioned); otherwise
// intrinsic width/height are required so the layout reserves space (no CLS).
export function MediaImg({
  media, className, sizes, priority = false, fill = false,
}: { media?: Media; className?: string; sizes?: string; priority?: boolean; fill?: boolean }) {
  const url = resolveUrl(media);
  if (!url) return null;
  const alt = media?.fields?.altText ?? "";

  if (fill) {
    return <Image src={url} alt={alt} fill sizes={sizes ?? "100vw"} className={className} priority={priority} />;
  }

  const { width, height } = resolveDimensions(media);
  if (!width || !height) return null; // non-fill images must declare dimensions
  return (
    <Image src={url} alt={alt} width={width} height={height} sizes={sizes} className={className} priority={priority} />
  );
}
