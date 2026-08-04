import type { DocumentEntry } from "@/types";
import { DOC_LABELS, EXTERNAL_LINK_REL, EXTERNAL_LINK_TARGET } from "@/constants";
import { PdfIcon } from "@/components/icons/PdfIcon";
import styles from "@/components/media/styles/DocumentLink.module.css";

export function resolveDocHref(doc?: DocumentEntry): string | undefined {
  const fileUrl = doc?.fields?.file?.fields?.file?.url;
  if (fileUrl) return fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;
  return doc?.fields?.externalUrl;
}

function ExternalIcon() {
  return (
    <svg className={styles.ext} width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

export function DocumentLink({ doc }: { doc?: DocumentEntry }) {
  const href = resolveDocHref(doc);
  const label = doc?.fields?.label;
  if (!href || !label) return null;

  const isExternal = doc?.fields?.isExternal ?? false;
  const externalProps = isExternal ? { target: EXTERNAL_LINK_TARGET, rel: EXTERNAL_LINK_REL } : {};

  return (
    <a className={styles.doc} href={href} {...externalProps}>
      {isExternal ? null : <PdfIcon />}
      <span className={styles.label}>{label}</span>
      {isExternal ? <ExternalIcon /> : null}
      {isExternal ? <span className="visually-hidden"> {DOC_LABELS.newTab}</span> : null}
    </a>
  );
}
