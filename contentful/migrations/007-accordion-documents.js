// Migration 007 — Accordion section + AccordionItem + Document (item type).
// Built for the "Provider resource library" design: an accordion whose items each
// hold a list of downloadable documents (mostly PDFs) OR rich content OR both.
// Created in dependency order (leaf/primitives first) so every reference points at a
// type that already exists; the existing `page` type is edited LAST to widen its
// sections whitelist. See docs/03-content-model/section-model-spec.md §7.5 and
// docs/05-decisions/ADR-0004-accordion-document-type.md.
module.exports = function (migration) {
  // ---- Item type: Document -------------------------------------------------
  // One downloadable/linked document. Holds the real file as a Contentful asset
  // (`file`) OR points at an external URL (`externalUrl`) — never assume both.
  const document = migration.createContentType("document").name("Document")
    .description("A single downloadable document (PDF asset) or external document link.")
    .displayField("internalName");
  document.createField("internalName").name("Internal name").type("Symbol").required(true);
  document.createField("label").name("Label").type("Symbol").required(true);
  document.createField("file").name("File").type("Link").linkType("Asset");
  document.createField("externalUrl").name("External URL").type("Symbol");
  document.createField("isExternal").name("Is external").type("Boolean");
  document.createField("kind").name("Kind").type("Symbol")
    .validations([{ in: ["pdf", "external", "other"] }]);

  // ---- Item type: AccordionItem --------------------------------------------
  // One expandable group. `content` (rich text) and `documents` are BOTH optional so a
  // single type covers documents-only, content-only, and combination items.
  const accordionItem = migration.createContentType("accordionItem").name("Accordion item")
    .description("Expandable group: a heading plus optional rich content and/or a list of documents.")
    .displayField("internalName");
  accordionItem.createField("internalName").name("Internal name").type("Symbol").required(true);
  accordionItem.createField("title").name("Title").type("Symbol").required(true);
  accordionItem.createField("content").name("Content").type("RichText");
  accordionItem.createField("documents").name("Documents").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["document"] }] });

  // ---- Section: Accordion --------------------------------------------------
  const accordion = migration.createContentType("accordion").name("Accordion")
    .description("Expandable list section; emits FAQ structured data where relevant.")
    .displayField("internalName");
  accordion.createField("internalName").name("Internal name").type("Symbol").required(true);
  accordion.createField("heading").name("Heading").type("Symbol");
  accordion.createField("items").name("Items").type("Array").required(true)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["accordionItem"] }] });
  accordion.createField("allowMultipleOpen").name("Allow multiple open").type("Boolean");

  // ---- Widen Page.sections whitelist (edit existing type, last) ------------
  // Overwrites the items validation, so ALL currently-allowed types must be re-listed.
  const page = migration.editContentType("page");
  page.editField("sections").items({
    type: "Link", linkType: "Entry",
    validations: [{ linkContentType: ["banner", "mediaContentBlock", "cardCollection", "richTextBlock", "accordion"] }],
  });
};
