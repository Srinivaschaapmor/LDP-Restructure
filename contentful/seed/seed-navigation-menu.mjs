// Seeds the primary nav + sub-menu (with nested dropdown children) and wires them
// onto the existing global-header-member entry. Child links are representative
// (the Figma frames show chevrons but not the expanded children).
// Run: node contentful/seed/seed-navigation-menu.mjs
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
// A dropdown item: a linkGroup with a title + child links.
async function group(name, title, children) {
  const ids = [];
  for (const [n, label, href] of children) ids.push(await mkLink(n, label, href));
  return make("linkGroup", name, { title, links: ids.map(link) });
}

console.log("Seeding navigation menus…");

// --- Primary nav (Member / Provider / Broker / About us), each a dropdown ---
const member = await group("nm-member", "Member", [
  ["nml-member-find", "Find a dentist", "/find-a-dentist"],
  ["nml-member-login", "Member login", "/login"],
  ["nml-member-id", "ID card", "/members/id-card"],
  ["nml-member-claims", "Claims & benefits", "/members/claims"],
]);
const provider = await group("nm-provider", "Provider", [
  ["nml-provider-login", "Provider login", "/providers/login"],
  ["nml-provider-join", "Join our network", "/providers/join"],
  ["nml-provider-res", "Provider resources", "/providers/resources"],
]);
const broker = await group("nm-broker", "Broker", [
  ["nml-broker-login", "Broker login", "/brokers/login"],
  ["nml-broker-plans", "Plans & quotes", "/brokers/plans"],
  ["nml-broker-res", "Broker resources", "/brokers/resources"],
]);
const about = await group("nm-about", "About us", [
  ["nml-about-liberty", "About Liberty", "/about"],
  ["nml-about-careers", "Careers", "/careers"],
  ["nml-about-compliance", "Compliance", "/compliance"],
  ["nml-about-contact", "Contact us", "/contact"],
]);

// --- Sub-menu (State Sites / Shop plans / Resources / Support) ---
const stateSites = await group("nm-state-sites", "State Sites", [
  ["nml-state-ca", "California", "/state/ca"],
  ["nml-state-fl", "Florida", "/state/fl"],
  ["nml-state-nv", "Nevada", "/state/nv"],
  ["nml-state-ny", "New York", "/state/ny"],
]);
const shopPlans = await mkLink("nm-shop-plans", "Shop plans", "/shop-plans"); // plain link
const resources = await group("nm-resources", "Resources", [
  ["nml-res-oral", "Oral health education", "/members/oral-health-education"],
  ["nml-res-forms", "Forms & documents", "/members/forms-plan-documents"],
  ["nml-res-faqs", "FAQs", "/faqs"],
]);
const support = await group("nm-support", "Support", [
  ["nml-sup-contact", "Contact us", "/contact"],
  ["nml-sup-help", "Help center", "/help"],
  ["nml-sup-find", "Find a dentist", "/find-a-dentist"],
]);

// --- The two menus ---
const primaryMenu = await make("navigationMenu", "menu-primary", {
  title: "Primary", items: [member, provider, broker, about].map(link),
});
const subMenu = await make("navigationMenu", "menu-sub", {
  title: "Sub", items: [stateSites, shopPlans, resources, support].map(link),
});

// --- Utility links for the drawer bottom row ---
const utilLogin = await mkLink("util-login", "Log In", "/login");
const utilLang = await mkLink("util-language", "English", "/language");

// --- Wire onto the existing header ---
const res = await env.getEntries({ content_type: "header", "fields.internalName": "global-header-member", limit: 1 });
const header = res.items[0];
header.fields.primaryMenu = L(link(primaryMenu));
header.fields.subMenu = L(link(subMenu));
header.fields.utilityLinks = L([utilLogin, utilLang].map(link));
const updated = await header.update();
await updated.publish();

console.log("🎉 Navigation menus seeded and wired onto global-header-member.");
