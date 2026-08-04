import type { Document } from "@contentful/rich-text-types";

export interface CFNode<T> {
  sys: { id: string; contentType: { sys: { id: string } } };
  fields: T;
}

export interface TaggedNode<CT extends string, F> {
  sys: { id: string; contentType: { sys: { id: CT } } };
  fields: F;
}

export interface MediaFields {
  internalName?: string;
  altText?: string;
  ariaLabel?: string;
  externalUrl?: string;
  width?: number;
  height?: number;
  asset?: { fields?: { title?: string; file?: { url?: string; details?: { image?: { width?: number; height?: number } } } } };
}
export type Media = CFNode<MediaFields>;

export interface RichTextItemFields { internalName?: string; content?: Document }
export type RichTextItem = CFNode<RichTextItemFields>;

export interface LinkFields { internalName?: string; label?: string; href?: string; isExternal?: boolean; icon?: Media }
export type Link = TaggedNode<"link", LinkFields>;

export interface LinkGroupFields { title?: string; href?: string; links?: NavItem[] }
export type LinkGroup = TaggedNode<"linkGroup", LinkGroupFields>;

export type NavItem = Link | LinkGroup;
export interface NavigationMenuFields { title?: string; items?: NavItem[] }
export type NavigationMenu = CFNode<NavigationMenuFields>;

export const isLinkGroup = (item?: NavItem): item is LinkGroup => item?.sys?.contentType?.sys?.id === "linkGroup";
export const isLink = (item?: NavItem): item is Link => item?.sys?.contentType?.sys?.id === "link";

export interface ButtonFields { label?: string; link?: Link; variant?: string }
export type Button = CFNode<ButtonFields>;

export interface CardFields {
  media?: Media; title?: string; subtitle?: string; body?: RichTextItem; links?: Link[]; cta?: Button; order?: number;
}
export type Card = CFNode<CardFields>;

export interface DocumentEntryFields {
  internalName?: string;
  label?: string;
  file?: { fields?: { title?: string; file?: { url?: string; contentType?: string; details?: { size?: number } } } };
  externalUrl?: string;
  isExternal?: boolean;
  kind?: string;
}
export type DocumentEntry = CFNode<DocumentEntryFields>;

export interface AccordionItemFields { internalName?: string; title?: string; content?: RichTextItem; documents?: DocumentEntry[] }
export type AccordionItem = CFNode<AccordionItemFields>;

export type Section = CFNode<Record<string, unknown>>;

export interface PageFields {
  title?: string;
  slug?: string;
  meta?: CFNode<{ title?: string; description?: string; canonicalUrl?: string; noindex?: boolean; ogImage?: Media }>;
  header?: Section;
  footer?: Section;
  primaryNav?: NavigationMenu;
  sections?: Section[];
}
export type PageEntry = CFNode<PageFields>;

export const ctId = (e?: { sys?: { contentType?: { sys?: { id?: string } } } }): string =>
  e?.sys?.contentType?.sys?.id ?? "";

export const asFields = <T,>(fields: Section["fields"]): T => fields as unknown as T;
