import Link from "next/link";
import {
  asFields, type Link as LinkEntry, type MediaContentBlockFields,
  type SectionProps, type StyleWithVars,
} from "@/types";
import { MediaImg, resolveUrl } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { Heading } from "@/components/common/Heading";
import { CtaButton } from "@/components/common/CtaButton";
import { DEFAULTS, IMAGE_SIZES, ON_BRAND_TONES } from "@/constants";
import { cx } from "@/lib/css/cx";
import styles from "@/components/sections/styles/MediaContentBlock.module.css";

const TONE_CLASS: Record<string, string | undefined> = {
  subtle: styles.toneSubtle, brand: styles.toneBrand, inverse: styles.toneInverse,
};
const SIDE_PLACEMENTS: readonly string[] = ["left", "right"];
const BULLET_ICON_VAR = "--ld-bullet-icon";

function ImageLink({ link }: { link: LinkEntry }) {
  const f = link?.fields;
  const label = f?.label;
  if (!f?.href || !label) return null;
  const hasIcon = Boolean(resolveUrl(f.icon));
  const content = hasIcon
    ? <MediaImg media={f.icon} className={styles.badgeImg} sizes={IMAGE_SIZES.logo} />
    : <span className={styles.badgeFallback}>{label}</span>;

  if (f.isExternal) {
    return <a href={f.href} className={styles.badge} aria-label={hasIcon ? undefined : label}>{content}</a>;
  }
  return <Link href={f.href} className={styles.badge}>{content}</Link>;
}

export function MediaContentBlock({ fields, headingLevel = 2 }: SectionProps) {
  const f = asFields<MediaContentBlockFields>(fields);
  const placement = f.mediaPlacement ?? DEFAULTS.mediaPlacement;
  const tone = f.tone ?? DEFAULTS.tone;
  const onBrand = ON_BRAND_TONES.includes(tone);
  const isSideBySide = SIDE_PLACEMENTS.includes(placement);
  const ctas = f.ctas ?? [];
  const links = f.links ?? [];

  const bulletIconUrl = resolveUrl(f.bulletIcon, { width: 48, format: "webp" });
  const bulletStyle: StyleWithVars | undefined = bulletIconUrl
    ? { [BULLET_ICON_VAR]: `url("${bulletIconUrl}")` }
    : undefined;

  return (
    <section className={cx(styles.mcb, TONE_CLASS[tone])} data-placement={placement}>
      <div className={cx("container-xxl", isSideBySide && styles.split)}>
        <div className={styles.content}>
          {f.eyebrow ? <p className={styles.eyebrow}>{f.eyebrow}</p> : null}
          {f.heading ? <Heading level={headingLevel} className={styles.heading}>{f.heading}</Heading> : null}
          {f.body?.fields?.content ? <div className={styles.body}><RichText doc={f.body.fields.content} /></div> : null}
          {f.bullets?.fields?.content ? (
            <div className={cx(styles.bullets, bulletIconUrl && styles.bulletsIconed)} style={bulletStyle}>
              <RichText doc={f.bullets.fields.content} />
            </div>
          ) : null}
          {ctas.length ? (
            <div className={styles.ctaRow}>
              {ctas.map((cta) => <CtaButton key={cta?.sys?.id} cta={cta} onBrand={onBrand} />)}
            </div>
          ) : null}
          {links.length ? (
            <ul className={styles.badges}>
              {links.map((link) => <li key={link?.sys?.id}><ImageLink link={link} /></li>)}
            </ul>
          ) : null}
        </div>
        {f.media ? (
          isSideBySide
            ? <div className={styles.mediaSide}><MediaImg media={f.media} sizes={IMAGE_SIZES.content} /></div>
            : <div className={styles.media}><MediaImg media={f.media} sizes={IMAGE_SIZES.content} fill /></div>
        ) : null}
      </div>
    </section>
  );
}
