// Per-component field shapes: what each section/chrome component expects after
// `asFields<T>()` casts the CMS payload at its boundary (see content.ts). Grouped
// here (not inline per-component) so every field shape a page can contain is
// visible from one place (coding-standards: categorized, not scattered).
import type { Document } from "@contentful/rich-text-types";
import type { AccordionItem, Button, Card, Link, LinkGroup, Media, Section } from "./content";

export interface BannerFields {
  heading?: string; subheading?: Document; backgroundImage?: Media; logo?: Media;
  cta?: Button; variant?: string; height?: string;
  overlay?: string; overlayColor?: string;
}

export interface MediaContentBlockFields {
  eyebrow?: string; heading?: string; body?: Document; media?: Media;
  mediaPlacement?: string; tone?: string;
}

export interface CardCollectionFields { heading?: string; layout?: string; cards?: Card[] }

export interface RichTextBlockFields { content?: Document; width?: string }

export interface AccordionFields { heading?: string; items?: AccordionItem[]; allowMultipleOpen?: boolean }

export interface ResourceLibraryFields { heading?: string; selectPrompt?: string; accordions?: Section[] }

export interface HeaderFields {
  logo?: Media; cta?: Button; searchIcon?: Media;
  languageIcon?: Media; languageMenu?: LinkGroup;
  loginIcon?: Media; loginMenu?: LinkGroup;
  chevronIcon?: Media;
}

export interface FooterFields {
  logo?: Media; columns?: LinkGroup[]; socialLinks?: Link[]; legalLinks?: Link[];
  backToTopLabel?: string; legalText?: string;
}
