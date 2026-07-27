# ADR-0004: Documents in an accordion use a dedicated `document` type (spec open decision #3)

- **Status:** Accepted
- **Date:** 2026-07-23
- **Deciders:** sai_dev1@aapmor.com, Claude (mentor)

## Context
The "Provider resource library" design (Figma `for-devs`, node `36:1628`) is an **accordion**
whose groups (Forms, Guides and instructions, FAQs, Policies and supporting documents) each list
downloadable documents — mostly **PDFs**, but at least one **external link** (fluoride clinical
guidelines). Migration `007` had to introduce `accordion` + `accordionItem`; the open question was
how a single document row (label + a PDF file *or* an external URL + a type icon) should be modelled.

The content-model spec (§7.5, §10, open decision #3) left this explicitly undecided: *"PDF documents
— as `Card` links, or a dedicated `DocumentList`?"* Two forces apply: `contentful-development` rule 2
(**assets live in Contentful from the start** — a real file, swappable later) and the reusability
principle (**don't proliferate types**).

## Options considered
1. **Reuse `Link`** (label + href). Minimal, matches "PDF as links." But `Link` has no asset
   reference, so the real PDF can't live in Contentful — href would point at some external URL,
   violating contentful rule 2 and the user's "store the file, swap later" requirement.
2. **Reuse `Media`** (asset + externalUrl + altText). Keeps the file in Contentful, but `Media` has
   no visible **label** field and its `altText` is *required* (image a11y semantics) — a poor fit for
   a titled document link; conflates "image" with "document."
3. **Dedicated `document` item type** — purpose-built: `label`, `file` (→ Asset), `externalUrl`,
   `isExternal`, `kind` enum (`pdf`·`external`·`other`). One optional-field type covers both the
   uploaded-PDF and external-link cases the design actually shows.

## Decision
Adopt **Option 3**. `document` is a leaf **item type** (like `Card`), referenced only from
`accordionItem.documents` (whitelisted). PDFs store the real file via `file` → Asset; external
docs set `externalUrl` + `isExternal`. `accordionItem` keeps `content` (RichText) **and**
`documents` both optional, so one type serves documents-only, content-only, and combination items.

## Rationale
- Satisfies both forces: the file lives in Contentful (rule 2, swappable) **and** we add exactly one
  small, single-responsibility type rather than overloading `Link`/`Media`.
- Matches the design 1:1 (mixed PDF + external rows) and the frontend can branch on `kind`/`isExternal`
  by content-type id, never `sys.id` (contentful rule 1).

## Consequences
- Positive: clean, queryable document list; dummy PDFs swap by replacing the asset file, entry untouched.
- Negative / trade-offs: one more content type than a pure `Link` reuse. Bounded — `document` is only
  valid inside `accordionItem.documents`.
- Follow-ups: when a non-accordion surface needs the same document list (e.g. a `CardCollection` of
  PDFs), reuse `document` rather than inventing another type; revisit a shared `DocumentList` only if
  that recurs. Frontend `Accordion` + `document` renderer is a separate task (not built here).
