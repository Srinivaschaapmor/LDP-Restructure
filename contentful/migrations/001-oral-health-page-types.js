// Migration 001 — content types for the oral-health article page.
// Created in dependency order (leaf primitives first, Page last) so every
// reference points at a type that already exists. Idempotent-ish: run once on a
// fresh environment. See docs/03-content-model/section-model-spec.md.
module.exports = function (migration) {
  // ---- Primitives ----------------------------------------------------------
  const media = migration.createContentType("media").name("Media")
    .description("Reusable image/media asset with accessibility text and sizing.")
    .displayField("internalName");
  media.createField("internalName").name("Internal name").type("Symbol").required(true);
  media.createField("asset").name("Asset").type("Link").linkType("Asset");
  media.createField("altText").name("Alt text").type("Symbol").required(true);
  media.createField("ariaLabel").name("Aria label").type("Symbol");
  media.createField("width").name("Width").type("Integer");
  media.createField("height").name("Height").type("Integer");
  media.createField("externalUrl").name("External URL").type("Symbol");

  const meta = migration.createContentType("meta").name("Meta")
    .description("SEO metadata for a page.").displayField("internalName");
  meta.createField("internalName").name("Internal name").type("Symbol").required(true);
  meta.createField("title").name("Title").type("Symbol").required(true)
    .validations([{ size: { min: 40, max: 75 } }]);
  meta.createField("description").name("Description").type("Text").required(true)
    .validations([{ size: { min: 110, max: 160 } }]);
  meta.createField("keywords").name("Keywords").type("Symbol");
  meta.createField("ogImage").name("OG image").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  meta.createField("canonicalUrl").name("Canonical URL").type("Symbol");
  meta.createField("noindex").name("No index").type("Boolean");

  const link = migration.createContentType("link").name("Link")
    .description("Reusable link: label + destination.").displayField("internalName");
  link.createField("internalName").name("Internal name").type("Symbol").required(true);
  link.createField("label").name("Label").type("Symbol").required(true);
  link.createField("href").name("Href").type("Symbol").required(true);
  link.createField("isExternal").name("Is external").type("Boolean");
  link.createField("icon").name("Icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);

  const button = migration.createContentType("button").name("Button")
    .description("CTA button referencing a link.").displayField("internalName");
  button.createField("internalName").name("Internal name").type("Symbol").required(true);
  button.createField("label").name("Label").type("Symbol").required(true);
  button.createField("link").name("Link").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["link"] }]);
  button.createField("variant").name("Variant").type("Symbol")
    .validations([{ in: ["primary", "secondary", "tertiary", "ghost"] }]);

  // ---- Item type -----------------------------------------------------------
  const card = migration.createContentType("card").name("Card")
    .description("Card item used inside a CardCollection.").displayField("internalName");
  card.createField("internalName").name("Internal name").type("Symbol").required(true);
  card.createField("media").name("Media").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  card.createField("title").name("Title").type("Symbol");
  card.createField("subtitle").name("Subtitle").type("Symbol");
  card.createField("body").name("Body").type("RichText");
  card.createField("links").name("Links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
  card.createField("cta").name("CTA").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["button"] }]);
  card.createField("order").name("Order").type("Integer");

  // ---- Sections ------------------------------------------------------------
  const banner = migration.createContentType("banner").name("Banner")
    .description("Hero/banner section.").displayField("internalName");
  banner.createField("internalName").name("Internal name").type("Symbol").required(true);
  banner.createField("heading").name("Heading").type("Symbol");
  banner.createField("subheading").name("Subheading").type("RichText");
  banner.createField("backgroundImage").name("Background image").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  banner.createField("logo").name("Logo").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  banner.createField("cta").name("CTA").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["button"] }]);
  banner.createField("variant").name("Variant").type("Symbol")
    .validations([{ in: ["image", "gradient", "plain"] }]);
  banner.createField("height").name("Height").type("Symbol")
    .validations([{ in: ["sm", "md", "lg"] }]);

  const mcb = migration.createContentType("mediaContentBlock").name("Media content block")
    .description("Image/icon + copy + optional CTA. Variant-driven.").displayField("internalName");
  mcb.createField("internalName").name("Internal name").type("Symbol").required(true);
  mcb.createField("eyebrow").name("Eyebrow").type("Symbol");
  mcb.createField("heading").name("Heading").type("Symbol");
  mcb.createField("body").name("Body").type("RichText");
  mcb.createField("bullets").name("Bullets").type("RichText");
  mcb.createField("media").name("Media").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  mcb.createField("ctas").name("CTAs").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["button"] }] });
  mcb.createField("mediaPlacement").name("Media placement").type("Symbol")
    .validations([{ in: ["left", "right", "top", "background"] }]);
  mcb.createField("tone").name("Tone").type("Symbol")
    .validations([{ in: ["default", "subtle", "brand", "inverse"] }]);

  const richText = migration.createContentType("richTextBlock").name("Rich text block")
    .description("Standalone formatted copy.").displayField("internalName");
  richText.createField("internalName").name("Internal name").type("Symbol").required(true);
  richText.createField("content").name("Content").type("RichText").required(true);
  richText.createField("width").name("Width").type("Symbol")
    .validations([{ in: ["narrow", "default", "wide", "full"] }]);

  const cardCollection = migration.createContentType("cardCollection").name("Card collection")
    .description("Grid/list/carousel of cards.").displayField("internalName");
  cardCollection.createField("internalName").name("Internal name").type("Symbol").required(true);
  cardCollection.createField("heading").name("Heading").type("Symbol");
  cardCollection.createField("intro").name("Intro").type("RichText");
  cardCollection.createField("layout").name("Layout").type("Symbol")
    .validations([{ in: ["grid-2", "grid-3", "grid-4", "list", "carousel", "split"] }]);
  cardCollection.createField("cards").name("Cards").type("Array").required(true)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["card"] }] });

  // ---- Chrome --------------------------------------------------------------
  const header = migration.createContentType("header").name("Header")
    .description("Global page header (reused across pages).").displayField("internalName");
  header.createField("internalName").name("Internal name").type("Symbol").required(true);
  header.createField("logo").name("Logo").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  header.createField("navLinks").name("Nav links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
  header.createField("utilityLinks").name("Utility links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
  header.createField("cta").name("CTA").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["button"] }]);

  const footer = migration.createContentType("footer").name("Footer")
    .description("Global page footer (reused across pages).").displayField("internalName");
  footer.createField("internalName").name("Internal name").type("Symbol").required(true);
  footer.createField("logo").name("Logo").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  footer.createField("linkColumns").name("Link columns").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
  footer.createField("socialLinks").name("Social links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
  footer.createField("legalText").name("Legal text").type("Symbol");

  // ---- Page (references everything — created last) -------------------------
  const page = migration.createContentType("page").name("Page")
    .description("Route-level container. Ordered, reusable sections.").displayField("internalName");
  page.createField("internalName").name("Internal name").type("Symbol").required(true);
  page.createField("slug").name("Slug").type("Symbol").required(true)
    .validations([{ unique: true }, { regexp: { pattern: "^/.*$" } }]);
  page.createField("title").name("Title").type("Symbol").required(true);
  page.createField("meta").name("Meta").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["meta"] }]);
  page.createField("header").name("Header").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["header"] }]);
  page.createField("footer").name("Footer").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["footer"] }]);
  page.createField("sections").name("Sections").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{
      linkContentType: ["banner", "mediaContentBlock", "cardCollection", "richTextBlock"],
    }] });
};
