// Seeds the real multi-level navigation (per Figma 35:566) as a standalone
// navigationMenu and wires it onto Page.navigation (NOT the header).
// Also removes the old menu-primary / menu-sub entries. Idempotent-ish: creates
// fresh "mm-" entries. Run: node contentful/seed/seed-navigation-v2.mjs
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

// Recursive builder. A node is ["link", name, label, href] or ["group", name, title, [children]].
async function build(node) {
  if (node[0] === "link") return link(await mkLink(node[1], node[2], node[3]));
  const childIds = [];
  for (const c of node[3]) childIds.push(await build(c));
  return link(await make("linkGroup", node[1], { title: node[2], links: childIds }));
}

const TREE = ["group", "mm-root", "Main", [
  ["group", "mm-member", "Member", [
    ["link", "mm-member-overview", "Overview", "/members/overview"],
    ["link", "mm-member-state", "State and partner sites", "/members/state-partner-sites"],
    ["link", "mm-member-shop", "Shop plans", "/shop-plans"],
    ["group", "mm-member-resources", "Resources", [
      ["link", "mm-mr-oral", "Oral health education", "/members/oral-health-education"],
      ["link", "mm-mr-forms", "Forms and plan documents", "/members/forms-plan-documents"],
      ["link", "mm-mr-lang", "Language needs survey", "/members/language-needs-survey"],
      ["link", "mm-mr-community", "Community smiles", "/members/community-smiles"],
      ["link", "mm-mr-tele", "Teledentistry", "/members/teledentistry"],
    ]],
    ["group", "mm-member-support", "Support", [
      ["link", "mm-ms-faq", "FAQ", "/members/faq"],
      ["link", "mm-ms-contact", "Contact us", "/contact"],
      ["link", "mm-ms-grievance", "File a grievance or appeal", "/members/grievance"],
    ]],
  ]],
  ["group", "mm-provider", "Provider", [
    ["link", "mm-provider-overview", "Overview", "/providers/overview"],
    ["link", "mm-provider-join", "Join our network", "/providers/join"],
    ["group", "mm-provider-resources", "Resources", [
      ["link", "mm-pr-clinical", "Clinical criteria guidelines", "/providers/clinical-criteria"],
      ["link", "mm-pr-cob", "Coordination of benefits", "/providers/coordination-of-benefits"],
      ["link", "mm-pr-news", "Provider newsletter", "/providers/newsletter"],
      ["link", "mm-pr-library", "Provider Resource library", "/providers/resource-library"],
      ["link", "mm-pr-vbp", "Value-based program", "/providers/value-based-program"],
    ]],
    ["group", "mm-provider-tools", "Tools", [
      ["link", "mm-pt-compliance", "Compliance training", "/providers/compliance-training"],
      ["link", "mm-pt-directory", "Directory information validation", "/providers/directory-validation"],
      ["link", "mm-pt-secure", "Secure documents", "/providers/secure-documents"],
      ["link", "mm-pt-email", "Secure email portal", "/providers/secure-email"],
    ]],
    ["link", "mm-provider-secure", "Secure documents", "/providers/secure-documents"],
    ["group", "mm-provider-support", "Support", [
      ["link", "mm-ps-faq", "FAQ", "/providers/faq"],
      ["link", "mm-ps-contact", "Contact us", "/contact"],
    ]],
  ]],
  ["group", "mm-broker", "Broker", [
    ["link", "mm-broker-overview", "Overview", "/brokers/overview"],
    ["link", "mm-broker-secure", "Secure documents", "/brokers/secure-documents"],
    ["link", "mm-broker-contact", "Contact Client Services", "/brokers/contact"],
  ]],
  ["group", "mm-about", "About us", [
    ["link", "mm-about-liberty", "About Liberty", "/about"],
    ["link", "mm-about-careers", "Careers", "/careers"],
    ["link", "mm-about-trust", "Trust center", "/trust"],
    ["group", "mm-about-compliance", "Compliance", [
      ["link", "mm-ac-program", "Liberty’s compliance program", "/about/compliance-program"],
      ["link", "mm-ac-fwa", "Fraud, waste and abuse (FWA)", "/about/fraud-waste-abuse"],
      ["link", "mm-ac-nondiscrimination", "Nondiscrimination", "/about/nondiscrimination"],
    ]],
    ["link", "mm-about-privacy", "Privacy", "/privacy"],
    ["link", "mm-about-news", "Company news", "/news"],
    ["link", "mm-about-contact", "Contact us", "/contact"],
  ]],
]];

console.log("Building navigation tree…");
const topGroups = [];
for (const child of TREE[3]) topGroups.push(await build(child));

const menuMain = await make("navigationMenu", "menu-main", { title: "Main navigation", items: topGroups });
console.log(`  ✓ navigationMenu menu-main = ${menuMain}`);

// Wire onto the Page (not the header).
const pageRes = await env.getEntries({ content_type: "page", "fields.internalName": "page-members-oral-health-everyday", limit: 1 });
const page = pageRes.items[0];
page.fields.navigation = L(link(menuMain));
await (await page.update()).publish();
console.log("  ✓ Page.navigation -> menu-main");

// Remove the old menus that were mixed into the header.
for (const name of ["menu-primary", "menu-sub"]) {
  const r = await env.getEntries({ content_type: "navigationMenu", "fields.internalName": name, limit: 1 });
  const e = r.items[0];
  if (e) { if (e.isPublished()) await e.unpublish(); await e.delete(); console.log(`  ✓ removed old ${name}`); }
}

console.log("🎉 Multi-level navigation seeded and wired onto Page.navigation.");
