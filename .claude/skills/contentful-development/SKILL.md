---
name: contentful-development
description: Contentful modeling, migrations, entries, assets, and CDA fetching for this project. Use whenever creating/editing content types, writing migration scripts, seeding or authoring entries, uploading assets, or fetching content in Next.js. Encodes real mistakes already hit — apply proactively.
---

# Contentful Development

Apply these as you work with Contentful. Each rule is a real fix from this project.

## 1. Map code to content by a stable semantic key — NEVER `sys.id`
When code needs to key off a specific entry (icon maps, component registries, variant
switches), key on **`internalName`** (or slug / `contentType.sys.id`) — never the random
Contentful `sys.id`.
```ts
// ❌ SOCIAL[link.sys.id]          // random id → every lookup misses, silently falls back
// ✅ SOCIAL[link.fields.internalName]
```
*(Real bug: all four footer social icons rendered the same glyph because the map was keyed
by `sys.id`.)* The section registry is the sanctioned exception: it keys on `contentType.sys.id`, which IS stable.

## 2. Assets live in Contentful from the start
Do **not** commit site images as binaries in the repo, and do **not** point
`Media.externalUrl` at a local `/public` path as a "temporary" shortcut — you will just redo it.
Upload real assets: `createAssetFromFiles` → `processForAllLocales()` → `publish()`, then link
the asset on the `media` entry. Move content+assets between environments with
`contentful space export/import`, **not** git.

## 3. Migrations: dependency order + correct auth flag + whitelists
- Create content types **leaf/primitives first, `Page` last** (a reference can only target a
  type that already exists).
- The `contentful-migration` CLI auth flag is **`--access-token` (`-a`)**, NOT `--management-token`.
- **Whitelist every reference field** with `linkContentType`. Never "references all components".
- Keep migrations versioned in `contentful/migrations/` — they are the source of truth (ADR-0003).

## 4. Entries follow the same dependency order
Seed/author leaf entries before dependents. `publish()` fails if required fields are missing —
enforce `Meta` char ranges (title 40–75, description 110–160) and `Media.altText` in the model.

## 5. Optional-chain ALL CDA data
External data is never guaranteed. Cast the SDK response once at the boundary
(`getPageBySlug`) and optional-chain everywhere downstream. See [sonarqube-compliance] rule 1.

## 6. Prefer rich text fields directly
Use `RichText` fields (they embed links/assets/entries) instead of wrapper content types.
Fewer entries, shallower payloads.

## 7. One page + selector, NOT a page per variant
When content varies by a user choice (state, plan, region, language), model **one** page with a
selector section that references multiple **reusable** entries (one per option); the client
swaps which one renders. Reuse existing section types — e.g. each US state = one `accordion`
whose `heading` is the state name, composed by a `resourceLibrary` section. Don't clone types or
create a page per option.
*(Real mistake: seeded `/providers/resource-library/alabama` per state; correct model is a single
`/providers/resource-library` with a "Select state" dropdown, no content shown until a state is
picked.)*

## 8. Windows: run the migration binary directly (npm `$VAR` scripts fail)
`npm run cf:migrate` uses `$CONTENTFUL_SPACE_ID` shell syntax. On Windows npm runs scripts via
**cmd.exe**, which does NOT expand `$VAR`, so the space id/token arrive literally and auth fails
("space does not exist or you do not have access"). Run the binary directly from Git Bash with
the env sourced from `.env`:
```bash
set -a; . ./.env; set +a; \
node_modules/.bin/contentful-migration -s "$CONTENTFUL_SPACE_ID" \
  -e "$CONTENTFUL_ENVIRONMENT_ID" -a "$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN" -y <migration-file>
```
`.env` is not auto-loaded by node either — source it (`set -a; . ./.env; set +a`) before running
seed scripts too. Delete superseded pages/entries fully (unpublish → delete) when a model changes.

## 9. Constrain every new RichText / URL / Asset field — don't leave them open
Apply these validations when creating a field, not after a review flags them (see ADR-0005):
- **RichText:** restrict to `enabledMarks: [bold, italic, underline]` +
  `enabledNodeTypes: [ordered-list, unordered-list, hyperlink]` unless the field is genuinely a
  standalone long-form article (then confirm with product before allowing headings/embeds —
  embedded headings fight the code-derived heading hierarchy in rule below, and embeds reopen
  include-depth bloat).
- **URL/href Symbol fields:** add a `regexp` validation matching the field's real purpose — nav
  links (`^(https?://|/|mailto:|tel:|#).+`), canonical/external-doc URLs
  (`^https?://.+` absolute only), or media externalUrl (`^(https?://|/).+`).
- **Asset link fields:** add `linkMimetypeGroup` — `["image"]` for images, `["pdfdocument"]` for
  document uploads — so editors can't attach the wrong file type.

## 10. Heading text is inline; heading level is code-derived, never a CMS field
Every component's heading is a plain `Symbol` field on that component — never a linked `Heading`
entry (an anti-pattern flagged in ADR-0005 review finding #1). Do **not** add a `headingLevel`
dropdown either: an editor-chosen level can produce duplicate `<h1>`s or skipped levels, breaking
WCAG 2.2 AA. Instead thread a `level` prop through the `Heading` primitive
(`src/components/primitives/Heading.tsx`), computed by each section from its position in the page
(page title → h1, section heading → h2, nested item title → h3, …) so the outline is always valid.

## 11. Before building ANY page: consult the restructure reference, then map onto OUR consolidated types
`docs/03-content-model/reference/` (`restructure-source.md` + `analysis-notes.md`) is the
**mandatory field/requirement inventory** — the client's full ~65-content-type analysis of every
component across the ~200+ Figma pages. **Consult it every time**, for every page, so nothing is
missed and the whole team builds consistently. But it is an **inventory of what data each
component needs, not a literal 1:1 content-type spec** — our model deliberately consolidates it
to ~18 reusable types with variant enums (this is what ADR-0005 / the SA review's own finding #5
recommends, and what we already did: `card` not 10 near-duplicate card types).

**Process for every new page:**
1. Read the Figma design fully (all breakpoints) — [figma-mcp-workflow].
2. For each visual block, look up the matching row(s) in `restructure-source.md` to see what
   fields/references the client's analysis identified for that component shape.
3. Map it onto an **existing** consolidated type (`banner`, `mediaContentBlock`, `cardCollection`
   + `card`, `richTextBlock`, `accordion`, `resourceLibrary`, primitives) wherever the shape
   matches — even if the Excel names it differently (e.g. Excel's `ImageDescriptionCard` /
   `IconWithContentCard` / `ActionCard` / `BrushCard` / `LoginCard` / `BrokerPlanCard` are all our
   single `card` type with different field values/variants).
4. Only propose a **new** content type when the shape is genuinely not covered by an existing one
   — and follow the same consolidation discipline (variant enums, not a new type per look).
5. **Known issues in the source sheet** (don't propagate them): `Button` and `breadcrumbs` are
   referenced but never defined there — we already have both, correctly, in our model (`button`
   type; breadcrumbs are code-derived from the slug, no CT needed). Several references are
   case/spacing mismatches (`footer`↔`Footer`, `link`↔`Link`, etc.) — use **our** existing
   camelCase content-type IDs, never the sheet's inconsistent casing. Full list in
   `analysis-notes.md` — check it before assuming an Excel reference name is correct.
6. If a Figma component's data needs genuinely don't fit any existing or sensibly-new consolidated
   type, **stop and ask** rather than guessing — same rule as [figma-mcp-workflow] rule 0.

See also: [nextjs-development] (rendering/registry), the content-model spec in
`docs/03-content-model/`, and [figma-mcp-workflow] (design fidelity; assets originate from Figma).
