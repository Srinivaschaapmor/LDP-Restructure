import { asFields, type RichTextItemFields, type Section } from "@/types";
import { RichText } from "@/components/ui/RichText";

export function RichTextItemSection({ fields }: { fields: Section["fields"] }) {
  const f = asFields<RichTextItemFields>(fields);
  return (
    <section className="ld-richtext">
      <div className="container-xxl">
        <div className="ld-richtext__inner"><RichText doc={f.content} /></div>
      </div>
    </section>
  );
}
