// Seeds primaryNav (plain header links) + subNav (dropdown/drill-down, shared by
// desktop sub-bar and mobile). Wires both onto the Page; removes old menu-main.
// Run: node contentful/seed/seed-nav-split.mjs
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;

const L = (v) => ({ [LOCALE]: v });
const link = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
async function make(ctId, internalName, fields) {
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) f[k] = L(v);
  const e = await env.createEntry(ctId, { fields: f });
  await e.publish();
  return e.sys.id;
}
const mkLink = (name, label, href) => make("link", name, { label, href });
async function build(node) {
  if (node[0] === "link") return link(await mkLink(node[1], node[2], node[3]));
  const ids = [];
  for (const c of node[3]) ids.push(await build(c));
  return link(await make("linkGroup", node[1], { title: node[2], links: ids }));
}

// --- Primary nav: plain links only (no dropdowns) ---
const primaryItems = [];
for (const [n, label, href] of [
  ["pn-members", "Members", "/members"],
  ["pn-providers", "Providers", "/providers"],
  ["pn-brokers", "Brokers", "/brokers"],
  ["pn-about", "About us", "/about"],
]) primaryItems.push(link(await mkLink(n, label, href)));
const primaryNav = await make("navigationMenu", "nav-primary", { title: "Primary", items: primaryItems });

// --- Sub nav: dropdowns/drill-down (shared desktop bar + mobile) ---
const SUB = [
  ["group", "sn-state", "State Sites", [
    ["link", "sn-state-ca", "California", "/state/ca"],
    ["link", "sn-state-fl", "Florida", "/state/fl"],
    ["link", "sn-state-nv", "Nevada", "/state/nv"],
    ["link", "sn-state-ny", "New York", "/state/ny"],
  ]],
  ["link", "sn-shop", "Shop plans", "/shop-plans"],
  ["group", "sn-resources", "Resources", [
    ["link", "sn-res-oral", "Oral health education", "/members/oral-health-education"],
    ["link", "sn-res-forms", "Forms and plan documents", "/members/forms-plan-documents"],
    ["link", "sn-res-lang", "Language needs survey", "/members/language-needs-survey"],
    ["link", "sn-res-community", "Community smiles", "/members/community-smiles"],
    ["link", "sn-res-tele", "Teledentistry", "/members/teledentistry"],
  ]],
  ["group", "sn-support", "Support", [
    ["link", "sn-sup-faq", "FAQ", "/faq"],
    ["link", "sn-sup-contact", "Contact us", "/contact"],
    ["link", "sn-sup-grievance", "File a grievance or appeal", "/grievance"],
  ]],
];
const subItems = [];
for (const node of SUB) subItems.push(await build(node));
const subNav = await make("navigationMenu", "nav-sub", { title: "Sub", items: subItems });

// --- Wire both onto the Page ---
const pageRes = await env.getEntries({ content_type: "page", "fields.internalName": "page-members-oral-health-everyday", limit: 1 });
const page = pageRes.items[0];
page.fields.primaryNav = L(link(primaryNav));
page.fields.subNav = L(link(subNav));
await (await page.update()).publish();
console.log("  ✓ Page.primaryNav -> nav-primary, Page.subNav -> nav-sub");

// --- Remove the old single menu ---
const old = await env.getEntries({ content_type: "navigationMenu", "fields.internalName": "menu-main", limit: 1 });
if (old.items[0]) { const e = old.items[0]; if (e.isPublished()) await e.unpublish(); await e.delete(); console.log("  ✓ removed old menu-main"); }

console.log("🎉 primaryNav + subNav seeded.");
