"use client";
import { useId } from "react";
import { isLink, isLinkGroup, type LinkGroup, type NavItem } from "@/types";
import { useDismissableToggle } from "@/hooks/useDismissableToggle";
import nav from "@/components/navigation/styles/Nav.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={cx(nav.chev, open && nav.chevOpen)} width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SubLink({ item, sublinkClassName }: { item: NavItem; sublinkClassName?: string }) {
  const sublinkClass = cx(nav.sublink, sublinkClassName);
  if (isLinkGroup(item)) {
    return (
      <li className={nav.section}>
        <p className={nav.sectionTitle}>{item?.fields?.title}</p>
        <ul>
          {(item?.fields?.links ?? []).filter(isLink).map((l) => (
            <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"} className={sublinkClass}>{l?.fields?.label}</a></li>
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li><a href={item?.fields?.href ?? "#"} className={sublinkClass}>{item?.fields?.label}</a></li>
  );
}

function NavDropdown({ group }: { group: LinkGroup }) {
  const { open, toggle, ref } = useDismissableToggle<HTMLLIElement>();
  const panelId = useId();

  return (
    <li className={nav.item} ref={ref}>
      <button type="button" className={cx(nav.link, nav.trigger)}
        aria-expanded={open} aria-controls={panelId} aria-haspopup="true" onClick={toggle}>
        {group?.fields?.title}
        <Chevron open={open} />
      </button>
      {open ? (
        <ul id={panelId} className={nav.panel}>
          {(group?.fields?.links ?? []).map((child) => <SubLink key={child?.sys?.id} item={child} />)}
        </ul>
      ) : null}
    </li>
  );
}

export function DesktopMenu({
  items, ariaLabel, variant = "primary",
}: { items?: NavItem[]; ariaLabel: string; variant?: "primary" | "sub" }) {
  const variantClass = variant === "sub" ? nav.sub : nav.primary;
  return (
    <nav className={variantClass} aria-label={ariaLabel}>
      <ul className={nav.list}>
        {(items ?? []).map((item) =>
          isLinkGroup(item) ? (
            <NavDropdown key={item?.sys?.id} group={item} />
          ) : (
            <li key={item?.sys?.id} className={nav.item}>
              <a href={item?.fields?.href ?? "#"} className={nav.link}>{item?.fields?.label}</a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
