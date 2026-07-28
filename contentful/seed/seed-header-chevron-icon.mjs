// Uploads the shared chevron glyph (Figma "angle") as a Contentful asset and attaches
// it to the header, for the utility-bar dropdown triggers (migration 011). Idempotent.
// Run: node contentful/seed/seed-header-chevron-icon.mjs
import contentful from "contentful-management";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;
const L = (v) => ({ [LOCALE]: v });
const entryLink = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
const assetLink = (id) => ({ sys: { type: "Link", linkType: "Asset", id } });

const here = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(here, "..", "..", "docs", "04-design-system", "icons");

async function findId(ct, internalName) {
  const r = await env.getEntries({ content_type: ct, "fields.internalName": internalName, limit: 1 });
  return r.items[0]?.sys?.id;
}

let chevronId = await findId("media", "media-icon-chevron");
if (!chevronId) {
  let asset = await env.createAssetFromFiles({
    fields: { title: L("Chevron"), file: { [LOCALE]: { contentType: "image/svg+xml", fileName: "chevron.svg", file: readFileSync(join(iconsDir, "chevron.svg")) } } },
  });
  asset = await asset.processForAllLocales();
  asset = await asset.publish();
  const media = await env.createEntry("media", { fields: {
    internalName: L("media-icon-chevron"), asset: L(assetLink(asset.sys.id)), altText: L("Chevron"), width: L(16), height: L(16),
  } });
  await media.publish();
  chevronId = media.sys.id;
  console.log("  ✓ uploaded chevron icon");
} else {
  console.log("  = chevron icon already present");
}

const headerId = await findId("header", "global-header-member");
if (!headerId) { console.error("global-header-member not found."); process.exit(1); }
const header = await env.getEntry(headerId);
header.fields.chevronIcon = L(entryLink(chevronId));
await (await header.update()).publish();
console.log("  ✓ attached chevronIcon to global-header-member");
console.log("\n🎉 Done.");
