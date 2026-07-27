import type { DocumentEntry } from "@/lib/types";
import { DOC_LABELS, EXTERNAL_LINK_REL, EXTERNAL_LINK_TARGET } from "@/lib/constants";
import { PdfIcon } from "@/components/icons/PdfIcon";

// Resolves a document's target: the uploaded PDF asset URL (Contentful stores it
// protocol-relative), falling back to an external URL. Optional-chained because the
// CDA reference tree is never guaranteed (sonarqube-compliance rule 1).
export function resolveDocHref(doc?: DocumentEntry): string | undefined {
  const fileUrl = doc?.fields?.file?.fields?.file?.url;
  if (fileUrl) return fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;
  return doc?.fields?.externalUrl;
}

// Trailing external-link glyph (↗). aria-hidden — the visually-hidden "(opens in a
// new tab)" text below carries the meaning for assistive tech.
function ExternalIcon() {
  return (
    <svg className="ld-doc__ext" width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  );
}

// One document row. PDFs show a red "PDF" chip + label; external docs show the
// label + an ↗ glyph and open in a new tab. Renders nothing without a target/label.
export function DocumentLink({ doc }: { doc?: DocumentEntry }) {
  const href = resolveDocHref(doc);
  const label = doc?.fields?.label;
  if (!href || !label) return null;

  const isExternal = doc?.fields?.isExternal ?? false;
  const externalProps = isExternal ? { target: EXTERNAL_LINK_TARGET, rel: EXTERNAL_LINK_REL } : {};

  return (
    <a className={`ld-doc${isExternal ? " ld-doc--external" : ""}`} href={href} {...externalProps}>
      {isExternal ? null : <PdfIcon />}
      <span className="ld-doc__label">{label}</span>
      {isExternal ? <ExternalIcon /> : null}
      {isExternal ? <span className="visually-hidden"> {DOC_LABELS.newTab}</span> : null}
    </a>
  );
}
