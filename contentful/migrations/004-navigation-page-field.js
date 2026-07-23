// Migration 004 — decouple navigation from the header and support multi-level menus.
// - linkGroup.links becomes recursive (link | linkGroup) for drill-down menus.
// - Page gains a `navigation` field referencing a navigationMenu.
// - header.primaryMenu / header.subMenu are removed (menu is no longer mixed into header).
module.exports = function (migration) {
  const lg = migration.editContentType("linkGroup");
  lg.editField("links").items({
    type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link", "linkGroup"] }],
  });

  const page = migration.editContentType("page");
  page.createField("navigation").name("Navigation").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);

  const header = migration.editContentType("header");
  header.deleteField("primaryMenu");
  header.deleteField("subMenu");
};
