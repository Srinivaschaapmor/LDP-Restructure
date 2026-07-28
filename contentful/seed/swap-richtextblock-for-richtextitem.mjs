import contentfulManagement from "contentful-management";

const client = contentfulManagement.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || "master");

const RICHTEXTBLOCK_ENTRY_ID = "7iQQ1Zw1NUxqb52k5hoZ2u";
const RICHTEXTITEM_ENTRY_ID = "26UMNt4R9ISepTh6URDfFN";
const PAGE_ID = "3B3L4HHK0m91yHEVrwwX2a";

const page = await env.getEntry(PAGE_ID);
const locale = "en-US";
const sections = page.fields.sections[locale];

let replaced = false;
const nextSections = sections.map((link) => {
  if (link.sys.id === RICHTEXTBLOCK_ENTRY_ID) {
    replaced = true;
    return { sys: { type: "Link", linkType: "Entry", id: RICHTEXTITEM_ENTRY_ID } };
  }
  return link;
});

if (!replaced) {
  throw new Error(`Page ${PAGE_ID} sections did not contain richTextBlock entry ${RICHTEXTBLOCK_ENTRY_ID}`);
}

page.fields.sections[locale] = nextSections;
const updated = await page.update();
await updated.publish();
console.log(`✓ page ${PAGE_ID} sections now reference richTextItem ${RICHTEXTITEM_ENTRY_ID} directly`);
