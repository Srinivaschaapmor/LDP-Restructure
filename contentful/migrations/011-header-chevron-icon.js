// Migration 011 — the utility-bar dropdown triggers (migration 010) need a chevron
// glyph. Rather than hardcode another inline SVG, add one shared icon field on
// `header` (nextjs-development skill rule 7: icons are Contentful assets, never
// hand-drawn in new code).
module.exports = function (migration) {
  const header = migration.editContentType("header");
  header.createField("chevronIcon").name("Chevron icon").type("Link").linkType("Entry")
    .validations([{ linkContentType: ["media"] }]);
};
