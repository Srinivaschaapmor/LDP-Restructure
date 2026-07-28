// Migration 013 — add the header search icon; remove two dead fields.
// `navLinks` (superseded by Page.primaryNav, migration 004/005) and `utilityLinks`
// (superseded by the languageMenu/loginMenu UtilityBar, migrations 010/011) are no
// longer read anywhere in the app — see figma-mcp-workflow rule 8 (remove superseded
// work completely). `searchIcon` follows the existing icon pattern (Media reference,
// never hand-drawn SVG — nextjs-development rule 7).
module.exports = function (migration) {
  const header = migration.editContentType("header");
  header.createField("searchIcon").name("Search icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  header.deleteField("navLinks");
  header.deleteField("utilityLinks");
};
