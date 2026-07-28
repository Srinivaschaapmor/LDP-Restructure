# 03 · Content Model

Populated in the **Content Modeling** phase: Contentful content types, fields,
validations, relationships, localization strategy, and governance rules.

The blueprint is [`section-model-spec.md`](./section-model-spec.md). Migrations in
`contentful/migrations/` are the source of truth for what is actually deployed.

## Mandatory reference for every new page: `reference/`
[`reference/restructure-source.md`](./reference/restructure-source.md) is the client's full
field/requirement analysis (69 content types, 256 fields) across the ~200+ Figma pages — the
exact source the Contentful SA reviewed (ADR-0005). [`reference/analysis-notes.md`](./reference/analysis-notes.md)
records verified issues in that sheet (missing types, naming mismatches, duplicates — don't
propagate them). **Consult it for every page**, but as a field inventory to map onto our
*existing consolidated types* below — never as a literal type-per-row spec. Process:
[contentful-development] rule 11.

## Implemented content types (by migration)

| Migration | Types created / changed |
|---|---|
| `001` | Primitives `media`, `meta`, `link`, `button`; item `card`; sections `banner`, `mediaContentBlock`, `richTextBlock`, `cardCollection`; chrome `header`, `footer`; `page` |
| `002`–`006` | Footer groups + navigation menu (`navigationMenu`, contextual/primary nav, `page` nav fields) |
| `007` | Section `accordion`; item `accordionItem`; item `document` (PDF asset **or** external link); widened `page.sections` whitelist to accept `accordion`. See [ADR-0004](../05-decisions/ADR-0004-accordion-document-type.md). |
| `008` | Section `resourceLibrary` (state selector: `heading`, `selectPrompt`, `accordions[]`); widened `page.sections` to accept `resourceLibrary`. |
| `009` | Validation guards from the Contentful SA content-model review (07-21-26): constrained all 7 RichText fields to `bold`/`italic`/`underline` marks + `ordered-list`/`unordered-list`/`hyperlink` nodes (no headings/quotes/tables/embeds); added URL-format regex to 5 href/URL fields; added `linkMimetypeGroup` to `media.asset` (image) and `document.file` (pdfdocument). See [ADR-0005](../05-decisions/ADR-0005-content-model-review-remediation.md). |
| `010` | `header.languageIcon`/`languageMenu`/`loginIcon`/`loginMenu` (reuse `media` + `linkGroup` — the utility bar above the header, found missing when re-checking the article-page Figma frame); `banner.overlay` enum (`none`\|`left`\|`right`) — makes the gradient overlay content-driven instead of hardcoded. |
| `011` | `header.chevronIcon` (→ `media`) — shared chevron glyph for the utility-bar dropdown triggers, sourced from Contentful rather than hardcoded (nextjs-development skill rule 7). |
| `012` | Bugfix: migration 009's `link.href`/`linkGroup.href` regex (`^(https?://\|/\|mailto:\|tel:\|#).+`) required a character *after* the prefix, silently rejecting the bare root path `"/"` — discovered when the utility-bar "English" entry failed to publish. Widened to `.*` (strictly more permissive; no previously-valid value stops matching). |

**Accordion note:** `accordionItem` carries both `content` (RichText) and `documents`
(→ `document`) as *optional* fields, so one type covers documents-only, content-only, and
combination items. `document` keeps the real file in Contentful (`file` → Asset) and is the
sanctioned home for PDF/external-doc rows (ADR-0004, resolving spec open decision #3).

**Frontend:** the Provider Resource Library is **one page** at `/providers/resource-library`
(`contentful/seed/seed-provider-resource-library-page.mjs`). A `resourceLibrary` section
(`src/components/sections/ResourceLibrary.tsx`) renders the H1 + intro + a **state `<select>`**;
each state is a reusable `accordion` entry (its `heading` = the state name), so choosing a state
swaps the shown accordion. Rendered by `Accordion.tsx` + `DocumentLink.tsx` (PDF icon taken from
Figma), registered under `accordion` / `resourceLibrary` in `registry.tsx`. Breadcrumbs
(`src/components/layout/Breadcrumbs.tsx`) derive from the slug + page title. Dummy PDFs are
swappable by replacing each asset's file in Contentful — the entries stay intact.
