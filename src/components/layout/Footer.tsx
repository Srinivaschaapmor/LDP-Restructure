import { asFields, isLink, type FooterFields, type Section } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { DEFAULTS, IMAGE_SIZES, TOP_ANCHOR_ID } from "@/lib/constants";

export function Footer({ fields }: { fields: Section["fields"] }) {
  const f = asFields<FooterFields>(fields);
  return (
    <footer className="ld-footer">
      <div className="container-xxl">
        <div className="row ld-footer__top">
          <div className="col-12 col-lg-3 ld-footer__brandcol">
            {f.logo ? <MediaImg media={f.logo} className="ld-footer__logo" sizes={IMAGE_SIZES.logo} /> : null}
            <div className="ld-footer__social">
              {(f.socialLinks ?? []).map((s) => (
                <a key={s?.sys?.id} href={s?.fields?.href ?? "#"} aria-label={s?.fields?.label} target="_blank" rel="noreferrer">
                  <MediaImg media={s?.fields?.icon} className="ld-footer__socialicon" sizes={IMAGE_SIZES.icon} />
                </a>
              ))}
            </div>
          </div>

          {(f.columns ?? []).map((col) => (
            <div key={col?.sys?.id} className="col-6 col-md-4 col-lg-2 ld-footer__group">
              <p className="ld-footer__group-title">{col?.fields?.title}</p>
              <ul>
                {/* Footer columns are plain links; isLink narrows NavItem[] with no
                    cast and silently drops any nested group instead of crashing. */}
                {(col?.fields?.links ?? []).filter(isLink).map((l) => (
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
