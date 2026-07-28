// Final step of the RichText → richTextItem migration (ADR-0007). Points the new
// reference fields (created by migration 017) at the richTextItem entries preserved
// by migrate-richtext-to-entries.mjs, using its saved mapping. Run after 016 + 017.
import contentful from "contentful-management";
import { readFile } from "node:fs/promises";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT_ID = "master", CONTENTFUL_MANAGEMENT_ACCESS_TOKEN } = process.env;
const client = contentful.createClient({ accessToken: CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const env = await (await client.getSpace(CONTENTFUL_SPACE_ID)).getEnvironment(CONTENTFUL_ENVIRONMENT_ID);
const LOCALE = ((await env.getLocales()).items.find((l) => l.default) || { code: "en-US" }).code;
const link = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });

const mappingUrl = new URL("./richtext-migration-mapping.json", import.meta.url);
const mapping = JSON.parse(await readFile(mappingUrl, "utf-8"));

async function wire(entryId, richTextItemId, fieldName) {
  const entry = await env.getEntry(entryId);
  entry.fields[fieldName] = { [LOCALE]: link(richTextItemId) };
  await (await entry.update()).publish();
  console.log(`  ✓ ${entryId}.${fieldName} -> ${richTextItemId}`);
}

for (const [cardId, richTextItemId] of Object.entries(mapping.card)) {
  await wire(cardId, richTextItemId, "body");
}
for (const [blockId, richTextItemId] of Object.entries(mapping.richTextBlock)) {
  await wire(blockId, richTextItemId, "content");
}

console.log("🎉 All rich text references wired up.");
