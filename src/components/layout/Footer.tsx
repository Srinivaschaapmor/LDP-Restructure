import { asFields, isLink, type FooterFields, type Section } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { DEFAULTS, IMAGE_SIZES, TOP_ANCHOR_ID } from "@/lib/constants";
import styles from "@/components/layout/Footer.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Footer({ fields }: { fields: Section["fields"] }) {
  const f = asFields<FooterFields>(fields);
  return (
    <footer className={styles.footer}>
      <div className="container-xxl">
        <div className={cx("row", styles.top)}>
          <div className="col-12 col-lg-3">
            {f.logo ? <MediaImg media={f.logo} className={styles.logo} sizes={IMAGE_SIZES.logo} /> : null}
            <div className={styles.social}>
              {(f.socialLinks ?? []).map((s) => (
                <a key={s?.sys?.id} href={s?.fields?.href ?? "#"} aria-label={s?.fields?.label} target="_blank" rel="noreferrer">
                  <MediaImg media={s?.fields?.icon} sizes={IMAGE_SIZES.icon} />
                </a>
              ))}
            </div>
          </div>

          {(f.columns ?? []).map((col) => (
            <div key={col?.sys?.id} className={cx("col-6 col-md-4 col-lg-2", styles.group)}>
              <p className={styles.groupTitle}>{col?.fields?.title}</p>
              <ul>
                {/* Footer columns are plain links; isLink narrows NavItem[] with no
                    cast and silently drops any nested group instead of crashing. */}
                {(col?.fields?.links ?? []).filter(isLink).map((l) => (
                  <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className={cx("col-12 col-lg-3", styles.totopcol)}>
            <a href={`#${TOP_ANCHOR_ID}`} className={styles.totop}>
              <span className={styles.totopIcon} aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              {f.backToTopLabel ?? DEFAULTS.backToTop}
            </a>
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.bottom}>
          {f.legalText ? <p className={styles.legal}>{f.legalText}</p> : null}
          <ul className={styles.legallinks}>
            {(f.legalLinks ?? []).map((l) => (
              <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
