import type { Media } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { IMAGE_SIZES, UI_TEXT } from "@/lib/constants";

// Desktop header search box (Figma: white pill, placeholder text then a trailing
// icon — the mobile drawer's own search field is icon-then-text and styled
// differently, so it's implemented separately rather than forced through this
// same component; see MenuDrawer).
export function SearchBox({ icon }: { icon?: Media }) {
  return (
    <label className="ld-search">
      <span className="visually-hidden">{UI_TEXT.searchLabel}</span>
      <input type="search" placeholder={UI_TEXT.searchPlaceholder} className="ld-search__input" />
      <MediaImg media={icon} className="ld-search__icon" sizes={IMAGE_SIZES.icon} />
    </label>
  );
}
