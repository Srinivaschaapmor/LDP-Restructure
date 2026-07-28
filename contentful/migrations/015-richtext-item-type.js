// Migration 015 — introduce `richTextItem` as a standalone, REUSABLE reference type
// (per ADR-0007, a deliberate, confirmed reversal of the earlier "prefer inline
// RichText fields" rule — see contentful-development skill rule 6 / ADR-0005 finding
// H6). Reason: rich text blocks need to be shareable across multiple entries/pages,
// which an inline field structurally cannot do.
//
// Same validations as every current inline RichText field (unchanged bar) — no
// headings/quotes/tables/embeds, so the code-derived heading hierarchy (rule 10)
// stays intact.
//
// This migration ONLY creates the new type. The 7 existing inline RichText fields
// (banner.subheading, mediaContentBlock.body/bullets, card.body, cardCollection.intro,
// accordionItem.content, richTextBlock.content) are converted in migration 016, AFTER
// any real existing content is preserved into richTextItem entries (2 of the 7 fields
// have live data: card.body ×5 entries, richTextBlock.content ×1 — see
// contentful/seed/migrate-richtext-to-entries.mjs, which must run between 015 and 016).
module.exports = function (migration) {
  const richTextItem = migration.createContentType("richTextItem").name("Rich text item")
    .description("Reusable rich text block, referenced by other content types (link once, use everywhere).")
    .displayField("internalName");
  richTextItem.createField("internalName").name("Internal name").type("Symbol").required(true);
  richTextItem.createField("content").name("Content").type("RichText").required(true)
    .validations([
      { enabledMarks: ["bold", "italic", "underline"], message: "Only bold, italic and underline are allowed." },
      { enabledNodeTypes: ["ordered-list", "unordered-list", "hyperlink"], message: "Only lists and hyperlinks are allowed — no headings, quotes, tables, or embeds." },
    ]);
};
