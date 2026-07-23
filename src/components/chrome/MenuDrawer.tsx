"use client";
import { useId, useState } from "react";
import { isLinkGroup, type Button, type Link, type LinkGroup, type Media, type NavItem } from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { IMAGE_SIZES } from "@/lib/constants";

type Panel = { title?: string; items?: NavItem[] };

const ChevRight = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Inside a drilled panel: a plain link, or a group that expands inline (accordion).
function InlineItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!isLinkGroup(item)) {
    // item is narrowed to Link here (discriminated union, no cast needed).
    return <a href={item?.fields?.href ?? "#"} className="ld-drawer__row ld-drawer__row--leaf">{item?.fields?.label}</a>;
  }
  return (
    <div className="ld-drawer__group">
      <button type="button" className="ld-drawer__row" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        <span>{item?.fields?.title}</span>
        <ChevRight className={`ld-drawer__chev ${open ? "is-open" : ""}`} />
      </button>
      {open ? (
        <ul id={panelId} className="ld-drawer__sublist">
          {(item?.fields?.links ?? []).map((l) =>
            isLinkGroup(l)
              ? <li key={l?.sys?.id}><InlineItem item={l} /></li>
              : <li key={l?.sys?.id}><a href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a></li>,
          )}
        </ul>
      ) : null}
    </div>
  );
}

export function MenuDrawer({
  logo, items, cta, utilityLinks, onClose,
}: { logo?: Media; items?: NavItem[]; cta?: Button; utilityLinks?: Link[]; onClose: () => void }) {
  // A stack of panels — pushing a section slides in its sub-menu.
  const [stack, setStack] = useState<Panel[]>([{ items }]);
  const current = stack[stack.length - 1];
  const atRoot = stack.length === 1;
  const push = (g: LinkGroup) => setStack((s) => [...s, { title: g?.fields?.title, items: g?.fields?.links }]);
  const pop = () => setStack((s) => s.slice(0, -1));

  // A root-panel row: a group drills in (slide), a plain link navigates.
  const rootRow = (item: NavItem) =>
    isLinkGroup(item) ? (
      <button key={item?.sys?.id} type="button" className="ld-drawer__row ld-drawer__push" onClick={() => push(item)}>
        <span>{item?.fields?.title}</span>
        <ChevRight />
      </button>
    ) : (
      <a key={item?.sys?.id} href={item?.fields?.href ?? "#"} className="ld-drawer__row ld-drawer__row--leaf">{item?.fields?.label}</a>
    );

  return (
    <div className="ld-drawer" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="ld-drawer__header">
        {logo ? <MediaImg media={logo} className="ld-drawer__logo" sizes={IMAGE_SIZES.logo} /> : null}
        <button type="button" className="ld-drawer__close" aria-label="Close menu" onClick={onClose}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="ld-drawer__body">
        {atRoot ? (
          <div className="ld-drawer__panel" key="root">
            <label className="ld-drawer__search">
              <span className="visually-hidden">Search</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input type="search" placeholder="Search" />
            </label>

            <nav className="ld-drawer__nav" aria-label="Primary">
              {(items ?? []).map(rootRow)}
            </nav>

            {cta?.fields ? (
              <a className="ld-btn ld-btn--primary ld-drawer__cta" href={cta.fields.link?.fields?.href ?? "#"}>{cta.fields.label}</a>
            ) : null}
            {utilityLinks?.length ? (
              <div className="ld-drawer__utility">
                {utilityLinks.map((l) => <a key={l?.sys?.id} href={l?.fields?.href ?? "#"}>{l?.fields?.label}</a>)}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="ld-drawer__panel" key={stack.length}>
            <button type="button" className="ld-drawer__back" onClick={pop}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{current.title}</span>
            </button>
            <nav className="ld-drawer__nav" aria-label={current.title || "Menu"}>
              {(current.items ?? []).map((it) => <InlineItem key={it?.sys?.id} item={it} />)}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
