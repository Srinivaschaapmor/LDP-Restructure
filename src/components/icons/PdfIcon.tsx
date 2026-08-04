import { DOC_LABELS } from "@/lib/constants";
import styles from "@/components/icons/PdfIcon.module.css";

// PDF document icon taken verbatim from Figma (node 36:1665 "DOC"): the red page
// outline with a folded corner ("Vector 9") plus a red "PDF" chip. Decorative —
// aria-hidden, since the document label carries the accessible name.
export function PdfIcon() {
  return (
    <span className={styles.pdficon} aria-hidden="true">
      <svg
        className={styles.page} width="26" height="31" viewBox="0 0 30 36"
        fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 1H19.3428C20.1384 1 20.9022 1.3163 21.4648 1.87891L28.1211 8.53516C28.6837 9.09777 29 9.86158 29 10.6572V32C29 33.6569 27.6569 35 26 35H4C2.34315 35 1 33.6569 1 32V4C1 2.34315 2.34315 1 4 1Z"
          stroke="#FF2116" strokeWidth="2"
        />
      </svg>
      <span className={styles.chip}>{DOC_LABELS.pdfBadge}</span>
    </span>
  );
}
