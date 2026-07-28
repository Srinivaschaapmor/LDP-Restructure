# ADR-0005: Content-model review remediation (Contentful SA, 07-21-26)

- **Status:** Accepted
- **Date:** 2026-07-24
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)
- **Source:** *Content Model Review: Liberty Dental / Aapmor* — Joe Meersman, Contentful SA,
  reviewed 07-21-26 (`Restructuring Approval Contentful.csv`).

## Context
The review assessed a **proposed ~65-content-type restructuring spreadsheet**, not this repo's
implemented model. It flagged 6 High and 10 Medium findings. Cross-checking each finding against
our actual 18-type model (built from `section-model-spec.md`) showed **13 of 16 findings —
including all 6 High — were already satisfied** by design: headings are inline fields (not a
linked `Heading` type), rich text is inline per-component (not a wrapper entry), every reference
has a `linkContentType` whitelist, no dangling/duplicate/empty types, and the model is already the
~18-type consolidation the review recommends the other codebase converge on.

Three concrete gaps remained, corresponding to the *unresolved half* of finding #2 and findings
#10 and #15:
1. **RichText fields were fully open** (no `enabledMarks`/`enabledNodeTypes`) — finding #2's
   "also constrain the RichText" clause.
2. **URL fields had no format validation** — finding #10 (they were already `Symbol`, so the
   "Long Text" part of #10 didn't apply, only the missing regex).
3. **Asset reference fields had no `linkMimetypeGroup`** — finding #15.

## Decision
Ship **migration `009-validation-guards.js`** addressing all three, with two content decisions
made explicitly (not left as reviewer suggestions):

**RichText constraint — minimal inline set only.** Every RichText field (`accordionItem.content`,
`cardCollection.intro`, `richTextBlock.content`, `banner.subheading`, `card.body`,
`mediaContentBlock.body`, `mediaContentBlock.bullets`) is restricted to
**bold, italic, underline marks + ordered-list, unordered-list, hyperlink nodes**. Explicitly
**excluded**: headings, blockquote, hr, tables, code blocks, and embedded assets/entries.
Rationale: these are component **copy** fields, not standalone articles — headings inside a
component's body would fight the code-derived heading hierarchy (see below), and embeds would
reopen the deep-include-depth problem the review's findings #1/#2/#6 exist to prevent.

**Heading level — code-derived, no CMS dropdown.** The review's finding #1 fix suggests an
optional `headingLevel` (H1–H4) dropdown alongside the inline heading field. We deliberately did
**not** add one: an editor-controlled level can produce duplicate `<h1>`s or skipped levels, which
violates WCAG 2.2 AA (this project's non-negotiable). Instead, `src/components/ui/
Heading.tsx` takes a `level` prop that each section computes from its position in the page
(page title → h1; section heading → h2; nested item title → h3), guaranteeing a valid outline
with nothing for an editor to get wrong.

**URL regex, by field's actual purpose** (not one blanket pattern):
- `link.href` / `linkGroup.href` — nav links may be absolute, root-relative, `mailto:`, `tel:`,
  or `#anchor`: `^(https?://|/|mailto:|tel:|#).+`
- `meta.canonicalUrl` / `document.externalUrl` — must be an absolute URL: `^https?://.+`
- `media.externalUrl` — absolute URL or root-relative path: `^(https?://|/).+`

**MIME groups:** `media.asset` → `image`; `document.file` → `pdfdocument`.

## Verification
- All pre-existing entries were audited against the new rules before and after the migration:
  **0 RichText violations, 0 URL-format violations, 0 MIME mismatches** — the migration required
  no data cleanup.
- Functional check: Contentful enforces these validations at **publish**, not at draft-create
  (standard CMA behavior) — confirmed by creating a disallowed entry (rejected on `publish()`)
  and deleting the test entry immediately after.

## Consequences
- Positive: closes the review's only unaddressed findings; editors get real save-time guardrails
  (can't paste a table into a bullet field, can't type a bad URL, can't attach a Word doc where a
  PDF is expected).
- Negative / trade-offs: existing entries created before this migration are validated only on
  their *next* publish — a stale published entry that happened to violate a rule (none currently
  do, per the audit) would not be retroactively caught until edited.
- Not addressed (explicit non-findings for us): `#1` Heading-as-entry, `#3` dangling types, `#4`
  open references, `#5` type sprawl, `#6` include-depth, `#7`–`#9` naming/dupes/empty types,
  `#11` SEO-limits-in-labels, `#12` layout-in-content, `#13` boolean-vs-enum, `#16` secure-portal
  PII — all already satisfied by the existing model, no action needed.
- **Decided (2026-07-24), both keep-as-is:**
  - `meta.keywords` stays a single `Symbol` (finding #11's "weak Keywords" note) — no entries use
    multiple keywords today; revisit as `Array<Symbol>` only if a real multi-keyword need shows up.
  - The `media` wrapper is kept (finding #14) — its `altText` (required, per-usage), `externalUrl`
    (non-Contentful fallback), and `width`/`height` (CLS-safe sizing) all do real work beyond what
    a native Contentful Asset alone provides. Revisit only if those needs disappear.

## Review closure
All 16 findings are now closed: 12 were already satisfied by the model as designed (all 6 High +
6 Medium), migration `009` fixed the 3 remaining actionable gaps (#2's constrain-RichText clause,
#10, #15), and #11/#14 are explicit "keep as-is" product decisions, not open defects. **Nothing
outstanding from this review.**
