import { asFields, type MediaContentBlockFields, type Section } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { RichText } from "@/components/ui/RichText";
import { Heading } from "@/components/ui/Heading";
import { DEFAULTS, IMAGE_SIZES } from "@/lib/constants";

export function MediaContentBlock({ fields }: { fields: Section["fields"] }) {
  const f = asFields<MediaContentBlockFields>(fields);
  const placement = f.mediaPlacement ?? DEFAULTS.mediaPlacement;
  const tone = f.tone ?? DEFAULTS.tone;
  return (
    <section className={`ld-mcb ld-mcb--${placement} ld-tone--${tone}`}>
      <div className="container-xxl">
        {f.eyebrow ? <p className="ld-mcb__eyebrow">{f.eyebrow}</p> : null}
        {/* The article title is the page's single h1. */}
        {f.heading ? <Heading level={1} className="ld-mcb__heading">{f.heading}</Heading> : null}
        {f.media ? (
          <div className="ld-mcb__media">
            <MediaImg media={f.media} sizes={IMAGE_SIZES.content} fill />
          </div>
        ) : null}
        {f.body?.fields?.content ? <div className="ld-mcb__body"><RichText doc={f.body.fields.content} /></div> : null}
        {f.bullets?.fields?.content ? <div className="ld-mcb__bullets"><RichText doc={f.bullets.fields.content} /></div> : null}
      </div>
    </section>
  );
}
