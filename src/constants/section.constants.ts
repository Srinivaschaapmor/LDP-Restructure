export const COLLECTION_COL_CLASS: Record<string, string> = {
  "grid-2": "col-12 col-md-6",
  "grid-3": "col-12 col-lg-4",
  "grid-4": "col-6 col-lg-3",
  list: "col-12",
  split: "col-12 col-md-6",
  carousel: "col-12 col-md-6 col-lg-4",
};

export const SECTION_TYPE = {
  hero: "hero",
  banner: "banner",
  mediaContentBlock: "mediaContentBlock",
  cardCollection: "cardCollection",
  richTextItem: "richTextItem",
  accordion: "accordion",
  resourceLibrary: "resourceLibrary",
} as const;

export const LEAD_SECTION_TYPES: readonly string[] = [SECTION_TYPE.hero, SECTION_TYPE.banner];

export const COLLECTION_LAYOUT = {
  chips: "chips",
  logos: "logos",
} as const;

export const COLLECTION_SOURCE = {
  manual: "manual",
  latestNews: "latestNews",
} as const;

export const TONE = {
  default: "default",
  subtle: "subtle",
  brand: "brand",
  inverse: "inverse",
} as const;

export const ON_BRAND_TONES: readonly string[] = [TONE.brand, TONE.inverse];

export const BUTTON_VARIANT_CLASS: Record<string, string> = {
  primary: "ld-btn--primary",
  secondary: "ld-btn--secondary",
};

export const DEFAULTS = {
  collectionLayout: "grid-3",
  collectionSource: COLLECTION_SOURCE.manual,
  bannerHeight: "md",
  bannerVariant: "image",
  bannerOverlay: "left",
  heroHeight: "lg",
  heroOverlay: "flat",
  heroVariant: "image",
  mediaPlacement: "top",
  tone: TONE.default,
  buttonVariant: "primary",
  newsLimit: 3,
  backToTop: "Back to top",
} as const;

export const NEWS_ORDER = "-fields.publishDate";
