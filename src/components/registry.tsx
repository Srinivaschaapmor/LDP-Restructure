import type { ComponentType } from "react";
import type { Section } from "@/lib/types";
import { Banner } from "@/components/sections/Banner";
import { MediaContentBlock } from "@/components/sections/MediaContentBlock";
import { CardCollection } from "@/components/sections/CardCollection";
import { RichTextBlock } from "@/components/sections/RichTextBlock";
import { Accordion } from "@/components/sections/Accordion";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";

// The contract: one entry per section content-type ID. Adding a section type =
// adding one line here. Unknown types render nothing (handled in SectionRenderer).
export const registry: Record<string, ComponentType<{ fields: Section["fields"] }>> = {
  banner: Banner,
  mediaContentBlock: MediaContentBlock,
  cardCollection: CardCollection,
  richTextBlock: RichTextBlock,
  accordion: Accordion,
  resourceLibrary: ResourceLibrary,
};
