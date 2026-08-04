import type { AccordionItem, Button, Card, Link, LinkGroup, Media, RichTextItem, Section } from "./content";

export interface BannerFields {
  heading?: string; subheading?: RichTextItem; backgroundImage?: Media; logo?: Media;
  cta?: Button; variant?: string; height?: string;
  overlay?: string; overlayColor?: string;
}

export interface MediaContentBlockFields {
  eyebrow?: string; heading?: string; body?: RichTextItem; bullets?: RichTextItem; media?: Media;
  mediaPlacement?: string; tone?: string;
}

export interface CardCollectionFields { heading?: string; intro?: RichTextItem; layout?: string; cards?: Card[] }

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
