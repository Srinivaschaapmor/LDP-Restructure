// Migration 008 — Resource library section (state selector).
// The Provider Resource Library is ONE page: a title + intro + a state dropdown that
// swaps the shown accordion. Each state's content is a reusable `accordion` entry
// (its heading = the state name), so this section just composes existing accordions.
// See docs/03-content-model/section-model-spec.md and ADR-0004.
module.exports = function (migration) {
  const rl = migration.createContentType("resourceLibrary").name("Resource library")
    .description("State-selector library: a heading + prompt + a state dropdown that swaps the shown accordion.")
    .displayField("internalName");
  rl.createField("internalName").name("Internal name").type("Symbol").required(true);
  rl.createField("heading").name("Heading").type("Symbol");
  rl.createField("selectPrompt").name("Select prompt").type("Symbol");
  rl.createField("accordions").name("Accordions (one per state)").type("Array").required(true)
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: ["accordion"] }] });

  // Widen Page.sections to accept the new section (re-list all currently-allowed types).
  const page = migration.editContentType("page");
  page.editField("sections").items({
    type: "Link", linkType: "Entry",
    validations: [{ linkContentType: ["banner", "mediaContentBlock", "cardCollection", "richTextBlock", "accordion", "resourceLibrary"] }],
  });
};
