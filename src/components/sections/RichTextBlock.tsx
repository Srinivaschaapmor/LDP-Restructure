import type { Document } from "@contentful/rich-text-types";
import type { Section } from "@/lib/types";
import { RichText } from "@/components/primitives/RichText";

interface RichTextFields { content?: Document; width?: string }

export function RichTextBlock({ fields }: { fields: Section["fields"] }) {
  const f = fields as unknown as RichTextFields;
  return (
    <section className={`ld-richtext ld-richtext--${f.width ?? "default"}`}>
      <div className="container">
        <div className="ld-richtext__inner"><RichText doc={f.content} /></div>
      </div>
    </section>
  );
}
