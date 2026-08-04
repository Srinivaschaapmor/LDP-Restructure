import type { Media } from "@/types";
import { MediaImg } from "@/components/ui/MediaImg";
import { IMAGE_SIZES, UI_TEXT } from "@/lib/constants";
import styles from "@/components/ui/SearchBox.module.css";

// Desktop header search box (Figma: white pill, placeholder text then a trailing
// icon — the mobile drawer's own search field is icon-then-text and styled
// differently, so it's implemented separately rather than forced through this
// same component; see MenuDrawer).
export function SearchBox({ icon }: { icon?: Media }) {
  return (
    <label className={styles.search}>
      <span className="visually-hidden">{UI_TEXT.searchLabel}</span>
      <input type="search" placeholder={UI_TEXT.searchPlaceholder} className={styles.input} />
      <MediaImg media={icon} className={styles.icon} sizes={IMAGE_SIZES.icon} />
    </label>
  );
}
