import type { Card, Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { RichText } from "@/components/primitives/RichText";

interface CardCollectionFields { heading?: string; layout?: string; cards?: Card[] }

// Map the design-system layout enum → a Bootstrap column class.
const COLS: Record<string, string> = {
  "grid-2": "col-12 col-md-6",
  "grid-3": "col-12 col-md-6 col-lg-4",
  "grid-4": "col-6 col-lg-3",
  list: "col-12",
  split: "col-12 col-md-6",
  carousel: "col-12 col-md-6 col-lg-4",
};

function CardItem({ card }: { card: Card }) {
  const f = card?.fields;
  if (!f) return null;
  return (
    <article className="ld-card">
      {f.media ? <MediaImg media={f.media} className="ld-card__media" /> : null}
      {f.title ? <h3 className="ld-card__title">{f.title}</h3> : null}
      {f.subtitle ? <p className="ld-card__subtitle">{f.subtitle}</p> : null}
      {f.body ? <div className="ld-card__body"><RichText doc={f.body} /></div> : null}
    </article>
  );
}

export function CardCollection({ fields }: { fields: Section["fields"] }) {
  const f = fields as unknown as CardCollectionFields;
  const layout = f.layout ?? "grid-3";
  const colClass = COLS[layout] ?? COLS["grid-3"];
  return (
    <section className={`ld-collection ld-collection--${layout}`}>
      <div className="container">
        {f.heading ? <h2 className="ld-collection__heading">{f.heading}</h2> : null}
        <div className="row g-4">
          {(f.cards ?? []).map((card) => (
            <div key={card?.sys?.id} className={colClass}>
              <CardItem card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
