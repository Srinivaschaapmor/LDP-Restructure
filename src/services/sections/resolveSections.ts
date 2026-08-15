import { asFields, ctId, type CardCollectionFields, type Section } from "@/types";
import { COLLECTION_SOURCE, DEFAULTS, SECTION_TYPE } from "@/constants";
import { getLatestNews } from "@/contentful/queries/news.queries";

const needsLatestNews = (section?: Section): boolean =>
  ctId(section) === SECTION_TYPE.cardCollection
  && asFields<CardCollectionFields>(section?.fields ?? {}).source === COLLECTION_SOURCE.latestNews;

export async function resolveSections(sections?: Section[]): Promise<Section[]> {
  const list = sections ?? [];
  if (!list.some(needsLatestNews)) return list;

  return Promise.all(list.map(async (section) => {
    if (!needsLatestNews(section)) return section;
    const f = asFields<CardCollectionFields>(section.fields);
    const newsItems = await getLatestNews(f.limit ?? DEFAULTS.newsLimit);
    return { ...section, fields: { ...section.fields, newsItems } };
  }));
}
