// Seeds the "Provider resource library" accordion (from the Figma "for-devs" design)
// into Contentful, in dependency order: assets -> document -> accordionItem -> accordion.
// Generates a distinct DUMMY PDF per document so every slot is independently swappable
// later (replace the asset file, keep the entry). One item is an EXTERNAL link (no file).
// Run once: node contentful/seed/seed-provider-resource-library.mjs
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
if (!CONTENTFUL_MANAGEMENT_ACCESS_TOKEN) { console.error("Missing CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"); process.exit(1); }

const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const locales = await env.getLocales();
const LOCALE = (locales.items.find((l) => l.default) || { code: "en-US" }).code;

const L = (v) => ({ [LOCALE]: v });
const entryLink = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
const assetLink = (id) => ({ sys: { type: "Link", linkType: "Asset", id } });

// kebab-case slug for internalName / filenames (ascii-only, no punctuation).
const slug = (s) => s.toLowerCase().replace(/\([^)]*\)/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function make(ctId, internalName, fields) {
  const f = { internalName: L(internalName) };
  for (const [k, v] of Object.entries(fields)) if (v !== undefined) f[k] = L(v);
  const entry = await env.createEntry(ctId, { fields: f });
  await entry.publish();
  return entry.sys.id;
}

// Minimal single-page PDF (Helvetica) that prints `title` — valid xref, so Contentful
// accepts it as application/pdf. Placeholder only; swap the asset file for the real doc.
function makeDummyPdf(title) {
  const safe = String(title).replace(/[\\()]/g, (c) => "\\" + c);
  const objs = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>",
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];
  const stream = `BT /F1 20 Tf 72 700 Td (${safe}) Tj 0 -28 Td /F1 12 Tf (Placeholder document - replace this file.) Tj ET`;
  objs.push(`<</Length ${Buffer.byteLength(stream)}>>\nstream\n${stream}\nendstream`);

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objs.forEach((body, i) => { offsets.push(Buffer.byteLength(pdf)); pdf += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xrefStart = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => { pdf += String(o).padStart(10, "0") + " 00000 n \n"; });
  pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(pdf, "binary");
}

async function uploadPdf(label) {
  const fileName = `${slug(label)}.pdf`;
  let asset = await env.createAssetFromFiles({
    fields: {
      title: L(`${label} (placeholder)`),
      description: L("Dummy placeholder PDF — replace with the real document."),
      file: { [LOCALE]: { contentType: "application/pdf", fileName, file: makeDummyPdf(label) } },
    },
  });
  asset = await asset.processForAllLocales();
  asset = await asset.publish();
  return asset.sys.id;
}

// ---- Content mirrored from the Figma "Provider resource library" accordion ----
// A string = a PDF document (dummy file). An object with `external` = an external link.
const GROUPS = [
  { key: "forms", title: "Forms", docs: [
    "ADA claim form",
    "CMS appointment of representative form",
    "Informed consent for alternative treatment form (English)",
    "Informed consent for alternative treatment form (Spanish)",
    "Informed consent for alternative treatment form (Chinese)",
    "Member grievance form (English)",
    "Member grievance form (Spanish)",
    "Provider complaint and dispute form",
    "Provider compliance training and attestation form",
  ] },
  { key: "guides", title: "Guides and instructions", docs: [
    "ECHO enrollment instructions",
    "ECHO provider payments portal quick reference guide",
    "National Provider Reference Guide",
    "Provider online enrollment instructions",
    "Provider Portal user guide",
  ] },
  { key: "faqs", title: "FAQs", docs: [
    "ECHO FAQ",
    "Getting Started with Liberty FAQ",
    "Provider directory information verification (DIV) FAQ",
    "Provider online enrollment FAQ",
  ] },
  { key: "policies", title: "Policies and supporting documents", docs: [
    { label: "Clinical guidelines for prescribing fluoride supplements for caries prevention", external: "https://www.example.com/clinical-fluoride-guidelines" },
    "Medicare Advantage orientation overview",
    "National Clinical Criteria Guidelines and Practice Parameters",
    "Opioid risk tool",
    "Policy for reporting FWA, physical abuse, neglect, exploitation, unlicensed activity",
    "Secure use and transmission of electronic PHI policy",
  ] },
];

console.log(`Seeding into ${CONTENTFUL_SPACE_ID}/${CONTENTFUL_ENVIRONMENT_ID} (locale ${LOCALE})`);

const itemIds = [];
for (const group of GROUPS) {
  const docIds = [];
  for (const raw of group.docs) {
    const isExternal = typeof raw === "object";
    const label = isExternal ? raw.label : raw;
    const iname = `page-alabama-doc-${slug(label)}`;
    if (isExternal) {
      docIds.push(await make("document", iname, {
        label, externalUrl: raw.external, isExternal: true, kind: "external",
      }));
      console.log(`  ✓ document (external): ${label}`);
    } else {
      const assetId = await uploadPdf(label);
      docIds.push(await make("document", iname, {
        label, file: assetLink(assetId), isExternal: false, kind: "pdf",
      }));
      console.log(`  ✓ document (pdf):      ${label}`);
    }
  }
  itemIds.push(await make("accordionItem", `page-alabama-item-${group.key}`, {
    title: group.title, documents: docIds.map(entryLink),
  }));
  console.log(`  ✓ accordionItem: ${group.title} (${docIds.length} docs)`);
}

const accordionId = await make("accordion", "page-alabama-resource-library", {
  heading: "Alabama", items: itemIds.map(entryLink), allowMultipleOpen: true,
});

console.log(`\n🎉 Done. Accordion entry: ${accordionId}`);
console.log(`   ${itemIds.length} groups, ${GROUPS.reduce((n, g) => n + g.docs.length, 0)} documents.`);
