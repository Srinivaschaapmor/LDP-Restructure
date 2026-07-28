// Fixes two issues found reviewing the live utility bar against reference screenshots:
// 1. The chevron's stored dimensions (16x16) didn't match its native SVG aspect ratio
//    (9.33x5.12), stretching it into a distorted shape ("looking odd").
// 2. The login menu's placeholder content ("Login" / Member,Provider,Broker login)
//    didn't match the real menu ("Log in" / Member, Group, Office or vendor).
// Run: node contentful/seed/fix-utility-bar-chevron-and-login.mjs
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;
const L = (v) => ({ [LOCALE]: v });
const entryLink = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });

async function find(ct, internalName) {
  const r = await env.getEntries({ content_type: ct, "fields.internalName": internalName, limit: 1 });
  return r.items[0];
}
async function updateFields(entry, fields) {
  for (const [k, v] of Object.entries(fields)) entry.fields[k] = L(v);
  await (await entry.update()).publish();
}

// 1. Correct the chevron's stored aspect ratio (native viewBox 9.33332 x 5.12).
const chevron = await find("media", "media-icon-chevron");
await updateFields(chevron, { width: 16, height: 9 });
console.log("  ✓ chevron dimensions corrected to 16x9 (was 16x16)");

// 2. Replace the placeholder login items with the real menu.
const oldLinkIds = (await find("linkGroup", "utilitybar-login-menu")).fields.links[LOCALE].map((l) => l.sys.id);
const newLabels = [
  ["link-login-member", "Member", "/login"],
  ["link-login-group", "Group", "/login/group"],
  ["link-login-office-vendor", "Office or vendor", "/login/office-vendor"],
];
const newLinkIds = [];
for (const [internalName, label, href] of newLabels) {
  const existing = await find("link", internalName);
  if (existing) { newLinkIds.push(existing.sys.id); continue; }
  const e = await env.createEntry("link", { fields: { internalName: L(internalName), label: L(label), href: L(href) } });
  await e.publish();
  newLinkIds.push(e.sys.id);
}
const loginMenu = await find("linkGroup", "utilitybar-login-menu");
await updateFields(loginMenu, { title: "Log in", links: newLinkIds.map(entryLink) });
console.log("  ✓ login menu updated: title 'Log in', items Member / Group / Office or vendor");

// Unpublish + delete the superseded placeholder links (no longer referenced anywhere).
for (const id of oldLinkIds) {
  try {
    const e = await env.getEntry(id);
    if (e.isPublished()) await e.unpublish();
    await e.delete();
  } catch { /* already gone */ }
}
console.log("  ✓ removed superseded placeholder login links");

console.log("\n🎉 Done.");
