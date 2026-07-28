# ADR-0008: Remove the `richTextBlock` wrapper section; use `richTextItem` directly

- **Status:** Accepted
- **Date:** 2026-07-28
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
ADR-0007 introduced `richTextItem` as a standalone, reusable rich-text reference type, and
converted 7 inline RichText fields to reference it — including `richTextBlock.content`, where
`richTextBlock` was itself just a page-level section wrapping a single `richTextItem` reference
plus a `width` enum. Once `richTextItem` existed as a real, independently-referenceable entry,
that wrapper added a reference hop with no remaining purpose: a page section that is *only* "one
rich text block" can just be a `richTextItem` entry, whitelisted directly in `Page.sections`.

Live-data check before changing anything: exactly one `richTextBlock` entry existed
(`rt-oral-health-source`), referenced by exactly one page, with `width: "default"` (never used
the `narrow` variant).

## Decision
Remove the `richTextBlock` content type. `richTextItem` is now directly whitelisted in
`Page.sections` and rendered as a section in its own right. The `width` field is dropped (the
one live usage never used the non-default value); if a narrow-column rich-text section is needed
later, add it back as a field on `richTextItem` or reconsider then — no evidence it's needed now.

## Migration (see `contentful/migrations/018-019` and
`contentful/seed/swap-richtextblock-for-richtextitem.mjs` / `delete-richtextblock-entry.mjs`)
1. **018** — add `richTextItem` to `Page.sections` whitelist (alongside `richTextBlock`,
   transiently).
2. **Script** — the one page referencing the `richTextBlock` entry now references the
   `richTextItem` entry it wrapped, directly, in the same position.
3. **Script** — unpublish + delete the now-orphaned `richTextBlock` entry.
4. **019** — remove `richTextBlock` from the `Page.sections` whitelist; delete the
   `richTextBlock` content type.

## Consequences
- Positive: one fewer content type, one fewer reference hop for the "just some rich text on the
  page" case; `richTextItem` entries are usable both as a field value (per ADR-0007) and directly
  as a page section, with no divergence in shape.
- Negative / trade-offs: lost the `width` (`default`/`narrow`) control point; not missed by the
  one entry that existed, but a real requirement for a narrow column would need a follow-up.
- Follow-ups: `src/components/sections/RichTextItem.tsx` (`RichTextItemSection`) replaces
  `RichTextBlock.tsx` in the registry; `section-model-spec.md` and `contentful-development`
  updated in this same change.
