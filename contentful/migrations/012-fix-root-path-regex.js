// Migration 012 — fixes a real bug in migration 009's href regex. The pattern
// `^(https?://|/|mailto:|tel:|#).+` requires at least one character AFTER the
// matched prefix, so the bare root path "/" (exactly one character) was rejected —
// discovered when the utility-bar "English" link (href="/") silently failed to
// publish. Widening the trailing quantifier from `.+` to `.*` only ADDS coverage
// (bare "/", "#", "mailto:", "tel:" now valid); every string the old pattern
// accepted still matches, so no previously-valid entry is affected.
module.exports = function (migration) {
  const pattern = "^(https?://|/|mailto:|tel:|#).*";
  const link = migration.editContentType("link");
  link.editField("href").validations([{ regexp: { pattern } }]);
  const linkGroup = migration.editContentType("linkGroup");
  linkGroup.editField("href").validations([{ regexp: { pattern } }]);
};
