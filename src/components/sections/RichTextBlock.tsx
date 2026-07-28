import { asFields, type RichTextBlockFields, type Section } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { DEFAULTS } from "@/lib/constants";

export function RichTextBlock({ fields }: { fields: Section["fields"] }) {
  const f = asFields<RichTextBlockFields>(fields);
  const width = f.width ?? DEFAULTS.richTextWidth;
  return (
    <section className={`ld-richtext ld-richtext--${width}`}>
      <div className="container-xxl">
        <div className="ld-richtext__inner"><RichText doc={f.content} /></div>
      </div>
    </section>
  );
}
