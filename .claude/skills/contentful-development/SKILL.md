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

See also: [nextjs-development] (rendering/registry), the content-model spec in
`docs/03-content-model/`, and [figma-mcp-workflow] (assets originate from Figma).
