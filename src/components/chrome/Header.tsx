"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  asFields, isLinkGroup, type Button, type Link, type Media, type NavItem, type NavigationMenu, type Section,
} from "@/lib/types";
import { MediaImg } from "@/components/primitives/MediaImg";
import { DesktopMenu } from "@/components/chrome/DesktopMenu";
import { MenuDrawer } from "@/components/chrome/MenuDrawer";
import { IMAGE_SIZES, TOP_ANCHOR_ID } from "@/lib/constants";

interface HeaderFields { logo?: Media; cta?: Button; utilityLinks?: Link[] }

// NavItem is a real discriminated union (see lib/types), so isLinkGroup(it) narrows
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
      <div className="container ld-header__inner">
        <a href="/" className="ld-header__brand">
          {f.logo ? <MediaImg media={f.logo} className="ld-header__logo" sizes={IMAGE_SIZES.logo} priority /> : null}
        </a>

        {/* Primary sections = plain links; the active one is underlined */}
        <nav className="ld-nav ld-nav--primary d-none d-lg-flex" aria-label="Primary">
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
          {f.cta?.fields ? (
            <a className="ld-btn ld-btn--primary" href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
          <button type="button" className="ld-header__burger d-lg-none"
            aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 6h18" strokeLinecap="round" /><path d="M3 12h18" strokeLinecap="round" /><path d="M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contextual sub-bar: the active section's sub-menu */}
      {subItems?.length ? (
        <div className="ld-submenu d-none d-lg-block">
          <div className="container">
            <DesktopMenu items={subItems} variant="sub" ariaLabel={`${title(active as NavItem) ?? ""} menu`} />
          </div>
        </div>
      ) : null}

      {/* Mobile / tablet drawer: sections drill down into their sub-menus */}
      {open ? (
        <MenuDrawer logo={f.logo} items={items} cta={f.cta} utilityLinks={f.utilityLinks} onClose={() => setOpen(false)} />
      ) : null}
    </header>
  );
}
