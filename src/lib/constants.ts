// Centralized constants — no hardcoded/duplicated string literals in components
// (coding-standards §5, sonarqube-compliance rule 7).

// CardCollection layout enum -> Bootstrap column classes.
export const COLLECTION_COL_CLASS: Record<string, string> = {
  "grid-2": "col-12 col-md-6",
  "grid-3": "col-12 col-md-6 col-lg-4",
  "grid-4": "col-6 col-lg-3",
  list: "col-12",
  split: "col-12 col-md-6",
  carousel: "col-12 col-md-6 col-lg-4",
};

// Variant defaults (mirror the design-system enums in the content-model spec).
export const DEFAULTS = {
  collectionLayout: "grid-3",
  bannerHeight: "md",
  bannerVariant: "image",
  bannerOverlay: "left",
  mediaPlacement: "top",
  tone: "default",
  richTextWidth: "default",
  backToTop: "Back to top",
} as const;

// Responsive `sizes` hints for next/image (avoid over-fetching large images).
export const IMAGE_SIZES = {
  hero: "100vw",
  content: "(max-width: 992px) 100vw, 820px",
  card: "(max-width: 768px) 100vw, 400px",
  logo: "170px",
  icon: "24px",
} as const;

// The id of the top landmark, used by the footer "back to top" link.
export const TOP_ANCHOR_ID = "top";

// Accordion / document rendering.
// External links open in a new tab; rel prevents reverse-tabnabbing (seo/a11y).
export const EXTERNAL_LINK_TARGET = "_blank";
export const EXTERNAL_LINK_REL = "noopener noreferrer";
export const DOC_LABELS = {
  pdfBadge: "PDF",
  newTab: "(opens in a new tab)",
} as const;

// Resource library (state selector) + breadcrumbs.
export const RL_SELECT_LABEL = "Select your state to access Liberty forms and documents";
export const RL_SELECT_PLACEHOLDER = "Select state";
export const HOME_LABEL = "Home";

// Structural chrome copy — not CMS-authored content, but still centralized here
// rather than inlined in components (coding-standards §5, sonarqube-compliance rule 7).
export const UI_TEXT = {
  bannerFallbackLabel: "Banner",
  primaryNavLabel: "Primary",
  openMenuLabel: "Open menu",
  closeMenuLabel: "Close menu",
  menuDialogLabel: "Menu",
  searchLabel: "Search",
  searchPlaceholder: "Search",
  breadcrumbNavLabel: "Breadcrumb",
} as const;
