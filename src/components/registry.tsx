import type { ComponentType } from "react";
import type { Section } from "@/types";
import { Banner } from "@/components/sections/Banner";
import { MediaContentBlock } from "@/components/sections/MediaContentBlock";
import { CardCollection } from "@/components/sections/CardCollection";
import { RichTextItemSection } from "@/components/sections/RichTextItem";
import { Accordion } from "@/components/sections/Accordion";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";

export const registry: Record<string, ComponentType<{ fields: Section["fields"] }>> = {
  banner: Banner,
  mediaContentBlock: MediaContentBlock,
  cardCollection: CardCollection,
  richTextItem: RichTextItemSection,
  accordion: Accordion,
  resourceLibrary: ResourceLibrary,
};
