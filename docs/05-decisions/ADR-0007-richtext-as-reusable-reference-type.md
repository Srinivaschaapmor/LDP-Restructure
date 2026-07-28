# ADR-0007: RichText becomes a standalone, reusable reference type

- **Status:** Accepted
- **Date:** 2026-07-28
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
`contentful-development` skill rule 6 ("prefer rich text fields directly... instead of
wrapper content types") and the original Contentful architecture review (finding H6:
"wrapper-CT indirection inflates entry count & depth") both explicitly steered this project
**away** from a dedicated RichText wrapper type — the model used **inline** `RichText` fields
on 7 content types instead: `banner.subheading`, `mediaContentBlock.body`/`bullets`,
`card.body`, `cardCollection.intro`, `accordionItem.content`, `richTextBlock.content`.

The user requested reversing this: a standalone `richTextItem` content type, referenced by
all 7 fields, so the **same** rich text block can be shared across multiple entries/pages —
something an inline field cannot do (each entry gets its own independent copy).

## Options considered
1. **Keep inline fields (status quo).** Zero entry-count/payload cost, matches the prior
   decision, but no reuse is possible — a shared disclaimer or standard paragraph must be
   copy-pasted into every entry that needs it, and a wording fix means editing N places.
2. **Standalone `richTextItem` type, all 7 fields converted (adopted).** One entry per
   distinct block; entries reference it via `Link → Entry`. Editing the block updates every
   page that references it. Reintroduces the entry-count/depth cost H6 flagged — accepted
   as the deliberate trade-off for reuse.
3. **Hybrid — only convert fields likely to need reuse.** Rejected for consistency: partial
   conversion means two different mental models for "how do I add rich text" depending on
   which field, which is worse for editors and for the codebase's `asFields` boundary pattern.

## Decision
Adopt Option 2. All 7 previously-inline RichText fields are now `Link → Entry` validated to
`richTextItem`. `richTextItem` carries the exact same validation every inline field already
had (`enabledMarks: [bold, italic, underline]`, `enabledNodeTypes: [ordered-list,
unordered-list, hyperlink]`) — no regression on rule 10 (code-derived heading hierarchy).

## Migration (for the record — see `contentful/migrations/015-017` and
`contentful/seed/migrate-richtext-to-entries.mjs` / `wire-richtext-references.mjs`)
Only 2 of the 7 fields had live data at conversion time (`card.body` ×5 entries,
`richTextBlock.content` ×1) — verified via the CMA before writing any migration. Order used
(destructive field deletion must never precede preserving the data it holds):
1. **015** — create `richTextItem`.
2. **Script** — read the 6 populated fields, create one `richTextItem` entry per value,
   publish, record the old-entry→new-entry mapping.
3. **016** — delete all 7 inline RichText fields (safe now; the 2 with real data are
   preserved as entries; the other 5 were empty everywhere).
4. **017** — recreate all 7 fields with the same ids, now `Link → Entry → richTextItem`.
5. **Script** — point the 6 entries' new reference fields at the richTextItem entries from
   step 2, publish. Verified live in the browser: all 5 tip bodies + the source line render
   unchanged.

## Consequences
- Positive: rich text blocks are now reusable exactly like `link`/`media`/`button`; editing
  a shared block once updates everywhere it's referenced.
- Negative / trade-offs: one more entry per distinct rich text block; one more reference hop
  per component (`field.fields.content` instead of `field` directly) in every consumer
  (`Banner`, `MediaContentBlock`, `Card`/`CardCollection`, `Accordion`, `RichTextBlock`) —
  slightly deeper payload, exactly the H6 cost, now deliberately accepted.
- Follow-ups: `contentful-development` rule 6 and `section-model-spec.md`'s field tables are
  updated in this same change to describe the new pattern, not the old one — supersedes rule
  6 project-wide (unlike ADR-0006, which was scoped to one field, this applies to all rich
  text going forward: new rich-text-bearing fields should reference `richTextItem`, not add
  another inline `RichText` field).
