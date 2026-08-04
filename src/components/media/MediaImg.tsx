import Image from "next/image";
import type { CSSProperties } from "react";
import type { Media } from "@/types";

// Contentful Images API params (https://www.contentful.com/developers/docs/references/images-api/).
// Only meaningful for fixed, non-responsive images (e.g. logos/icons): shrinking the
// ORIGIN payload before next/image's own optimizer ever fetches it. Never apply a
// `width` transform to a `fill` image whose `sizes` varies by viewport (banner/hero
// photos) — that would cap every responsive variant next/image generates to one
// fixed origin width, undermining its own srcset logic. quality/format don't have
// that conflict (next/image re-encodes regardless), so those are always safe.
export interface ImageTransform { width?: number; quality?: number; format?: "webp" | "avif" | "jpg" | "png" }

// Pure helpers (exported for unit tests).
export function resolveUrl(media?: Media, transform?: ImageTransform): string | undefined {
  const file = media?.fields?.asset?.fields?.file?.url;
  const url = file ? (file.startsWith("//") ? `https:${file}` : file) : media?.fields?.externalUrl;
  if (!url || !transform || !url.includes("images.ctfassets.net")) return url;

  const params = new URLSearchParams();
  if (transform.width) params.set("w", String(transform.width));
  if (transform.quality) params.set("q", String(transform.quality));
  if (transform.format) params.set("fm", transform.format);
  const qs = params.toString();
  return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
}

export function resolveDimensions(media?: Media): { width?: number; height?: number } {
  const img = media?.fields?.asset?.fields?.file?.details?.image;
  return {
    width: media?.fields?.width ?? img?.width,
    height: media?.fields?.height ?? img?.height,
  };
}

interface MediaImgProps {
  media?: Media; className?: string; style?: CSSProperties; sizes?: string;
  priority?: boolean; fill?: boolean; transform?: ImageTransform;
  fetchPriority?: "high" | "low" | "auto"; loading?: "eager" | "lazy";
}

// `fill` for background/cover images (parent must be positioned); otherwise
// intrinsic width/height are required so the layout reserves space (no CLS).
export function MediaImg({
  media, className, style, sizes, priority = false, fill = false, transform, fetchPriority, loading,
}: MediaImgProps) {
  const url = resolveUrl(media, transform);
  if (!url) return null;
  const alt = media?.fields?.altText ?? "";
  // priority and loading="lazy" are contradictory to next/image (priority forces
  // eager); only pass loading through when this image isn't marked priority.
  const loadingProp = priority ? undefined : loading;

  if (fill) {
    return (
      <Image src={url} alt={alt} fill sizes={sizes ?? "100vw"} className={className} style={style}
        priority={priority} fetchPriority={fetchPriority} loading={loadingProp} />
    );
  }

  const { width, height } = resolveDimensions(media);
  if (!width || !height) return null; // non-fill images must declare dimensions
  return (
    <Image src={url} alt={alt} width={width} height={height} sizes={sizes} className={className} style={style}
      priority={priority} fetchPriority={fetchPriority} loading={loadingProp} />
  );
}
