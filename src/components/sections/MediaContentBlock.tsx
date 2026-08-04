import { asFields, type MediaContentBlockFields, type Section } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { Heading } from "@/components/common/Heading";
import { DEFAULTS, IMAGE_SIZES } from "@/constants";
import styles from "@/components/sections/styles/MediaContentBlock.module.css";

const TONE_CLASS: Record<string, string | undefined> = {
  inverse: styles.toneInverse, subtle: styles.toneSubtle,
};

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function MediaContentBlock({ fields }: { fields: Section["fields"] }) {
  const f = asFields<MediaContentBlockFields>(fields);
  const placement = f.mediaPlacement ?? DEFAULTS.mediaPlacement;
  const tone = f.tone ?? DEFAULTS.tone;
  return (
    <section className={cx(styles.mcb, TONE_CLASS[tone])} data-placement={placement}>
      <div className="container-xxl">
        {f.eyebrow ? <p className={styles.eyebrow}>{f.eyebrow}</p> : null}
        {f.heading ? <Heading level={1} className={styles.heading}>{f.heading}</Heading> : null}
        {f.media ? (
          <div className={styles.media}>
            <MediaImg media={f.media} sizes={IMAGE_SIZES.content} fill />
          </div>
        ) : null}
        {f.body?.fields?.content ? <div className={styles.body}><RichText doc={f.body.fields.content} /></div> : null}
        {f.bullets?.fields?.content ? <div className={styles.bullets}><RichText doc={f.bullets.fields.content} /></div> : null}
      </div>
    </section>
  );
}
