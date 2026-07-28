// Preserves the two currently-populated inline RichText fields (card.body ×5,
// richTextBlock.content ×1) as standalone richTextItem entries, BEFORE migration 016
// deletes those inline fields. Must run: migration 015 (creates richTextItem) → THIS
// SCRIPT → migration 016 (converts the inline fields to references) → the follow-up
// wiring script (points the new reference fields at the entries this script creates).
// The other 5 inline RichText fields (banner.subheading, mediaContentBlock.body/
// bullets, cardCollection.intro, accordionItem.content) have no data anywhere in this
// space (verified via the CMA before writing this script) — nothing to preserve for those.
import contentful from "contentful-management";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;
const L = (v) => ({ [LOCALE]: v });

async function makeRichTextItem(internalName, document) {
  const entry = await env.createEntry("richTextItem", {
    fields: { internalName: L(internalName), content: L(document) },
  });
  await entry.publish();
  return entry.sys.id;
}

// { contentType, field, entryId -> new richTextItem entry id } — consumed by the
// follow-up wiring script once migration 016 has created the new reference field.
const mapping = { card: {}, richTextBlock: {} };

const cards = await env.getEntries({ content_type: "card", limit: 100 });
for (const card of cards.items) {
  const doc = card.fields.body?.[LOCALE];
  if (!doc) continue;
  const label = card.fields.internalName?.[LOCALE] ?? card.sys.id;
  const id = await makeRichTextItem(`rti-${label}`, doc);
  mapping.card[card.sys.id] = id;
  console.log(`  ✓ card ${label} -> richTextItem ${id}`);
}

const blocks = await env.getEntries({ content_type: "richTextBlock", limit: 100 });
for (const block of blocks.items) {
  const doc = block.fields.content?.[LOCALE];
  if (!doc) continue;
  const label = block.fields.internalName?.[LOCALE] ?? block.sys.id;
  const id = await makeRichTextItem(`rti-${label}`, doc);
  mapping.richTextBlock[block.sys.id] = id;
  console.log(`  ✓ richTextBlock ${label} -> richTextItem ${id}`);
}

const fs = await import("node:fs/promises");
const path = new URL("./richtext-migration-mapping.json", import.meta.url);
await fs.writeFile(path, JSON.stringify(mapping, null, 2));
console.log(`\n🎉 Preserved ${Object.keys(mapping.card).length + Object.keys(mapping.richTextBlock).length} rich text values. Mapping saved to ${path.pathname}`);
