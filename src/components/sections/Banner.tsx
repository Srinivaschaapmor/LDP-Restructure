import { asFields, type Media, type Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { Heading } from "@/components/primitives/Heading";
import { DEFAULTS, IMAGE_SIZES } from "@/lib/constants";

interface BannerFields { heading?: string; backgroundImage?: Media; variant?: string; height?: string }

export function Banner({ fields }: { fields: Section["fields"] }) {
  const f = asFields<BannerFields>(fields);
  const height = f.height ?? DEFAULTS.bannerHeight;
  return (
    <section className={`ld-banner ld-banner--${height}`} aria-label={f.heading || "Banner"}>
      <MediaImg media={f.backgroundImage} className="ld-banner__bg" sizes={IMAGE_SIZES.hero} priority fill />
      {/* Overlay only when there's text to keep readable — a text-less banner stays a clean photo. */}
      {f.heading ? <span className="ld-banner__overlay" aria-hidden="true" /> : null}
      {f.heading ? (
        <div className="container ld-banner__inner">
          {/* h2: the page's h1 is the article title in the content block below */}
          <Heading level={2} className="ld-banner__heading">{f.heading}</Heading>
        </div>
      ) : null}
    </section>
  );
}
