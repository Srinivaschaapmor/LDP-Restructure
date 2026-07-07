import { asFields, type Link, type LinkGroup, type Media, type Section } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { DEFAULTS, IMAGE_SIZES, TOP_ANCHOR_ID } from "@/lib/constants";

interface FooterFields {
  logo?: Media; columns?: LinkGroup[]; socialLinks?: Link[]; legalLinks?: Link[];
  backToTopLabel?: string; legalText?: string;
}

// Minimal inline social glyphs, matched by link internalName (no icon deps).
const SOCIAL: Record<string, string> = {
  "social-facebook": "M13 10h3l.5-3H13V5.5c0-.9.2-1.5 1.5-1.5H17V1.4C16.6 1.3 15.6 1.2 14.4 1.2 12 1.2 10.4 2.7 10.4 5.2V7H8v3h2.4v8H13z",
  "social-instagram": "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2m0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2M17 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4m2.3 14a2.3 2.3 0 0 1-2.3 2.3H7A2.3 2.3 0 0 1 4.7 17V7A2.3 2.3 0 0 1 7 4.7h10A2.3 2.3 0 0 1 19.3 7z",
  "social-youtube": "M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.5M9.8 15.3V8.7l5.7 3.3z",
  "social-linkedin": "M6.9 20H3.3V9h3.6zM5.1 7.4A2.1 2.1 0 1 1 5.1 3.2a2.1 2.1 0 0 1 0 4.2M20.7 20h-3.6v-5.3c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H9.6V9H13v1.5h.05a3.7 3.7 0 0 1 3.4-1.8c3.6 0 4.3 2.4 4.3 5.5z",
};

export function Footer({ fields }: { fields: Section["fields"] }) {
  const f = asFields<FooterFields>(fields);
  return (
    <footer className="ld-footer">
      <div className="container">
        <div className="row ld-footer__top">
          <div className="col-12 col-lg-3 ld-footer__brandcol">
            {f.logo ? <MediaImg media={f.logo} className="ld-footer__logo" sizes={IMAGE_SIZES.logo} /> : null}
            <div className="ld-footer__social">
              {(f.socialLinks ?? []).map((s) => (
                <a key={s?.sys?.id} href={s?.fields?.href ?? "#"} aria-label={s?.fields?.label} target="_blank" rel="noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={SOCIAL[s?.fields?.internalName ?? ""] ?? SOCIAL["social-linkedin"]} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {(f.columns ?? []).map((col) => (
            <div key={col?.sys?.id} className="col-6 col-md-4 col-lg-2 ld-footer__group">
              <p className="ld-footer__group-title">{col?.fields?.title}</p>
              <ul>
                {(col?.fields?.links ?? []).map((l) => (
                  <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-12 col-lg-3 ld-footer__totopcol">
            <a href={`#${TOP_ANCHOR_ID}`} className="ld-footer__totop">
              <span className="ld-footer__totop-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {f.backToTopLabel ?? DEFAULTS.backToTop}
            </a>
          </div>
        </div>

        <hr className="ld-footer__divider" />

        <div className="ld-footer__bottom">
          {f.legalText ? <p className="ld-footer__legal">{f.legalText}</p> : null}
          <ul className="ld-footer__legallinks">
            {(f.legalLinks ?? []).map((l) => (
              <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
