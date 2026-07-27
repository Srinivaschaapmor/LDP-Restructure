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

See also: [nextjs-development] (rendering/registry), the content-model spec in
`docs/03-content-model/`, and [figma-mcp-workflow] (design fidelity; assets originate from Figma).
