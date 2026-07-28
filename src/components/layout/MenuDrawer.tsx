"use client";
import { useId, useState } from "react";
import { isLink, isLinkGroup, type Button, type LinkGroup, type Media, type NavItem } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { IMAGE_SIZES, UI_TEXT } from "@/lib/constants";

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

// Language/Login, drawer-native: inline-expanding (pushes content down), never a
// floating position:absolute panel. The desktop UtilityBar's dropdown works fine
// in a wide, roomy horizontal bar, but that same floating-panel treatment is
// fragile inside a narrow, scrollable drawer (it can render clipped or
// off-the-visible-area depending on where the trigger sits) — so the drawer
// reuses the same guaranteed-visible inline-expand pattern as every other
// drilldown row here (see InlineItem) instead of importing UtilityMenu.
function UtilityGroup({
  icon, menu, highlightSelected = false,
}: { icon?: Media; menu?: LinkGroup; highlightSelected?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!menu?.fields?.title) return null;

  return (
    <div className="ld-drawer__utilitygroup">
      <button type="button" className="ld-drawer__utilitytrigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        <MediaImg media={icon} className="ld-drawer__utilityicon" sizes={IMAGE_SIZES.icon} />
        <span>{menu.fields.title}</span>
        <ChevRight className={`ld-drawer__chev ${open ? "is-open" : ""}`} />
      </button>
      {open ? (
        <ul id={panelId} className="ld-drawer__utilitylist">
          {(menu.fields.links ?? []).filter(isLink).map((l) => (
            <li key={l?.sys?.id}>
              <a
                href={l.fields?.href ?? "#"}
                className={highlightSelected && l.fields?.label === menu.fields?.title ? "ld-utilitybar__option is-selected" : undefined}
              >
                {l.fields?.label}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

interface MenuDrawerProps {
  logo?: Media; items?: NavItem[]; cta?: Button; searchIcon?: Media;
  languageIcon?: Media; languageMenu?: LinkGroup;
  loginIcon?: Media; loginMenu?: LinkGroup;
  onClose: () => void;
}

export function MenuDrawer({
  logo, items, cta, searchIcon, languageIcon, languageMenu, loginIcon, loginMenu, onClose,
}: MenuDrawerProps) {
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
    <div className="ld-drawer" role="dialog" aria-modal="true" aria-label={UI_TEXT.menuDialogLabel}>
      <div className="ld-drawer__header">
        {logo ? <MediaImg media={logo} className="ld-drawer__logo" sizes={IMAGE_SIZES.logo} /> : null}
        <button type="button" className="ld-drawer__close" aria-label={UI_TEXT.closeMenuLabel} onClick={onClose}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="ld-drawer__body">
        {atRoot ? (
          <div className="ld-drawer__panel" key="root">
            <label className="ld-drawer__search">
              <MediaImg media={searchIcon} className="ld-drawer__search-icon" sizes={IMAGE_SIZES.icon} />
              <span className="visually-hidden">{UI_TEXT.searchLabel}</span>
              <input type="search" placeholder={UI_TEXT.searchPlaceholder} />
            </label>

            <nav className="ld-drawer__nav" aria-label={UI_TEXT.primaryNavLabel}>
              {(items ?? []).map(rootRow)}
            </nav>

            {cta?.fields ? (
              <a className="ld-btn ld-btn--primary ld-drawer__cta" href={cta.fields.link?.fields?.href ?? "#"}>{cta.fields.label}</a>
            ) : null}
            {languageMenu || loginMenu ? (
              <div className="ld-drawer__utility">
                <UtilityGroup icon={languageIcon} menu={languageMenu} highlightSelected />
                <UtilityGroup icon={loginIcon} menu={loginMenu} />
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
            <nav className="ld-drawer__nav" aria-label={current.title || UI_TEXT.menuDialogLabel}>
              {(current.items ?? []).map((it) => <InlineItem key={it?.sys?.id} item={it} />)}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
