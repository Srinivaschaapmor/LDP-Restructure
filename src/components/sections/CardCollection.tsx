import { asFields, type Card, type Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { RichText } from "@/components/primitives/RichText";
import { Heading, type HeadingLevel } from "@/components/primitives/Heading";
import { COLLECTION_COL_CLASS, DEFAULTS, IMAGE_SIZES } from "@/lib/constants";

interface CardCollectionFields { heading?: string; layout?: string; cards?: Card[] }

function CardItem({ card, titleLevel }: { card: Card; titleLevel: HeadingLevel }) {
  const f = card?.fields;
  if (!f) return null;
  return (
    <article className="ld-card">
      {f.media ? <MediaImg media={f.media} className="ld-card__media" sizes={IMAGE_SIZES.card} /> : null}
      {f.title ? <Heading level={titleLevel} className="ld-card__title">{f.title}</Heading> : null}
      {f.subtitle ? <p className="ld-card__subtitle">{f.subtitle}</p> : null}
      {f.body ? <div className="ld-card__body"><RichText doc={f.body} /></div> : null}
    </article>
  );
}

export function CardCollection({ fields }: { fields: Section["fields"] }) {
  const f = asFields<CardCollectionFields>(fields);
  const layout = f.layout ?? DEFAULTS.collectionLayout;
  const colClass = COLLECTION_COL_CLASS[layout] ?? COLLECTION_COL_CLASS[DEFAULTS.collectionLayout];
  // Keep the outline valid: if the collection has an h2, cards are h3;
  // otherwise the cards sit directly under the page h1, so they are h2.
  const cardLevel: HeadingLevel = f.heading ? 3 : 2;
  return (
    <section className={`ld-collection ld-collection--${layout}`}>
      <div className="container">
        {f.heading ? <Heading level={2} className="ld-collection__heading">{f.heading}</Heading> : null}
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
