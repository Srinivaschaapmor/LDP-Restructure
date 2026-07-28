"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  asFields, isLinkGroup, type HeaderFields, type NavItem, type NavigationMenu, type Section,
} from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { SearchBox } from "@/components/ui/SearchBox";
import { DesktopMenu } from "@/components/layout/DesktopMenu";
import { MenuDrawer } from "@/components/layout/MenuDrawer";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { IMAGE_SIZES, TOP_ANCHOR_ID, UI_TEXT } from "@/lib/constants";

// NavItem is a real discriminated union (see @/types), so isLinkGroup(it) narrows
// both ternary branches with no cast needed.
const title = (it: NavItem) => (isLinkGroup(it) ? it.fields?.title : it.fields?.label);
const href = (it: NavItem) => (isLinkGroup(it) ? it.fields?.href : it.fields?.href);
const children = (it: NavItem) => (isLinkGroup(it) ? it.fields?.links : undefined);
const isActive = (pathname: string, h?: string) => !!h && (pathname === h || pathname.startsWith(`${h}/`));

export function Header({ fields, primaryNav }: { fields: Section["fields"]; primaryNav?: NavigationMenu }) {
  const f = asFields<HeaderFields>(fields);
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const items = primaryNav?.fields?.items ?? [];
  const active = items.find((it) => isActive(pathname, href(it)));
  const activeTitle = active ? title(active) : undefined;
  const subItems = active ? children(active) : undefined;

  return (
    <header className="ld-header" id={TOP_ANCHOR_ID}>
      <UtilityBar
        languageIcon={f.languageIcon} languageMenu={f.languageMenu}
        loginIcon={f.loginIcon} loginMenu={f.loginMenu}
        chevronIcon={f.chevronIcon}
      />
      <div className="container-xxl ld-header__inner">
        <a href="/" className="ld-header__brand">
          {f.logo ? <MediaImg media={f.logo} className="ld-header__logo" sizes={IMAGE_SIZES.logo} priority /> : null}
        </a>

        {/* Primary sections = plain links; the active one is underlined */}
        <nav className="ld-nav ld-nav--primary d-none d-lg-flex" aria-label={UI_TEXT.primaryNavLabel}>
          <ul className="ld-nav__list">
            {items.map((it) => {
              const on = isActive(pathname, href(it));
              return (
                <li key={it?.sys?.id} className="ld-nav__item">
                  <a href={href(it) ?? "#"} className={`ld-nav__link ${on ? "is-active" : ""}`} aria-current={on ? "page" : undefined}>
                    {title(it)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ld-header__actions">
          {/* Figma: search box precedes the CTA, desktop-only (mobile gets search inside the drawer) */}
          <div className="d-none d-lg-block"><SearchBox icon={f.searchIcon} /></div>
          {f.cta?.fields ? (
            <a className="ld-btn ld-btn--primary" href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
          <button type="button" className="ld-header__burger d-lg-none"
            aria-label={UI_TEXT.openMenuLabel} aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 6h18" strokeLinecap="round" /><path d="M3 12h18" strokeLinecap="round" /><path d="M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contextual sub-bar: the active section's sub-menu */}
      {subItems?.length ? (
        <div className="ld-submenu d-none d-lg-block">
          <div className="container-xxl">
            <DesktopMenu items={subItems} variant="sub" ariaLabel={`${activeTitle ?? ""} menu`} />
          </div>
        </div>
      ) : null}

      {/* Mobile / tablet drawer: sections drill down into their sub-menus; same
          search icon and Language/Login menus as desktop, just laid out for mobile */}
      {open ? (
        <MenuDrawer
          logo={f.logo} items={items} cta={f.cta} searchIcon={f.searchIcon}
          languageIcon={f.languageIcon} languageMenu={f.languageMenu}
          loginIcon={f.loginIcon} loginMenu={f.loginMenu}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </header>
  );
}
