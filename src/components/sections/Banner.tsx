import { asFields, type BannerFields, type Section } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { RichText } from "@/components/ui/RichText";
import { Heading, type HeadingLevel } from "@/components/ui/Heading";
import { DEFAULTS, IMAGE_SIZES, UI_TEXT } from "@/lib/constants";

const HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

// Pure helpers (exported for unit tests). A validated hex string, not a free color
// picker: Contentful's field regex already rejects anything else at entry time, and
// this parse still falls back safely if a value ever slips through invalid — see
// ADR-0006 for why this is a scoped exception to "no free color pickers".
export function hexToRgb(value?: string): [number, number, number] | null {
  const match = value?.trim().match(HEX_PATTERN);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  return [Number.parseInt(hex.slice(0, 2), 16), Number.parseInt(hex.slice(2, 4), 16), Number.parseInt(hex.slice(4, 6), 16)];
}

// Direction matches the existing .ld-banner__overlay--left/right SCSS gradients;
// only the color itself is dynamic (falls back to those default-navy classes below
// when no valid overlayColor is set — no inline style needed in the common case).
export function overlayGradient(direction: string, rgb: [number, number, number]): string {
  const [r, g, b] = rgb;
  const angle = direction === "right" ? 270 : 90;
  return `linear-gradient(${angle}deg, rgba(${r},${g},${b},.6), rgba(${r},${g},${b},0))`;
}

export function Banner({ fields }: { fields: Section["fields"] }) {
  const f = asFields<BannerFields>(fields);
  if (!f.backgroundImage) return null; // a banner with nothing to show renders nothing

  const height = f.height ?? DEFAULTS.bannerHeight;
  const direction = f.overlay ?? DEFAULTS.bannerOverlay;
  const customRgb = direction !== "none" ? hexToRgb(f.overlayColor) : null;
  const headingLevel: HeadingLevel = 2; // the page's own h1 lives in the content block below

  const hasLogo = Boolean(f.logo);
  // Mobile gets a lightweight solid-color band (logo, or heading, never both) instead
  // of the photo — avoids shipping a large hero image as the mobile LCP element. Only
  // swaps in when there's actually something to show instead; a banner with neither
  // (e.g. a plain photo banner) keeps showing its photo on mobile too — no blank gap.
  const mobileContent = hasLogo ? (
    <MediaImg media={f.logo} className="ld-banner__mobile-logo" fill sizes={IMAGE_SIZES.icon} priority />
  ) : f.heading ? (
    <Heading level={headingLevel} className="ld-banner__mobile-heading">{f.heading}</Heading>
  ) : null;
  const deprioritizeDesktopImage = Boolean(mobileContent);
  const hideOnMobile = mobileContent ? " d-none d-md-block" : "";

  return (
    <section className={`ld-banner ld-banner--${height}`} aria-label={f.heading || UI_TEXT.bannerFallbackLabel}>
      <MediaImg
        media={f.backgroundImage} className={`ld-banner__bg${hideOnMobile}`} sizes={IMAGE_SIZES.hero} fill
        priority={!deprioritizeDesktopImage}
        loading={deprioritizeDesktopImage ? "lazy" : "eager"}
        fetchPriority={deprioritizeDesktopImage ? "low" : "high"}
      />
      {direction !== "none" ? (
        customRgb ? (
          <span className={`ld-banner__overlay${hideOnMobile}`} style={{ background: overlayGradient(direction, customRgb) }} aria-hidden="true" />
        ) : (
          <span className={`ld-banner__overlay ld-banner__overlay--${direction}${hideOnMobile}`} aria-hidden="true" />
        )
      ) : null}
      {(hasLogo || f.heading) ? (
        <div className={`container-xxl ld-banner__inner${hideOnMobile}`}>
          {hasLogo ? (
            <MediaImg media={f.logo} className="ld-banner__logo" fill sizes={IMAGE_SIZES.logo} priority />
          ) : (
            <Heading level={headingLevel} className="ld-banner__heading">{f.heading}</Heading>
          )}
          {f.subheading?.fields?.content ? <div className="ld-banner__subheading"><RichText doc={f.subheading.fields.content} /></div> : null}
          {f.cta?.fields ? (
            <a className="ld-btn ld-btn--primary ld-banner__cta" href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
        </div>
      ) : null}

      {mobileContent ? (
        <div className="d-md-none ld-banner__mobile" style={{ backgroundColor: customRgb ? f.overlayColor : undefined }}>
          {mobileContent}
        </div>
      ) : null}
    </section>
  );
}
