import { createClient, type Entry } from "contentful";

// Single CDA client. Reads published content. Env vars come from .env(.local).
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  environment: process.env.CONTENTFUL_ENVIRONMENT_ID || "master",
  accessToken: process.env.CONTENTFUL_DELIVERY_ACCESS_TOKEN!,
});

// include: 10 resolves the Page -> sections -> cards -> media reference tree in one call.
export async function getPageBySlug(slug: string) {
  const res = await client.getEntries({
    content_type: "page",
    "fields.slug": slug,
    include: 10,
    limit: 1,
  });
  return res.items[0] as Entry | undefined;
}

export async function getAllPageSlugs(): Promise<string[]> {
  const res = await client.getEntries({ content_type: "page", select: ["fields.slug"], limit: 1000 });
  return res.items.map((i) => (i.fields as { slug: string }).slug).filter(Boolean);
}
