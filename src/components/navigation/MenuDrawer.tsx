"use client";
import { useId, useState } from "react";
import { isLink, isLinkGroup, type Button, type LinkGroup, type Media, type NavItem } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { IMAGE_SIZES, UI_TEXT } from "@/constants";
import styles from "@/components/navigation/styles/MenuDrawer.module.css";
import utilitybar from "@/components/navigation/styles/UtilityBar.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

type Panel = { title?: string; items?: NavItem[] };

const ChevRight = ({ className }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function InlineItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!isLinkGroup(item)) {
    return <a href={item?.fields?.href ?? "#"} className={cx(styles.row, styles.rowLeaf)}>{item?.fields?.label}</a>;
  }
  return (
    <div>
      <button type="button" className={styles.row} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        <span>{item?.fields?.title}</span>
        <ChevRight className={cx(styles.chev, open && styles.chevOpen)} />
      </button>
      {open ? (
        <ul id={panelId} className={styles.sublist}>
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

function UtilityGroup({
  icon, menu, highlightSelected = false,
}: { icon?: Media; menu?: LinkGroup; highlightSelected?: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  if (!menu?.fields?.title) return null;

  return (
    <div className={styles.utilitygroup}>
      <button type="button" className={styles.utilitytrigger} aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((v) => !v)}>
        <MediaImg media={icon} className={styles.utilityicon} sizes={IMAGE_SIZES.icon} />
        <span>{menu.fields.title}</span>
        <ChevRight className={cx(styles.chev, open && styles.chevOpen)} />
      </button>
      {open ? (
        <ul id={panelId} className={styles.utilitylist}>
          {(menu.fields.links ?? []).filter(isLink).map((l) => (
            <li key={l?.sys?.id}>
              <a
                href={l.fields?.href ?? "#"}
                className={highlightSelected && l.fields?.label === menu.fields?.title ? utilitybar.optionSelected : undefined}
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
  const [stack, setStack] = useState<Panel[]>([{ items }]);
  const current = stack[stack.length - 1];
  const atRoot = stack.length === 1;
  const push = (g: LinkGroup) => setStack((s) => [...s, { title: g?.fields?.title, items: g?.fields?.links }]);
  const pop = () => setStack((s) => s.slice(0, -1));

  const rootRow = (item: NavItem) =>
    isLinkGroup(item) ? (
      <button key={item?.sys?.id} type="button" className={styles.row} onClick={() => push(item)}>
        <span>{item?.fields?.title}</span>
        <ChevRight />
      </button>
    ) : (
      <a key={item?.sys?.id} href={item?.fields?.href ?? "#"} className={cx(styles.row, styles.rowLeaf)}>{item?.fields?.label}</a>
    );

  return (
    <div className={styles.drawer} role="dialog" aria-modal="true" aria-label={UI_TEXT.menuDialogLabel}>
      <div className={styles.header}>
        {logo ? <MediaImg media={logo} className={styles.logo} sizes={IMAGE_SIZES.logo} /> : null}
        <button type="button" className={styles.close} aria-label={UI_TEXT.closeMenuLabel} onClick={onClose}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        {atRoot ? (
          <div className={styles.panel} key="root">
            <label className={styles.search}>
              <MediaImg media={searchIcon} className={styles.searchIcon} sizes={IMAGE_SIZES.icon} />
              <span className="visually-hidden">{UI_TEXT.searchLabel}</span>
              <input type="search" placeholder={UI_TEXT.searchPlaceholder} />
            </label>

            <nav className={styles.nav} aria-label={UI_TEXT.primaryNavLabel}>
              {(items ?? []).map(rootRow)}
            </nav>

            {cta?.fields ? (
              <a className={cx("ld-btn ld-btn--primary", styles.cta)} href={cta.fields.link?.fields?.href ?? "#"}>{cta.fields.label}</a>
            ) : null}
            {languageMenu || loginMenu ? (
              <div className={styles.utility}>
                <UtilityGroup icon={languageIcon} menu={languageMenu} highlightSelected />
                <UtilityGroup icon={loginIcon} menu={loginMenu} />
              </div>
            ) : null}
          </div>
        ) : (
          <div className={styles.panel} key={stack.length}>
            <button type="button" className={styles.back} onClick={pop}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{current.title}</span>
            </button>
            <nav className={styles.nav} aria-label={current.title || UI_TEXT.menuDialogLabel}>
              {(current.items ?? []).map((it) => <InlineItem key={it?.sys?.id} item={it} />)}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
