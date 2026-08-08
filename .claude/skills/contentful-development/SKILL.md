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

## 6. Rich text lives in the reusable `richTextItem` type, referenced — never an inline field
**Superseded by ADR-0007** (this rule used to say "prefer inline `RichText` fields instead of
wrapper content types" — that was reversed on purpose, for reuse: the same block can now be
shared across multiple entries/pages, which an inline field structurally cannot do). Every
rich-text-bearing field is `Link → Entry` validated to `["richTextItem"]`, with the same
validation every such field has always had — `enabledMarks: [bold, italic, underline]`,
`enabledNodeTypes: [ordered-list, unordered-list, hyperlink]` (rule 9 still applies in full).
When adding a NEW rich-text field to any content type, reference `richTextItem` — do not add
another inline `RichText` field.
On the frontend, resolve one extra hop: `field.fields.content` (a `Document`), not `field`
directly — see `RichTextItem`/`RichTextItemFields` in `src/types/content.ts` and any of
`Banner`/`MediaContentBlock`/`Card`/`Accordion` for the pattern. The one exception: a page
section that is *just* rich text uses `richTextItem` directly as the section entry (no wrapper
type — see ADR-0008), so `RichTextItemSection` reads `field.content` with no extra hop.

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
component across the ~200+ Figma pages. **Consult it every time**, for every page. It is an
**inventory of what data each component needs, not a literal 1:1 content-type spec** — our model
deliberately consolidates it to ~18 reusable types with variant enums (ADR-0005 / the SA review's
finding #5: `card` not 10 near-duplicate card types). If a component's data needs genuinely don't
fit any existing or sensibly-new consolidated type, **stop and ask** rather than guessing.

**Run this via the `content-model-analyst` agent** (`.claude/agents/content-model-analyst.md`,
Phase 2 of [figma-to-development-workflow]) — it holds the full process (row-lookup, mapping,
the known source-sheet issues to not propagate) so it doesn't need restating here.

See also: [nextjs-development] (rendering/registry), the content-model spec in
`docs/03-content-model/`, and [figma-mcp-workflow] (design fidelity; assets originate from Figma).
