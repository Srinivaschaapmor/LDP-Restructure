// Migration 016 (part 1 of 2) — deletes the 7 inline RichText fields, now that any
// live data has been preserved as richTextItem entries (see
// contentful/seed/migrate-richtext-to-entries.mjs, which MUST run before this).
// Part 2 (017) recreates each field with the same id as a Reference → richTextItem —
// split into two migrations so there's no transient same-id conflict within one run.
module.exports = function (migration) {
  migration.editContentType("banner").deleteField("subheading");
  const mcb = migration.editContentType("mediaContentBlock");
  mcb.deleteField("body");
  mcb.deleteField("bullets");
  migration.editContentType("card").deleteField("body");
  migration.editContentType("cardCollection").deleteField("intro");
  migration.editContentType("accordionItem").deleteField("content");
  migration.editContentType("richTextBlock").deleteField("content");
};
