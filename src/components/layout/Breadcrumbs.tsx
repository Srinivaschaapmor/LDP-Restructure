import Link from "next/link";
import type { PageEntry } from "@/types";
import { UI_TEXT } from "@/constants";
import { buildCrumbs } from "@/services/breadcrumbs/buildCrumbs";
import styles from "@/components/layout/styles/Breadcrumbs.module.css";

export function Breadcrumbs({ page }: { page?: PageEntry }) {
  const crumbs = buildCrumbs(page?.fields?.slug, page?.fields?.title);
  if (crumbs.length <= 1) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label={UI_TEXT.breadcrumbNavLabel}>
      <div className="container-xxl">
        <ol className={styles.list}>
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className={styles.item}>
              {crumb.href
                ? <Link href={crumb.href} className={styles.link}>{crumb.label}</Link>
                : <span className={styles.current} aria-current="page">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
