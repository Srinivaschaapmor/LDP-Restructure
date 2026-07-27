// Adds the PRL hero banner (Figma) above the breadcrumbs: uploads the banner image as
// a Contentful asset, creates a Media + Banner entry, and prepends the Banner to the
// Provider Resource Library page's sections. Idempotent (skips if already present).
// Run once: node contentful/seed/seed-prl-banner.mjs
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

const here = dirname(fileURLToPath(import.meta.url));
const bannerFile = join(here, "..", "..", "public", "images", "prl-banner.png");

async function findId(ct, internalName) {
  const r = await env.getEntries({ content_type: ct, "fields.internalName": internalName, limit: 1 });
  return r.items[0]?.sys?.id;
}
async function make(ctId, internalName, fields) {
  const existing = await findId(ctId, internalName);
  if (existing) return existing;
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) f[k] = L(v);
  const e = await env.createEntry(ctId, { fields: f });
  await e.publish();
  return e.sys.id;
}

// Upload the banner image (once) and return its asset id.
async function uploadBanner() {
  let asset = await env.createAssetFromFiles({
    fields: {
      title: L("Provider resource library banner"),
      file: { [LOCALE]: { contentType: "image/png", fileName: "prl-banner.png", file: readFileSync(bannerFile) } },
    },
  });
  asset = await asset.processForAllLocales();
  asset = await asset.publish();
  return asset.sys.id;
}

let mediaId = await findId("media", "media-prl-banner");
if (!mediaId) {
  const assetId = await uploadBanner();
  mediaId = await make("media", "media-prl-banner", {
    altText: "Liberty Dental Plan providers", asset: { sys: { type: "Link", linkType: "Asset", id: assetId } },
    width: 1600, height: 265,
  });
  console.log("  ✓ uploaded banner asset + media entry");
}

const bannerId = await make("banner", "banner-prl", {
  backgroundImage: entryLink(mediaId), variant: "image", height: "md",
});

// Prepend the banner to the PRL page's sections (skip if already first).
const pageRes = await env.getEntries({ content_type: "page", "fields.internalName": "page-providers-resource-library", limit: 1 });
const page = pageRes.items[0];
if (!page) { console.error("PRL page not found — run seed-provider-resource-library-page.mjs first."); process.exit(1); }
const sections = page.fields.sections?.[LOCALE] ?? [];
const alreadyThere = sections[0]?.sys?.id === bannerId;
if (!alreadyThere) {
  page.fields.sections = L([entryLink(bannerId), ...sections.filter((s) => s?.sys?.id !== bannerId)]);
  await (await page.update()).publish();
  console.log("  ✓ prepended banner to PRL page sections");
} else {
  console.log("  = banner already first section");
}

console.log("🎉 PRL banner done.");
