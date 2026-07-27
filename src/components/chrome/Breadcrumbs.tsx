import Link from "next/link";
import type { PageEntry } from "@/lib/types";
import { HOME_LABEL } from "@/lib/constants";

interface Crumb { label: string; href?: string }

// Title-cases a slug segment for a breadcrumb label ("resource-library" -> "Resource library").
function labelFromSegment(segment: string): string {
  const words = segment.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// Breadcrumbs derived from the page slug (spec §6): Home + each path segment, with the
// last crumb using the page title (unlinked = current page). Optional-chained for CDA safety.
export function buildCrumbs(slug?: string, title?: string): Crumb[] {
  const segments = (slug ?? "").split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: HOME_LABEL, href: "/" }];
  let path = "";
  segments.forEach((segment, i) => {
    path += `/${segment}`;
    const isLast = i === segments.length - 1;
    crumbs.push({
      label: isLast ? (title ?? labelFromSegment(segment)) : labelFromSegment(segment),
      href: isLast ? undefined : path,
    });
  });
  return crumbs;
}

export function Breadcrumbs({ page }: { page?: PageEntry }) {
  const crumbs = buildCrumbs(page?.fields?.slug, page?.fields?.title);
  if (crumbs.length <= 1) return null;

  return (
    <nav className="ld-breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        <ol className="ld-breadcrumbs__list">
          {crumbs.map((crumb, i) => (
            <li key={`${crumb.label}-${i}`} className="ld-breadcrumbs__item">
              {crumb.href
                ? <Link href={crumb.href} className="ld-breadcrumbs__link">{crumb.label}</Link>
                : <span className="ld-breadcrumbs__current" aria-current="page">{crumb.label}</span>}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
