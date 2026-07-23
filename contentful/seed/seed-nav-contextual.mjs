// Seeds contextual navigation: each primary section (Members/Providers/Brokers/
// About us) is a navigable group (href) that owns its sub-menu (children).
// The active section's children render as the desktop sub-bar / mobile drill-down.
// Run: node contentful/seed/seed-nav-contextual.mjs
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
// node = ["link", name, label, href] | ["group", name, title, children, href?]
async function build(node) {
  if (node[0] === "link") return link(await mkLink(node[1], node[2], node[3]));
  const ids = [];
  for (const c of node[3]) ids.push(await build(c));
  const fields = { title: node[2], links: ids };
  if (node[4]) fields.href = node[4];
  return link(await make("linkGroup", node[1], fields));
}

const SECTIONS = [
  ["group", "sec-members", "Members", [
    ["group", "sm-state", "State Sites", [
      ["link", "sm-state-ca", "California", "/state/ca"],
      ["link", "sm-state-fl", "Florida", "/state/fl"],
      ["link", "sm-state-nv", "Nevada", "/state/nv"],
      ["link", "sm-state-ny", "New York", "/state/ny"],
    ]],
    ["link", "sm-shop", "Shop plans", "/shop-plans"],
    ["group", "sm-resources", "Resources", [
      ["link", "sm-res-oral", "Oral health education", "/members/oral-health-education"],
      ["link", "sm-res-forms", "Forms and plan documents", "/members/forms-plan-documents"],
      ["link", "sm-res-lang", "Language needs survey", "/members/language-needs-survey"],
      ["link", "sm-res-community", "Community smiles", "/members/community-smiles"],
      ["link", "sm-res-tele", "Teledentistry", "/members/teledentistry"],
    ]],
    ["group", "sm-support", "Support", [
      ["link", "sm-sup-faq", "FAQ", "/members/faq"],
      ["link", "sm-sup-contact", "Contact us", "/contact"],
      ["link", "sm-sup-grievance", "File a grievance or appeal", "/members/grievance"],
    ]],
  ], "/members"],
  ["group", "sec-providers", "Providers", [
    ["link", "sp-overview", "Overview", "/providers/overview"],
    ["link", "sp-join", "Join our network", "/providers/join"],
    ["group", "sp-resources", "Resources", [
      ["link", "sp-res-clinical", "Clinical criteria guidelines", "/providers/clinical-criteria"],
      ["link", "sp-res-cob", "Coordination of benefits", "/providers/coordination-of-benefits"],
      ["link", "sp-res-news", "Provider newsletter", "/providers/newsletter"],
      ["link", "sp-res-library", "Provider Resource library", "/providers/resource-library"],
      ["link", "sp-res-vbp", "Value-based program", "/providers/value-based-program"],
    ]],
    ["group", "sp-tools", "Tools", [
      ["link", "sp-tool-compliance", "Compliance training", "/providers/compliance-training"],
      ["link", "sp-tool-directory", "Directory information validation", "/providers/directory-validation"],
      ["link", "sp-tool-secure", "Secure documents", "/providers/secure-documents"],
      ["link", "sp-tool-email", "Secure email portal", "/providers/secure-email"],
    ]],
    ["link", "sp-secure", "Secure documents", "/providers/secure-documents"],
    ["group", "sp-support", "Support", [
      ["link", "sp-sup-faq", "FAQ", "/providers/faq"],
      ["link", "sp-sup-contact", "Contact us", "/contact"],
    ]],
  ], "/providers"],
  ["group", "sec-brokers", "Brokers", [
    ["link", "sb-overview", "Overview", "/brokers/overview"],
    ["link", "sb-secure", "Secure documents", "/brokers/secure-documents"],
    ["link", "sb-contact", "Contact Client Services", "/brokers/contact"],
  ], "/brokers"],
  ["group", "sec-about", "About us", [
    ["link", "sa-liberty", "About Liberty", "/about"],
    ["link", "sa-careers", "Careers", "/careers"],
    ["link", "sa-trust", "Trust center", "/trust"],
    ["group", "sa-compliance", "Compliance", [
      ["link", "sa-comp-program", "Liberty’s compliance program", "/about/compliance-program"],
      ["link", "sa-comp-fwa", "Fraud, waste and abuse (FWA)", "/about/fraud-waste-abuse"],
      ["link", "sa-comp-nondiscrimination", "Nondiscrimination", "/about/nondiscrimination"],
    ]],
    ["link", "sa-privacy", "Privacy", "/privacy"],
    ["link", "sa-news", "Company news", "/news"],
    ["link", "sa-contact", "Contact us", "/contact"],
  ], "/about"],
];

const items = [];
for (const node of SECTIONS) items.push(await build(node));
const primaryNav = await make("navigationMenu", "nav-sections", { title: "Sections", items });

const pageRes = await env.getEntries({ content_type: "page", "fields.internalName": "page-members-oral-health-everyday", limit: 1 });
const page = pageRes.items[0];
page.fields.primaryNav = L(link(primaryNav));
await (await page.update()).publish();
console.log("  ✓ Page.primaryNav -> nav-sections");

for (const name of ["nav-primary", "nav-sub"]) {
  const r = await env.getEntries({ content_type: "navigationMenu", "fields.internalName": name, limit: 1 });
  if (r.items[0]) { const e = r.items[0]; if (e.isPublished()) await e.unpublish(); await e.delete(); console.log(`  ✓ removed old ${name}`); }
}
console.log("🎉 Contextual section navigation seeded.");
