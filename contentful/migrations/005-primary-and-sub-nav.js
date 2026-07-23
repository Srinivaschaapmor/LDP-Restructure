// Migration 005 — split navigation into two Page fields.
// primaryNav = plain header links (no dropdowns). subNav = the menu with
// dropdowns/drill-down, shared by the desktop sub-bar and the mobile drawer.
module.exports = function (migration) {
  const page = migration.editContentType("page");
  page.createField("primaryNav").name("Primary nav").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
  page.createField("subNav").name("Sub nav").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
  page.deleteField("navigation");
};
