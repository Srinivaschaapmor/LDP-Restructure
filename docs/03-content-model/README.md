# 03 · Content Model

Populated in the **Content Modeling** phase: Contentful content types, fields,
validations, relationships, localization strategy, and governance rules.

The blueprint is [`section-model-spec.md`](./section-model-spec.md). Migrations in
`contentful/migrations/` are the source of truth for what is actually deployed.

## Implemented content types (by migration)

| Migration | Types created / changed |
|---|---|
| `001` | Primitives `media`, `meta`, `link`, `button`; item `card`; sections `banner`, `mediaContentBlock`, `richTextBlock`, `cardCollection`; chrome `header`, `footer`; `page` |
| `002`–`006` | Footer groups + navigation menu (`navigationMenu`, contextual/primary nav, `page` nav fields) |
| `007` | Section `accordion`; item `accordionItem`; item `document` (PDF asset **or** external link); widened `page.sections` whitelist to accept `accordion`. See [ADR-0004](../05-decisions/ADR-0004-accordion-document-type.md). |
| `008` | Section `resourceLibrary` (state selector: `heading`, `selectPrompt`, `accordions[]`); widened `page.sections` to accept `resourceLibrary`. |

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
(`src/components/chrome/Breadcrumbs.tsx`) derive from the slug + page title. Dummy PDFs are
swappable by replacing each asset's file in Contentful — the entries stay intact.
