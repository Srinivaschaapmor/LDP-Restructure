// Adds the top utility bar (Language + Login dropdowns) to the existing global header,
// per the "5 toothbrush tips" article Figma frame (node 2:140/2:142). Icons are real
// Figma exports uploaded as Contentful assets (nextjs-development skill rule 7 — never
// hardcoded SVG in code). Language menu is a single placeholder ("English") since no
// multi-locale routing exists yet; login menu mirrors the persona links used elsewhere
// (Member/Provider/Broker). Idempotent: skips entries that already exist by internalName.
// Run: node contentful/seed/seed-header-utility-bar.mjs
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
async function make(ctId, internalName, fields) {
  const existing = await findId(ctId, internalName);
  if (existing) return existing;
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) f[k] = L(v);
  const e = await env.createEntry(ctId, { fields: f });
  await e.publish();
  return e.sys.id;
}
async function uploadSvgIcon(fileName, title) {
  let a = await env.createAssetFromFiles({
    fields: { title: L(title), file: { [LOCALE]: { contentType: "image/svg+xml", fileName, file: readFileSync(join(iconsDir, fileName)) } } },
  });
  a = await a.processForAllLocales();
  a = await a.publish();
  return a.sys.id;
}
async function makeIconMedia(internalName, fileName, altText) {
  const existing = await findId("media", internalName);
  if (existing) return existing;
  const assetId = await uploadSvgIcon(fileName, altText);
  return make("media", internalName, { asset: assetLink(assetId), altText, width: 20, height: 20 });
}

console.log(`Seeding header utility bar into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID}`);

const languageIconId = await makeIconMedia("media-icon-language", "world.svg", "Language");
const loginIconId = await makeIconMedia("media-icon-login", "user.svg", "Login");
console.log("  ✓ icons uploaded (or already present)");

// Placeholder — single option until multi-locale routing exists.
const langEnLink = await make("link", "link-lang-en", { label: "English", href: "/" });
const languageMenuId = await make("linkGroup", "utilitybar-language-menu", { title: "English", links: [entryLink(langEnLink)] });

const loginMemberLink = await make("link", "link-login-member", { label: "Member login", href: "/login" });
const loginProviderLink = await make("link", "link-login-provider", { label: "Provider login", href: "/providers/login" });
const loginBrokerLink = await make("link", "link-login-broker", { label: "Broker login", href: "/brokers/login" });
const loginMenuId = await make("linkGroup", "utilitybar-login-menu", {
  title: "Login", links: [loginMemberLink, loginProviderLink, loginBrokerLink].map(entryLink),
});
console.log("  ✓ language + login menus seeded");

const headerId = await findId("header", "global-header-member");
if (!headerId) { console.error("global-header-member not found — nothing to attach the utility bar to."); process.exit(1); }
const header = await env.getEntry(headerId);
header.fields.languageIcon = L(entryLink(languageIconId));
header.fields.languageMenu = L(entryLink(languageMenuId));
header.fields.loginIcon = L(entryLink(loginIconId));
header.fields.loginMenu = L(entryLink(loginMenuId));
await (await header.update()).publish();
console.log("  ✓ attached to global-header-member");

console.log("\n🎉 Utility bar seeded.");
