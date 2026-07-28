"use client";
import { useId } from "react";
import { isLink, type LinkGroup, type Media, type NavItem } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { SubLink } from "@/components/layout/DesktopMenu";
import { useDismissableToggle } from "@/lib/useDismissableToggle";
import { IMAGE_SIZES } from "@/lib/constants";

// Language options are flat links (never groups); the trigger already displays the
// active choice's label, so a match marks the current selection — same "active via
// typography" convention as the header's current nav item (.is-active), no new icon.
function LanguageOption({ item, isSelected }: { item: NavItem; isSelected: boolean }) {
  if (!isLink(item)) return null;
  return (
    <li>
      <a
        href={item.fields?.href ?? "#"}
        className={`ld-nav__sublink ld-utilitybar__option${isSelected ? " is-selected" : ""}`}
        aria-current={isSelected ? "true" : undefined}
      >
        {item.fields?.label}
      </a>
    </li>
  );
}

// One trigger: an icon + the group's title + a chevron, opening a flat dropdown of
// links. Icon and chevron are Contentful Media (nextjs-development skill rule 7) —
// never hardcoded SVG. `highlightSelected` is for the language menu only — Login's
// destinations have no "current selection" concept.
// Exported so MenuDrawer can reuse the identical Language/Login dropdowns on
// mobile instead of a separate, simpler flat-link treatment (one behavior, one place).
export function UtilityMenu({
  icon, chevron, menu, highlightSelected = false,
}: { icon?: Media; chevron?: Media; menu?: LinkGroup; highlightSelected?: boolean }) {
  const { open, toggle, ref } = useDismissableToggle<HTMLDivElement>();
  const panelId = useId();
  if (!menu?.fields?.title) return null;

  return (
    <div className="ld-utilitybar__item" ref={ref}>
      <button type="button" className="ld-utilitybar__trigger"
        aria-expanded={open} aria-controls={panelId} aria-haspopup="true" onClick={toggle}>
        <MediaImg media={icon} className="ld-utilitybar__icon" sizes={IMAGE_SIZES.icon} />
        <span>{menu.fields.title}</span>
        {/* The Figma "angle" asset is drawn pointing up; rotate to point down when
            closed ("click to expand") and up when open ("click to collapse"). */}
        <MediaImg
          media={chevron} className="ld-utilitybar__chev" sizes={IMAGE_SIZES.icon}
          style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
        />
      </button>
      {open ? (
        <ul id={panelId} className="ld-utilitybar__panel">
          {(menu.fields.links ?? []).map((item) =>
            highlightSelected ? (
              <LanguageOption
                key={item?.sys?.id} item={item}
                isSelected={isLink(item) && item.fields?.label === menu.fields?.title}
              />
            ) : (
              <SubLink key={item?.sys?.id} item={item} />
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

// The thin bar above the main header (Figma: Language + Login dropdowns). Renders
// nothing if neither menu is configured, so pages/personas without it are unaffected.
export function UtilityBar({ languageIcon, languageMenu, loginIcon, loginMenu, chevronIcon }: UtilityBarProps) {
  if (!languageMenu && !loginMenu) return null;
  return (
    <div className="ld-utilitybar d-none d-lg-flex">
      <div className="container-xxl ld-utilitybar__inner">
        <UtilityMenu icon={languageIcon} chevron={chevronIcon} menu={languageMenu} highlightSelected />
        <UtilityMenu icon={loginIcon} chevron={chevronIcon} menu={loginMenu} />
      </div>
    </div>
  );
}
