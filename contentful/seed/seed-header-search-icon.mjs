// Uploads the search icon (pulled fresh from the Figma mobile-drawer search field,
// node 30:889/30:890 — same glyph reused for the desktop search box) as a Media
// entry, and links it to global-header-member.searchIcon. Also drops the now
// field-less utilityLinks/navLinks reference cleanup happens via migration 013.
// Run: node contentful/seed/seed-header-search-icon.mjs
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;
const L = (v) => ({ [LOCALE]: v });
const link = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });

const ICON_URL = "https://www.figma.com/api/mcp/asset/3cfd22bc-db4a-4fa7-a08d-38e47dbdea36";
const res = await fetch(ICON_URL);
if (!res.ok) throw new Error(`Failed to fetch search icon asset: ${res.status}`);
const buf = Buffer.from(await res.arrayBuffer());

let asset = await env.createAssetFromFiles({
  fields: { title: L("Search icon"), file: { [LOCALE]: { contentType: "image/svg+xml", fileName: "search-icon.svg", file: buf } } },
});
asset = await (await asset.processForAllLocales()).publish();
console.log(`  ✓ uploaded search icon asset -> ${asset.sys.id}`);

const media = await env.createEntry("media", {
  fields: { internalName: L("media-icon-search"), asset: L({ sys: { type: "Link", linkType: "Asset", id: asset.sys.id } }), altText: L("Search") },
});
await media.publish();
console.log(`  ✓ media-icon-search entry -> ${media.sys.id}`);

const headerRes = await env.getEntries({ content_type: "header", "fields.internalName": "global-header-member", limit: 1 });
const header = headerRes.items[0];
header.fields.searchIcon = L(link(media.sys.id));
await (await header.update()).publish();
console.log("🎉 header.searchIcon wired up.");
