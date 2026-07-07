import type { Document } from "@contentful/rich-text-types";
import type { Media, Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { RichText } from "@/components/primitives/RichText";

interface McbFields {
  eyebrow?: string; heading?: string; body?: Document; media?: Media;
  mediaPlacement?: string; tone?: string;
}

export function MediaContentBlock({ fields }: { fields: Section["fields"] }) {
  const f = fields as unknown as McbFields;
  const placement = f.mediaPlacement ?? "top";
  return (
    <section className={`ld-mcb ld-mcb--${placement} ld-tone--${f.tone ?? "default"}`}>
      <div className="container">
        {f.eyebrow ? <p className="ld-mcb__eyebrow">{f.eyebrow}</p> : null}
        {f.heading ? <h1 className="ld-mcb__heading">{f.heading}</h1> : null}
        {f.media ? <MediaImg media={f.media} className="ld-mcb__media" /> : null}
        {f.body ? <div className="ld-mcb__body"><RichText doc={f.body} /></div> : null}
      </div>
    </section>
  );
}
