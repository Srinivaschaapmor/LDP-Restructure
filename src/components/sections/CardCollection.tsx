import { asFields, type Card, type CardCollectionFields, type Section } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { Heading, type HeadingLevel } from "@/components/common/Heading";
import { COLLECTION_COL_CLASS, DEFAULTS, IMAGE_SIZES } from "@/constants";
import styles from "@/components/sections/styles/CardCollection.module.css";

function CardItem({ card, titleLevel }: { card: Card; titleLevel: HeadingLevel }) {
  const f = card?.fields;
  if (!f) return null;
  return (
    <article>
      {f.media ? <MediaImg media={f.media} className={styles.cardMedia} sizes={IMAGE_SIZES.card} /> : null}
      {f.title ? <Heading level={titleLevel} className={styles.cardTitle}>{f.title}</Heading> : null}
      {f.subtitle ? <p className={styles.cardSubtitle}>{f.subtitle}</p> : null}
      {f.body?.fields?.content ? <div className={styles.cardBody}><RichText doc={f.body.fields.content} /></div> : null}
    </article>
  );
}

export function CardCollection({ fields }: { fields: Section["fields"] }) {
  const f = asFields<CardCollectionFields>(fields);
  const layout = f.layout ?? DEFAULTS.collectionLayout;
  const colClass = COLLECTION_COL_CLASS[layout] ?? COLLECTION_COL_CLASS[DEFAULTS.collectionLayout];
  const cardLevel: HeadingLevel = f.heading ? 3 : 2;
  return (
    <section className={styles.collection}>
      <div className="container-xxl">
        {f.heading ? <Heading level={2} className={styles.collectionHeading}>{f.heading}</Heading> : null}
        {f.intro?.fields?.content ? <div className={styles.collectionIntro}><RichText doc={f.intro.fields.content} /></div> : null}
        <div className="row g-4">
          {(f.cards ?? []).map((card) => (
            <div key={card?.sys?.id} className={colClass}>
              <CardItem card={card} titleLevel={cardLevel} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
