import type { ComponentType } from "react";
import type { SectionProps } from "@/types";
import { SECTION_TYPE } from "@/constants";
import { Hero } from "@/components/sections/Hero";
import { Banner } from "@/components/sections/Banner";
import { MediaContentBlock } from "@/components/sections/MediaContentBlock";
import { CardCollection } from "@/components/sections/CardCollection";
import { RichTextItemSection } from "@/components/sections/RichTextItem";
import { Accordion } from "@/components/sections/Accordion";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";

export const registry: Record<string, ComponentType<SectionProps>> = {
  [SECTION_TYPE.hero]: Hero,
  [SECTION_TYPE.banner]: Banner,
  [SECTION_TYPE.mediaContentBlock]: MediaContentBlock,
  [SECTION_TYPE.cardCollection]: CardCollection,
  [SECTION_TYPE.richTextItem]: RichTextItemSection,
  [SECTION_TYPE.accordion]: Accordion,
  [SECTION_TYPE.resourceLibrary]: ResourceLibrary,
};
