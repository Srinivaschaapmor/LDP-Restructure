import { asFields, type HeroFields, type SectionProps } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { Heading } from "@/components/common/Heading";
import { CtaButton } from "@/components/common/CtaButton";
import { DEFAULTS, IMAGE_SIZES } from "@/constants";
import { hexToRgb, overlayGradient, overlayWash } from "@/lib/color/overlay";
import { cx } from "@/lib/css/cx";
import styles from "@/components/sections/styles/Hero.module.css";

const HEIGHT_CLASS: Record<string, string> = {
  sm: styles.heroSm, md: styles.heroMd, lg: styles.heroLg,
};
const OVERLAY_CLASS: Record<string, string> = {
  left: styles.overlayLeft, right: styles.overlayRight, flat: styles.overlayFlat,
};
const OVERLAY_ALPHA_VAR = "--ld-hero-overlay-alpha";

function overlayBackground(direction: string, color?: string): string | undefined {
  const rgb = hexToRgb(color);
  if (!rgb) return undefined;
  return direction === "flat" ? overlayWash(rgb, OVERLAY_ALPHA_VAR) : overlayGradient(direction, rgb);
}

export function Hero({ fields, headingLevel = 1 }: SectionProps) {
  const f = asFields<HeroFields>(fields);
  const height = f.height ?? DEFAULTS.heroHeight;
  const variant = f.variant ?? DEFAULTS.heroVariant;
  const direction = f.overlay ?? DEFAULTS.heroOverlay;
  const background = direction === "none" ? undefined : overlayBackground(direction, f.overlayColor);
  const showBackgroundImage = variant !== "plain";

  return (
    <section className={cx(styles.hero, HEIGHT_CLASS[height] ?? HEIGHT_CLASS[DEFAULTS.heroHeight])}>
      {showBackgroundImage && f.backgroundImage ? (
        <MediaImg media={f.backgroundImage} className={styles.bg} sizes={IMAGE_SIZES.hero} fill priority />
      ) : null}
      {direction !== "none" ? (
        <span
          className={cx(styles.overlay, !background && OVERLAY_CLASS[direction])}
          style={background ? { background } : undefined}
          aria-hidden="true"
        />
      ) : null}
      <div className={cx("container-xxl", styles.inner)}>
        {f.logo ? <MediaImg media={f.logo} className={styles.logo} sizes={IMAGE_SIZES.logo} priority /> : null}
        {f.heading ? <Heading level={headingLevel} className={styles.heading}>{f.heading}</Heading> : null}
        {f.subheading?.fields?.content ? (
          <div className={styles.subheading}><RichText doc={f.subheading.fields.content} /></div>
        ) : null}
        <CtaButton cta={f.cta} className={styles.cta} />
      </div>
    </section>
  );
}
