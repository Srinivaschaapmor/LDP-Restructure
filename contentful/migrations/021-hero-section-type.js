// Migration 021 — dedicated `hero` section type.
// Derived from the client's restructure spreadsheet row #2 "Banner" (Background Image,
// Logo, Heading), but deliberately NOT a 1:1 transcription of it:
//   - `heading` is a plain Symbol, not a reference to the sheet's `Heading` type (#70).
//     That type carries a "Heading Level" dropdown, which contentful-development rule 10
//     and ADR-0005 review finding #1 both forbid — an editor-chosen level produces
//     duplicate <h1>s or skipped levels and breaks WCAG 2.2 AA. Level is computed in code
//     from the section's position in the page.
//   - The sheet's three fields cannot hold the Home hero's actual content, which has a CTA
//     and a line of sub-copy. `subheading` and `cta` are carried over from `banner` so the
//     design is representable.
// `banner` is left in place: it is still referenced by other pages' sections.
module.exports = function (migration) {
  const hero = migration.createContentType("hero").name("Hero")
    .description("Full-bleed page hero: background image, heading, sub-copy and a single CTA.")
    .displayField("internalName");

  hero.createField("internalName").name("Internal name").type("Symbol").required(true);
  hero.createField("heading").name("Heading").type("Symbol");
  // Rich text always by reference (ADR-0007); richTextItem already locks down marks/nodes.
  hero.createField("subheading").name("Subheading").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["richTextItem"] }]);
  hero.createField("backgroundImage").name("Background image").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  hero.createField("logo").name("Logo").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  hero.createField("cta").name("CTA").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["button"] }]);
  hero.createField("variant").name("Variant").type("Symbol")
    .validations([{ in: ["image", "gradient", "plain"] }]);
  hero.createField("height").name("Height").type("Symbol")
    .validations([{ in: ["sm", "md", "lg"] }]);
  // `overlay` is the scrim DIRECTION; "flat" is the uniform wash the Home hero uses.
  hero.createField("overlay").name("Overlay").type("Symbol")
    .validations([{ in: ["none", "left", "right", "flat"] }]);
  hero.createField("overlayColor").name("Overlay color").type("Symbol")
    .validations([{ regexp: { pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$" } }]);

  // Widen Page.sections to accept it — editField().items() REPLACES the whitelist, so every
  // currently-allowed type is re-listed.
  migration.editContentType("page").editField("sections").items({
    type: "Link",
    linkType: "Entry",
    validations: [{
      linkContentType: [
        "hero", "banner", "mediaContentBlock", "cardCollection",
        "richTextItem", "accordion", "resourceLibrary",
      ],
    }],
  });
};
