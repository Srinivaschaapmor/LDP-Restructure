import type { Crumb } from "@/types";
import { HOME_LABEL, ROUTES } from "@/constants";

function labelFromSegment(segment: string): string {
  const words = segment.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function buildCrumbs(slug?: string, title?: string): Crumb[] {
  const segments = (slug ?? "").split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: HOME_LABEL, href: ROUTES.home }];
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
