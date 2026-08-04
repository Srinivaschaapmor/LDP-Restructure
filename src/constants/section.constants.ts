export const COLLECTION_COL_CLASS: Record<string, string> = {
  "grid-2": "col-12 col-md-6",
  "grid-3": "col-12 col-md-6 col-lg-4",
  "grid-4": "col-6 col-lg-3",
  list: "col-12",
  split: "col-12 col-md-6",
  carousel: "col-12 col-md-6 col-lg-4",
};

export const DEFAULTS = {
  collectionLayout: "grid-3",
  bannerHeight: "md",
  bannerVariant: "image",
  bannerOverlay: "left",
  mediaPlacement: "top",
  tone: "default",
  backToTop: "Back to top",
} as const;
