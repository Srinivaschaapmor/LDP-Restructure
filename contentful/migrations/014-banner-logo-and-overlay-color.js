// Migration 014 — Banner gains `overlayColor` (a validated hex string, NOT a free
// color picker: Contentful regex-enforces `#RGB`/`#RRGGBB` at entry time, and the
// frontend has a safe-fallback to the design-system navy if the value is ever
// missing/invalid — see ADR-0006 for why this is a deliberate, scoped exception to
// "no free color pickers"). `overlay` (direction: none/left/right, migration 010)
// is unchanged and orthogonal — direction and color are independent concerns.
//
// Note: `logo`, `subheading`, and `cta` already exist on Banner (migration 001) but
// were never wired into BannerFields/Banner.tsx — that gap is fixed in this same
// change, not via a migration (no schema change needed for already-existing fields).
module.exports = function (migration) {
  const banner = migration.editContentType("banner");
  banner.createField("overlayColor").name("Overlay color").type("Symbol")
    .validations([{ regexp: { pattern: "^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$" } }]);
};
