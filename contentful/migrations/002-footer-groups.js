// Migration 002 — grouped footer columns + bottom legal bar, to match the design.
// Adds a reusable `linkGroup` (titled column of links) and extends `footer`.
module.exports = function (migration) {
  const lg = migration.createContentType("linkGroup").name("Link group")
    .description("A titled group of links (e.g. a footer column).").displayField("internalName");
  lg.createField("internalName").name("Internal name").type("Symbol").required(true);
  lg.createField("title").name("Title").type("Symbol");
  lg.createField("links").name("Links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });

  const footer = migration.editContentType("footer");
  footer.createField("columns").name("Columns").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["linkGroup"] }] });
  footer.createField("backToTopLabel").name("Back to top label").type("Symbol");
  footer.createField("legalLinks").name("Legal links").type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["link"] }] });
};
