import type { Document } from "@contentful/rich-text-types";
import { asFields, type Section } from "@/lib/types";
import { RichText } from "@/components/primitives/RichText";
import { DEFAULTS } from "@/lib/constants";

interface RichTextFields { content?: Document; width?: string }

export function RichTextBlock({ fields }: { fields: Section["fields"] }) {
  const f = asFields<RichTextFields>(fields);
  const width = f.width ?? DEFAULTS.richTextWidth;
  return (
    <section className={`ld-richtext ld-richtext--${width}`}>
      <div className="container">
        <div className="ld-richtext__inner"><RichText doc={f.content} /></div>
      </div>
    </section>
  );
}
