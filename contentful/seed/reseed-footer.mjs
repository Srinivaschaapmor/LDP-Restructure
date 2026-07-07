// Re-seeds the footer to match the design: 3 titled link groups, social links,
// back-to-top, and a bottom legal bar. Updates the existing global-footer entry.
// Run: node contentful/seed/reseed-footer.mjs
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
const mkLink = (name, label, href, external = false) => make("link", name, { label, href, isExternal: external });
async function group(name, title, linkIds) { return make("linkGroup", name, { title, links: linkIds.map(link) }); }

// --- column links ---
const explore = await group("fg-explore", "Explore", await Promise.all([
  mkLink("fl-members", "Members", "/members"),
  mkLink("fl-providers", "Providers", "/providers"),
  mkLink("fl-brokers", "Brokers", "/brokers"),
]));
const helpful = await group("fg-helpful", "Helpful links", await Promise.all([
  mkLink("fl-find", "Find a dentist", "/find-a-dentist"),
  mkLink("fl-login", "Member login", "/login"),
  mkLink("fl-grievance", "File grievance or appeal", "/grievance"),
]));
const about = await group("fg-about", "About us", await Promise.all([
  mkLink("fl-about-liberty", "About Liberty", "/about"),
  mkLink("fl-careers", "Careers", "/careers"),
  mkLink("fl-compliance", "Compliance", "/compliance"),
  mkLink("fl-interop", "Interoperability API", "/interoperability"),
  mkLink("fl-trust", "Trust center", "/trust"),
  mkLink("fl-priorauth", "Prior auth reporting", "/prior-auth"),
  mkLink("fl-contact", "Contact us", "/contact"),
]));

// --- social + legal ---
const social = await Promise.all([
  mkLink("social-facebook", "Facebook", "https://facebook.com", true),
  mkLink("social-instagram", "Instagram", "https://instagram.com", true),
  mkLink("social-youtube", "YouTube", "https://youtube.com", true),
  mkLink("social-linkedin", "LinkedIn", "https://linkedin.com", true),
]);
const legal = await Promise.all([
  mkLink("legal-sitemap", "Sitemap", "/sitemap"),
  mkLink("legal-privacy", "Privacy notice", "/privacy"),
  mkLink("legal-nondiscrimination", "Nondiscrimination and language assistance", "/nondiscrimination"),
]);

// --- update the existing footer entry ---
const res = await env.getEntries({ content_type: "footer", "fields.internalName": "global-footer", limit: 1 });
const footer = res.items[0];
footer.fields.columns = L([explore, helpful, about].map(link));
footer.fields.socialLinks = L(social.map(link));
footer.fields.legalLinks = L(legal.map(link));
footer.fields.backToTopLabel = L("Back to top");
delete footer.fields.linkColumns; // superseded by grouped columns
const updated = await footer.update();
await updated.publish();
console.log("🎉 Footer re-seeded with grouped columns, social, back-to-top, legal bar.");
