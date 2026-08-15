import { client } from "@/contentful/client";
import { DEFAULTS, NEWS_ORDER } from "@/constants";
import type { NewsArticle } from "@/types";

export async function getLatestNews(limit: number = DEFAULTS.newsLimit): Promise<NewsArticle[]> {
  const res = await client.getEntries({
    content_type: "newsArticle",
    order: [NEWS_ORDER],
    limit,
    include: 2,
  });
  return res.items as unknown as NewsArticle[];
}
