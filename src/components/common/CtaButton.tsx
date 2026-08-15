import Link from "next/link";
import type { Button } from "@/types";
import { BUTTON_VARIANT_CLASS, DEFAULTS } from "@/constants";
import { cx } from "@/lib/css/cx";

const isInternal = (href: string): boolean => href.startsWith("/");

export function CtaButton({
  cta, onBrand = false, className,
}: { cta?: Button; onBrand?: boolean; className?: string }) {
  const f = cta?.fields;
  const label = f?.label ?? f?.link?.fields?.label;
  if (!label) return null;

  const href = f?.link?.fields?.href ?? "#";
  const variant = BUTTON_VARIANT_CLASS[f?.variant ?? DEFAULTS.buttonVariant]
    ?? BUTTON_VARIANT_CLASS[DEFAULTS.buttonVariant];
  const classes = cx("ld-btn", variant, onBrand && "ld-btn--on-brand", className);

  if (isInternal(href)) {
    return <Link href={href} className={classes}>{label}</Link>;
  }
  return <a href={href} className={classes}>{label}</a>;
}
