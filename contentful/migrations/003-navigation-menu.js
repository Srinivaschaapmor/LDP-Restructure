// Migration 003 — responsive navigation menu (primary nav + sub-menu).
// A navigationMenu is an ordered list of items, each a plain `link` or a
// `linkGroup` (dropdown/accordion with children). Reuses existing primitives.
module.exports = function (migration) {
  const menu = migration.createContentType("navigationMenu").name("Navigation menu")
    .description("Ordered menu items; each item is a link or a linkGroup (dropdown).")
    .displayField("internalName");
  menu.createField("internalName").name("Internal name").type("Symbol").required(true);
  menu.createField("title").name("Title").type("Symbol");
  menu.createField("items").name("Items").type("Array").required(true)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link", "linkGroup"] }] });

  const header = migration.editContentType("header");
  header.createField("primaryMenu").name("Primary menu").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
  header.createField("subMenu").name("Sub menu").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["navigationMenu"] }]);
};
