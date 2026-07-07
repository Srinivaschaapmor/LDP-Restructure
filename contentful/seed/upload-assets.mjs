// Uploads the page images as real Contentful assets and re-links the Media entries
// to them (dropping the local externalUrl). Source images read from public/images.
// Run: node contentful/seed/upload-assets.mjs
import contentful from "contentful-management";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CMA token"); process.exit(1); }

const here = dirname(fileURLToPath(import.meta.url));
const imgDir = join(here, "..", "..", "public", "images");

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const locales = await env.getLocales();
const LOCALE = (locales.items.find((l) => l.default) || { code: "en-US" }).code;

const sniff = (buf) =>
  buf[0] === 0xff && buf[1] === 0xd8 ? "image/jpeg"
  : buf[0] === 0x89 && buf[1] === 0x50 ? "image/png" : "application/octet-stream";

// image file -> the Media entry internalName it belongs to
const MAP = [
  { file: "hero.png", title: "Oral health hero", media: "media-hero" },
  { file: "brushing.png", title: "Person brushing teeth", media: "media-brushing" },
  { file: "logo.png", title: "Liberty Dental Plan logo", media: "media-logo" },
];

async function findEntry(internalName) {
  const res = await env.getEntries({ content_type: "media", "fields.internalName": internalName, limit: 1 });
  return res.items[0];
}

for (const { file, title, media } of MAP) {
  const buf = readFileSync(join(imgDir, file));
  const contentType = sniff(buf);

  let asset = await env.createAssetFromFiles({
    fields: { title: { [LOCALE]: title }, file: { [LOCALE]: { contentType, fileName: file, file: buf } } },
  });
  asset = await asset.processForAllLocales();
  asset = await asset.publish();
  console.log(`  ✓ uploaded asset ${file} -> ${asset.sys.id}`);

  const entry = await findEntry(media);
  if (!entry) { console.warn(`  ! media entry not found: ${media}`); continue; }
  entry.fields.asset = { [LOCALE]: { sys: { type: "Link", linkType: "Asset", id: asset.sys.id } } };
  delete entry.fields.externalUrl; // no longer stored in code
  const updated = await entry.update();
  await updated.publish();
  console.log(`  ✓ re-linked ${media} -> asset (externalUrl removed)`);
}

console.log("\n🎉 Assets moved to Contentful.");
