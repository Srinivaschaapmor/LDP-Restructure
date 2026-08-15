import Link from "next/link";
import {
  asFields, type Card, type CardCollectionFields, type NewsArticle, type SectionProps,
} from "@/types";
import { MediaImg, resolveUrl } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { CtaButton } from "@/components/common/CtaButton";
import { Heading, nextHeadingLevel, type HeadingLevel } from "@/components/common/Heading";
import {
  COLLECTION_COL_CLASS, COLLECTION_LAYOUT, COLLECTION_SOURCE, DEFAULTS,
  IMAGE_SIZES, ON_BRAND_TONES, UI_TEXT,
} from "@/constants";
import { formatNewsDate, newsDateTime } from "@/lib/date/newsDate";
import { cx } from "@/lib/css/cx";
import styles from "@/components/sections/styles/CardCollection.module.css";

const TONE_CLASS: Record<string, string | undefined> = {
  subtle: styles.toneSubtle, brand: styles.toneBrand, inverse: styles.toneInverse,
};

const byOrder = (a: Card, b: Card): number => (a?.fields?.order ?? 0) - (b?.fields?.order ?? 0);

function CardItem({ card, titleLevel }: { card: Card; titleLevel: HeadingLevel }) {
  const f = card?.fields;
  if (!f) return null;
  return (
    <article className={styles.card}>
      {f.media ? <MediaImg media={f.media} className={styles.cardMedia} sizes={IMAGE_SIZES.card} /> : null}
      {f.title ? <Heading level={titleLevel} className={styles.cardTitle}>{f.title}</Heading> : null}
      {f.subtitle ? <p className={styles.cardSubtitle}>{f.subtitle}</p> : null}
      {f.body?.fields?.content ? <div className={styles.cardBody}><RichText doc={f.body.fields.content} /></div> : null}
    </article>
  );
}

function ChipItem({ card }: { card: Card }) {
  const f = card?.fields;
  if (!f) return null;
  return (
    <li className={styles.chip}>
      {f.media ? <MediaImg media={f.media} className={styles.chipIcon} sizes={IMAGE_SIZES.chipIcon} /> : null}
      {f.title ? <span className={styles.chipLabel}>{f.title}</span> : null}
    </li>
  );
}

function LogoItem({ card }: { card: Card }) {
  const f = card?.fields;
  if (!f) return null;
  const hasImage = Boolean(resolveUrl(f.media));
  return (
    <li className={styles.logo}>
      {hasImage
        ? <MediaImg media={f.media} className={styles.logoImg} sizes={IMAGE_SIZES.logo} />
        : <span className={styles.logoFallback}>{f.media?.fields?.altText ?? f.title}</span>}
    </li>
  );
}

function NewsTeaser({ article, titleLevel }: { article: NewsArticle; titleLevel: HeadingLevel }) {
  const f = article?.fields;
  if (!f?.title) return null;
  const date = formatNewsDate(f.publishDate);
  return (
    <article className={styles.newsCard}>
      {date ? <p className={styles.newsDate}><time dateTime={newsDateTime(f.publishDate)}>{date}</time></p> : null}
      <Heading level={titleLevel} className={styles.newsTitle}>{f.title}</Heading>
      {f.excerpt ? <p className={styles.newsExcerpt}>{f.excerpt}</p> : null}
      {f.slug ? (
        <Link href={f.slug} className={styles.readMore}>
          {UI_TEXT.readMoreLabel}
          <span className="visually-hidden">{` ${UI_TEXT.readMoreContextPrefix} ${f.title}`}</span>
        </Link>
      ) : null}
    </article>
  );
}

export function CardCollection({ fields, headingLevel = 2 }: SectionProps) {
  const f = asFields<CardCollectionFields>(fields);
  const layout = f.layout ?? DEFAULTS.collectionLayout;
  const tone = f.tone ?? DEFAULTS.tone;
  const source = f.source ?? DEFAULTS.collectionSource;
  const cards = [...(f.cards ?? [])].sort(byOrder);
  const newsItems = f.newsItems ?? [];
  const cardLevel = f.heading ? nextHeadingLevel(headingLevel) : headingLevel;
  const onBrand = ON_BRAND_TONES.includes(tone);

  const isNews = source === COLLECTION_SOURCE.latestNews;
  const isChips = layout === COLLECTION_LAYOUT.chips;
  const isLogos = layout === COLLECTION_LAYOUT.logos;

  return (
    <section className={cx(styles.collection, TONE_CLASS[tone], isChips && styles.chipsSection)}>
      <div className="container-xxl">
        {f.heading ? <Heading level={headingLevel} className={styles.collectionHeading}>{f.heading}</Heading> : null}
        {f.intro?.fields?.content ? (
          <div className={styles.collectionIntro}><RichText doc={f.intro.fields.content} /></div>
        ) : null}

        {isNews ? (
          <div className={styles.newsGrid}>
            {newsItems.map((article) => (
              <NewsTeaser key={article?.sys?.id} article={article} titleLevel={cardLevel} />
            ))}
          </div>
        ) : null}

        {!isNews && isChips ? (
          <ul className={styles.chips}>
            {cards.map((card) => <ChipItem key={card?.sys?.id} card={card} />)}
          </ul>
        ) : null}

        {!isNews && isLogos ? (
          <ul className={styles.logos}>
            {cards.map((card) => <LogoItem key={card?.sys?.id} card={card} />)}
          </ul>
        ) : null}

        {!isNews && !isChips && !isLogos ? (
          <div className="row g-4">
            {cards.map((card) => (
              <div key={card?.sys?.id} className={COLLECTION_COL_CLASS[layout] ?? COLLECTION_COL_CLASS[DEFAULTS.collectionLayout]}>
                <CardItem card={card} titleLevel={cardLevel} />
              </div>
            ))}
          </div>
        ) : null}

        {f.cta ? (
          <div className={styles.ctaRow}>
            <CtaButton cta={f.cta} onBrand={onBrand} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
