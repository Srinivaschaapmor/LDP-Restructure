// Uploads the Home page's exported Figma images to Contentful and links each one to its
// existing `media` entry. Idempotent: an asset is matched by fileName, so re-running replaces
// nothing and simply re-links.
//
// The images are produced by exporting each Figma node — see the manifest.json written
// alongside them, which maps file -> media internalName -> source Figma node id.
//
// Usage: node contentful/seed/upload-home-assets.mjs <dir-containing-manifest.json>
import contentful from "contentful-management";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

const dir = process.argv[2];
if (!dir) { console.error("usage: node contentful/seed/upload-home-assets.mjs <dir>"); process.exit(1); }

const manifest = JSON.parse(await readFile(resolve(dir, "manifest.json"), "utf8"));

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const space = await client.getSpace(CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const locales = await env.getLocales();
const LOCALE = (locales.items.find((l) => l.default) || { code: "en-US" }).code;
const L = (v) => ({ [LOCALE]: v });

console.log(`Uploading ${manifest.length} assets into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID}\n`);

let linked = 0;
const problems = [];

for (const item of manifest) {
  const { file, internalName, nodeId } = item;

  const entries = await env.getEntries({ content_type: "media", "fields.internalName": internalName, limit: 1 });
  if (!entries.items.length) { problems.push(`${internalName}: no media entry found`); continue; }
  const mediaEntry = entries.items[0];

  // Reuse an asset already uploaded for this media entry rather than stacking duplicates.
  const existing = await env.getAssets({ "fields.title": internalName, limit: 1 });
  let asset = existing.items[0];

  if (!asset) {
    const data = await readFile(resolve(dir, file));
    asset = await env.createAssetFromFiles({
      fields: {
        title: L(internalName),
        // The asset description is editorial metadata; the accessible name that actually
        // reaches the DOM is media.altText on the entry, which is already authored.
        description: L(`Home page asset, exported from Figma node ${nodeId}`),
        file: L({ contentType: "image/png", fileName: file, file: data }),
      },
    });
    asset = await asset.processForAllLocales();
  }

  if (!asset.isPublished()) asset = await asset.publish();

  mediaEntry.fields.asset = L({ sys: { type: "Link", linkType: "Asset", id: asset.sys.id } });
  const updated = await mediaEntry.update();
  await updated.publish();

  linked += 1;
  console.log(`  ✓ ${internalName.padEnd(38)} <- ${file}`);
}

console.log(`\n${"=".repeat(60)}`);
console.log(`Linked ${linked}/${manifest.length} media entries to published assets.`);
if (problems.length) {
  console.log("\nProblems:");
  for (const p of problems) console.log(`  - ${p}`);
}
