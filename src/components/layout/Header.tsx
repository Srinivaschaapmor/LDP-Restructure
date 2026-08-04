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
import styles from "@/components/layout/Header.module.css";
import nav from "@/components/layout/Nav.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

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
    <header className={styles.header} id={TOP_ANCHOR_ID}>
      <UtilityBar
        languageIcon={f.languageIcon} languageMenu={f.languageMenu}
        loginIcon={f.loginIcon} loginMenu={f.loginMenu}
        chevronIcon={f.chevronIcon}
      />
      <div className={cx("container-xxl", styles.inner)}>
        <a href="/" className={styles.brand}>
          {f.logo ? <MediaImg media={f.logo} className={styles.logo} sizes={IMAGE_SIZES.logo} priority /> : null}
        </a>

        {/* Primary sections = plain links; the active one is underlined */}
        <nav className={cx(nav.primary, "d-none d-lg-flex")} aria-label={UI_TEXT.primaryNavLabel}>
          <ul className={nav.list}>
            {items.map((it) => {
              const on = isActive(pathname, href(it));
              return (
                <li key={it?.sys?.id} className={nav.item}>
                  <a href={href(it) ?? "#"} className={cx(nav.link, on && nav.linkActive)} aria-current={on ? "page" : undefined}>
                    {title(it)}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* Figma: search box precedes the CTA, desktop-only (mobile gets search inside the drawer) */}
          <div className="d-none d-lg-block"><SearchBox icon={f.searchIcon} /></div>
          {f.cta?.fields ? (
            <a className={cx("ld-btn ld-btn--primary", styles.ctaMobile)} href={f.cta.fields.link?.fields?.href ?? "#"}>{f.cta.fields.label}</a>
          ) : null}
          <button type="button" className={cx(styles.burger, "d-lg-none")}
            aria-label={UI_TEXT.openMenuLabel} aria-expanded={open} onClick={() => setOpen(true)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 6h18" strokeLinecap="round" /><path d="M3 12h18" strokeLinecap="round" /><path d="M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contextual sub-bar: the active section's sub-menu */}
      {subItems?.length ? (
        <div className={cx(styles.submenu, "d-none d-lg-block")}>
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
