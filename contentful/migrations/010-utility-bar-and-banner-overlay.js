// Migration 010 — two gaps found reviewing the "5 toothbrush tips" article Figma frame
// (node 2:140) against the built site: (1) the top utility bar (Language + Login
// dropdowns) above the header was never modeled; (2) the banner's gradient overlay was
// hardcoded in SCSS with no Contentful control. See docs/03-content-model/README.md.
//
// Reuses existing types rather than inventing new ones: the utility-bar dropdowns are
// `linkGroup` (already renders via the existing nav-dropdown component); the icons are
// `media` (never hardcoded SVG — see nextjs-development skill rule 7).
module.exports = function (migration) {
  const header = migration.editContentType("header");
  header.createField("languageIcon").name("Language icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  header.createField("languageMenu").name("Language menu").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["linkGroup"] }]);
  header.createField("loginIcon").name("Login icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
  header.createField("loginMenu").name("Login menu").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["linkGroup"] }]);

  const banner = migration.editContentType("banner");
  banner.createField("overlay").name("Overlay").type("Symbol")
    .validations([{ in: ["none", "left", "right"] }]);
};
