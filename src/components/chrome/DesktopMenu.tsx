"use client";
import { useEffect, useId, useRef, useState } from "react";
import { isLink, isLinkGroup, type LinkGroup, type NavItem } from "@/lib/types";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`ld-nav__chev ${open ? "is-open" : ""}`} width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubLink({ item }: { item: NavItem }) {
  // A group child inside a dropdown becomes a labeled section; a link becomes a link.
  if (isLinkGroup(item)) {
    return (
      <li className="ld-nav__section">
        <p className="ld-nav__section-title">{item?.fields?.title}</p>
        <ul>
          {(item?.fields?.links ?? []).filter(isLink).map((l) => (
            <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"} className="ld-nav__sublink">{l?.fields?.label}</a></li>
          ))}
        </ul>
      </li>
    );
  }
  // Not a group → item is narrowed to Link here (discriminated union, no cast needed).
  return (
    <li><a href={item?.fields?.href ?? "#"} className="ld-nav__sublink">{item?.fields?.label}</a></li>
  );
}

function NavDropdown({ group }: { group: LinkGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <li className="ld-nav__item ld-nav__item--group" ref={ref}>
      <button type="button" className="ld-nav__link ld-nav__trigger"
        aria-expanded={open} aria-controls={panelId} aria-haspopup="true" onClick={() => setOpen((v) => !v)}>
        {group?.fields?.title}
        <Chevron open={open} />
      </button>
      {open ? (
        <ul id={panelId} className="ld-nav__panel">
          {(group?.fields?.links ?? []).map((child) => <SubLink key={child?.sys?.id} item={child} />)}
        </ul>
      ) : null}
    </li>
  );
}

export function DesktopMenu({
  items, ariaLabel, variant = "primary",
}: { items?: NavItem[]; ariaLabel: string; variant?: "primary" | "sub" }) {
  return (
    <nav className={`ld-nav ld-nav--${variant}`} aria-label={ariaLabel}>
      <ul className="ld-nav__list">
        {(items ?? []).map((item) =>
          isLinkGroup(item) ? (
            <NavDropdown key={item?.sys?.id} group={item} />
          ) : (
            <li key={item?.sys?.id} className="ld-nav__item">
              <a href={item?.fields?.href ?? "#"} className="ld-nav__link">{item?.fields?.label}</a>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
