import contentfulManagement from "contentful-management";

const client = contentfulManagement.createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN });
const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID);
const env = await space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT_ID || "master");

const RICHTEXTBLOCK_ENTRY_ID = "7iQQ1Zw1NUxqb52k5hoZ2u";

const entry = await env.getEntry(RICHTEXTBLOCK_ENTRY_ID);
if (entry.isPublished()) await entry.unpublish();
await (await env.getEntry(RICHTEXTBLOCK_ENTRY_ID)).delete();
console.log(`✓ deleted richTextBlock entry ${RICHTEXTBLOCK_ENTRY_ID}`);
