import type { Entry } from "contentful";
import { client } from "@/contentful/client";

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
