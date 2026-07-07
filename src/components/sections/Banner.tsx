import type { Media, Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";

interface BannerFields { heading?: string; backgroundImage?: Media; variant?: string; height?: string }

export function Banner({ fields }: { fields: Section["fields"] }) {
  const f = fields as unknown as BannerFields;
  return (
    <section className={`ld-banner ld-banner--${f.height ?? "md"}`}>
      <MediaImg media={f.backgroundImage} className="ld-banner__bg" priority />
      <span className="ld-banner__overlay" aria-hidden="true" />
      {f.heading ? (
        <div className="container ld-banner__inner">
          <h1 className="ld-banner__heading">{f.heading}</h1>
        </div>
      ) : null}
    </section>
  );
}
