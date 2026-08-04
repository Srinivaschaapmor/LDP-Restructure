"use client";
import { useId } from "react";
import { isLink, type LinkGroup, type Media, type NavItem } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { SubLink } from "@/components/navigation/DesktopMenu";
import { useDismissableToggle } from "@/hooks/useDismissableToggle";
import { IMAGE_SIZES } from "@/constants";
import styles from "@/components/navigation/styles/UtilityBar.module.css";
import nav from "@/components/navigation/styles/Nav.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function LanguageOption({ item, isSelected }: { item: NavItem; isSelected: boolean }) {
  if (!isLink(item)) return null;
  return (
    <li>
      <a
        href={item.fields?.href ?? "#"}
        className={cx(nav.sublink, styles.panelSublink, isSelected && styles.optionSelected)}
        aria-current={isSelected ? "true" : undefined}
      >
        {item.fields?.label}
      </a>
    </li>
  );
}

export function UtilityMenu({
  icon, chevron, menu, highlightSelected = false,
}: { icon?: Media; chevron?: Media; menu?: LinkGroup; highlightSelected?: boolean }) {
  const { open, toggle, ref } = useDismissableToggle<HTMLDivElement>();
  const panelId = useId();
  if (!menu?.fields?.title) return null;

  return (
    <div className={styles.item} ref={ref}>
      <button type="button" className={styles.trigger}
        aria-expanded={open} aria-controls={panelId} aria-haspopup="true" onClick={toggle}>
        <MediaImg media={icon} className={styles.icon} sizes={IMAGE_SIZES.icon} />
        <span>{menu.fields.title}</span>
        <MediaImg
          media={chevron} className={styles.chev} sizes={IMAGE_SIZES.icon}
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>
      {open ? (
        <ul id={panelId} className={styles.panel}>
          {(menu.fields.links ?? []).map((item) =>
            highlightSelected ? (
              <LanguageOption
                key={item?.sys?.id} item={item}
                isSelected={isLink(item) && item.fields?.label === menu.fields?.title}
              />
            ) : (
              <SubLink key={item?.sys?.id} item={item} sublinkClassName={styles.panelSublink} />
            ),
          )}
        </ul>
      ) : null}
    </div>
  );
}

interface UtilityBarProps {
  languageIcon?: Media; languageMenu?: LinkGroup;
  loginIcon?: Media; loginMenu?: LinkGroup;
  chevronIcon?: Media;
}

export function UtilityBar({ languageIcon, languageMenu, loginIcon, loginMenu, chevronIcon }: UtilityBarProps) {
  if (!languageMenu && !loginMenu) return null;
  return (
    <div className={cx(styles.utilitybar, "d-none d-lg-flex")}>
      <div className={cx("container-xxl", styles.inner)}>
        <UtilityMenu icon={languageIcon} chevron={chevronIcon} menu={languageMenu} highlightSelected />
        <UtilityMenu icon={loginIcon} chevron={chevronIcon} menu={loginMenu} />
      </div>
    </div>
  );
}
