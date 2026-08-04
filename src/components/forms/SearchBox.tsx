import type { Media } from "@/types";
import { MediaImg } from "@/components/media/MediaImg";
import { IMAGE_SIZES, UI_TEXT } from "@/constants";
import styles from "@/components/forms/styles/SearchBox.module.css";

export function SearchBox({ icon }: { icon?: Media }) {
  return (
    <label className={styles.search}>
      <span className="visually-hidden">{UI_TEXT.searchLabel}</span>
      <input type="search" placeholder={UI_TEXT.searchPlaceholder} className={styles.input} />
      <MediaImg media={icon} className={styles.icon} sizes={IMAGE_SIZES.icon} />
    </label>
  );
}
