import { asFields, type BannerFields, type SectionProps } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { RichText } from "@/components/common/RichText";
import { Heading } from "@/components/common/Heading";
import { DEFAULTS, IMAGE_SIZES, UI_TEXT } from "@/constants";
import { hexToRgb, overlayGradient } from "@/lib/color/overlay";
import { cx } from "@/lib/css/cx";
import styles from "@/components/sections/styles/Banner.module.css";

const HEIGHT_CLASS: Record<string, string> = {
  sm: styles.bannerSm, md: styles.bannerMd, lg: styles.bannerLg,
};
const OVERLAY_CLASS: Record<string, string> = {
  left: styles.overlayLeft, right: styles.overlayRight,
};

export function Banner({ fields, headingLevel = 2 }: SectionProps) {
  const f = asFields<BannerFields>(fields);
  if (!f.backgroundImage) return null;

  const height = f.height ?? DEFAULTS.bannerHeight;
  const direction = f.overlay ?? DEFAULTS.bannerOverlay;
  const customRgb = direction !== "none" ? hexToRgb(f.overlayColor) : null;

  const hasLogo = Boolean(f.logo);
  const mobileContent = hasLogo ? (
    <MediaImg media={f.logo} className={styles.mobileLogo} fill sizes={IMAGE_SIZES.icon} priority />
  ) : f.heading ? (
    <Heading level={headingLevel} className={styles.mobileHeading}>{f.heading}</Heading>
  ) : null;
  const deprioritizeDesktopImage = Boolean(mobileContent);
  const hideOnMobile = mobileContent ? "d-none d-md-block" : "";

  return (
    <section className={cx(styles.banner, HEIGHT_CLASS[height])} aria-label={f.heading || UI_TEXT.bannerFallbackLabel}>
      <MediaImg
        media={f.backgroundImage} className={cx(styles.bg, hideOnMobile)} sizes={IMAGE_SIZES.hero} fill
        priority={!deprioritizeDesktopImage}
        loading={deprioritizeDesktopImage ? "lazy" : "eager"}
        fetchPriority={deprioritizeDesktopImage ? "low" : "high"}
      />
      {direction !== "none" ? (
        customRgb ? (
          <span className={cx(styles.overlay, hideOnMobile)} style={{ background: overlayGradient(direction, customRgb) }} aria-hidden="true" />
        ) : (
          <span className={cx(styles.overlay, OVERLAY_CLASS[direction], hideOnMobile)} aria-hidden="true" />
        )
      ) : null}
      {(hasLogo || f.heading) ? (
        <div className={cx("container-xxl", styles.inner, hideOnMobile)}>
          {hasLogo ? (
            <MediaImg media={f.logo} className={styles.logo} fill sizes={IMAGE_SIZES.logo} priority />
          ) : (
            <Heading level={headingLevel} className={styles.heading}>{f.heading}</Heading>
          )}
          {f.subheading?.fields?.content ? <div className={styles.subheading}><RichText doc={f.subheading.fields.content} /></div> : null}
          {f.cta?.fields ? (
            <a className={cx("ld-btn ld-btn--primary", styles.cta)} href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
        </div>
      ) : null}

      {mobileContent ? (
        <div className={cx("d-md-none", styles.mobile)} style={{ backgroundColor: customRgb ? f.overlayColor : undefined }}>
          {mobileContent}
        </div>
      ) : null}
    </section>
  );
}
