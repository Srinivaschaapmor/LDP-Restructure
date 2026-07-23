// Migration 006 — contextual, per-section navigation.
// A linkGroup can now be a navigable label too (href), so each primary item
// (Members/Providers/…) is a link that OWNS its sub-menu (its children).
// The sub-bar is derived from the active section, so the separate subNav is removed.
module.exports = function (migration) {
  const lg = migration.editContentType("linkGroup");
  lg.createField("href").name("Href").type("Symbol");
  lg.changeFieldControl("href", "builtin", "singleLine");

  const page = migration.editContentType("page");
  page.deleteField("subNav");
};
