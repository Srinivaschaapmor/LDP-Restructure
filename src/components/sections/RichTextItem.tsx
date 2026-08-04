import { asFields, type RichTextItemFields, type Section } from "@/types";
import { RichText } from "@/components/ui/RichText";
import styles from "@/components/sections/RichTextItem.module.css";

export function RichTextItemSection({ fields }: { fields: Section["fields"] }) {
  const f = asFields<RichTextItemFields>(fields);
  return (
    <section className={styles.richtext}>
      <div className="container-xxl">
        <div className={styles.inner}><RichText doc={f.content} /></div>
      </div>
    </section>
  );
}
