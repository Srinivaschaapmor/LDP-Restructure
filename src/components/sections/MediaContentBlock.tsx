import type { Document } from "@contentful/rich-text-types";
import { asFields, type Media, type Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { RichText } from "@/components/primitives/RichText";
import { Heading } from "@/components/primitives/Heading";
import { DEFAULTS, IMAGE_SIZES } from "@/lib/constants";

interface McbFields {
  eyebrow?: string; heading?: string; body?: Document; media?: Media;
  mediaPlacement?: string; tone?: string;
}

export function MediaContentBlock({ fields }: { fields: Section["fields"] }) {
  const f = asFields<McbFields>(fields);
  const placement = f.mediaPlacement ?? DEFAULTS.mediaPlacement;
  const tone = f.tone ?? DEFAULTS.tone;
  return (
    <section className={`ld-mcb ld-mcb--${placement} ld-tone--${tone}`}>
      <div className="container">
        {f.eyebrow ? <p className="ld-mcb__eyebrow">{f.eyebrow}</p> : null}
        {/* The article title is the page's single h1. */}
        {f.heading ? <Heading level={1} className="ld-mcb__heading">{f.heading}</Heading> : null}
        {f.media ? <MediaImg media={f.media} className="ld-mcb__media" sizes={IMAGE_SIZES.content} /> : null}
        {f.body ? <div className="ld-mcb__body"><RichText doc={f.body} /></div> : null}
      </div>
    </section>
  );
}
