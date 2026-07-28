// Migration 017 (part 2 of 2, ADR-0007) — recreates the 7 fields (same ids as before)
// as Reference → richTextItem, replacing the inline RichText fields deleted in 016.
module.exports = function (migration) {
  const ref = () => ({ linkContentType: ["richTextItem"] });

  migration.editContentType("banner").createField("subheading").name("Subheading")
    .type("Link").linkType("Entry").validations([ref()]);

  const mcb = migration.editContentType("mediaContentBlock");
  mcb.createField("body").name("Body").type("Link").linkType("Entry").validations([ref()]);
  mcb.createField("bullets").name("Bullets").type("Link").linkType("Entry").validations([ref()]);

  migration.editContentType("card").createField("body").name("Body")
    .type("Link").linkType("Entry").validations([ref()]);

  migration.editContentType("cardCollection").createField("intro").name("Intro")
    .type("Link").linkType("Entry").validations([ref()]);

  migration.editContentType("accordionItem").createField("content").name("Content")
    .type("Link").linkType("Entry").validations([ref()]);

  migration.editContentType("richTextBlock").createField("content").name("Content")
    .type("Link").linkType("Entry").validations([ref()]);
};
