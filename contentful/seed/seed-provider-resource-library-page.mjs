// Seeds the Provider Resource Library as ONE page (/providers/resource-library):
// a resourceLibrary section (heading + state dropdown) whose accordion swaps by state.
// Reuses the existing "Alabama" accordion and adds dummy accordions for a few more
// states so the dropdown demonstrably switches content. Supersedes the per-state page.
// Run once: node contentful/seed/seed-provider-resource-library-page.mjs
import contentful from "contentful-management";
import { makeDummyPdf, slug } from "./_pdf.mjs";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;

const L = (v) => ({ [LOCALE]: v });
const entryLink = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
const assetLink = (id) => ({ sys: { type: "Link", linkType: "Asset", id } });
const SLUG = "/providers/resource-library";
const SELECT_PROMPT = "Select your state to access Liberty forms and documents";

async function findId(ct, internalName) {
  const r = await env.getEntries({ content_type: ct, "fields.internalName": internalName, limit: 1 });
  return r.items[0]?.sys?.id;
}
async function make(ctId, internalName, fields) {
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) f[k] = L(v);
  const e = await env.createEntry(ctId, { fields: f });
  await e.publish();
  return e.sys.id;
}
async function uploadPdf(label) {
  let a = await env.createAssetFromFiles({
    fields: {
      title: L(`${label} (placeholder)`),
      file: { [LOCALE]: { contentType: "application/pdf", fileName: `${slug(label)}.pdf`, file: makeDummyPdf(label) } },
    },
  });
  a = await a.processForAllLocales();
  a = await a.publish();
  return a.sys.id;
}

// Builds a dummy per-state accordion (2 groups x 2 placeholder PDFs). `code` keeps
// internalNames unique per state.
async function buildStateAccordion(name, code) {
  const groups = [
    { key: "forms", title: "Forms", docs: [`${name} enrollment form`, `${name} claim form`] },
    { key: "faqs", title: "FAQs", docs: [`${name} provider FAQ`, `${name} getting started FAQ`] },
  ];
  const itemIds = [];
  for (const g of groups) {
    const docIds = [];
    for (const label of g.docs) {
      const assetId = await uploadPdf(label);
      docIds.push(await make("document", `rl-${code}-doc-${slug(label)}`, { label, file: assetLink(assetId), isExternal: false, kind: "pdf" }));
    }
    itemIds.push(await make("accordionItem", `rl-${code}-item-${g.key}`, { title: g.title, documents: docIds.map(entryLink) }));
  }
  const id = await make("accordion", `rl-${code}-accordion`, { heading: name, items: itemIds.map(entryLink), allowMultipleOpen: true });
  console.log(`  ✓ state accordion: ${name} (${groups.length} groups)`);
  return id;
}

console.log(`Seeding PRL page into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID} (locale ${LOCALE})`);

// State 1 = the full Alabama accordion already seeded; states 2-4 = dummy content.
const alabamaId = await findId("accordion", "page-alabama-resource-library");
if (!alabamaId) { console.error("Alabama accordion not found — run seed-provider-resource-library.mjs first."); process.exit(1); }

const accordions = [alabamaId];
for (const [name, code] of [["Arkansas", "ar"], ["Arizona", "az"], ["California", "ca"]]) {
  accordions.push(await buildStateAccordion(name, code));
}

const rlId = await make("resourceLibrary", "prl-resource-library", {
  heading: "Provider resource library",
  selectPrompt: SELECT_PROMPT,
  accordions: accordions.map(entryLink),
});

const headerId = await findId("header", "global-header-member");
const footerId = await findId("footer", "global-footer");
const navId = await findId("navigationMenu", "nav-sections");
const metaId = await make("meta", "meta-provider-resource-library", {
  title: "Provider resource library | Liberty Dental Plan",
  description: "Access Liberty Dental Plan provider forms, guides, FAQs, and policy documents by state. Select your state to view its resource library.",
  canonicalUrl: `https://example.com${SLUG}`,
});

const pageFields = { slug: SLUG, title: "Provider resource library", meta: entryLink(metaId), sections: [entryLink(rlId)] };
if (headerId) pageFields.header = entryLink(headerId);
if (footerId) pageFields.footer = entryLink(footerId);
if (navId) pageFields.primaryNav = entryLink(navId);
const pageId = await make("page", "page-providers-resource-library", pageFields);
console.log(`  ✓ page: ${SLUG} (${pageId})`);

// Remove the earlier, incorrect per-state page (superseded by this single PRL page).
const old = await env.getEntries({ content_type: "page", "fields.internalName": "page-providers-resource-library-alabama", limit: 1 });
if (old.items[0]) { const e = old.items[0]; if (e.isPublished()) await e.unpublish(); await e.delete(); console.log("  ✓ removed old per-state page"); }

console.log(`\n🎉 Done. PRL page at ${SLUG} with ${accordions.length} states.`);
