// Light, hand-rolled shapes for the CMS payload. The Contentful SDK's generics
// are intentionally not used here — we cast once at the boundary (getPageBySlug)
// and rely on optional chaining everywhere downstream (external data is never
// guaranteed; see sonarqube-compliance rule 1).
import type { Document } from "@contentful/rich-text-types";

export interface CFNode<T> {
  sys: { id: string; contentType: { sys: { id: string } } };
  fields: T;
}

export interface MediaFields {
  internalName?: string;
  altText?: string;
  ariaLabel?: string;
  externalUrl?: string;
  width?: number;
  height?: number;
  asset?: { fields?: { file?: { url?: string }; title?: string } };
}
export type Media = CFNode<MediaFields>;

export interface LinkFields { internalName?: string; label?: string; href?: string; isExternal?: boolean; icon?: Media }
export type Link = CFNode<LinkFields>;

export interface LinkGroupFields { title?: string; links?: Link[] }
export type LinkGroup = CFNode<LinkGroupFields>;

export interface ButtonFields { label?: string; link?: Link; variant?: string }
export type Button = CFNode<ButtonFields>;

export interface CardFields {
  media?: Media; title?: string; subtitle?: string; body?: Document; links?: Link[]; cta?: Button; order?: number;
}
export type Card = CFNode<CardFields>;

export type Section = CFNode<Record<string, unknown>>;

export interface PageFields {
  title?: string;
  slug?: string;
  meta?: CFNode<{ title?: string; description?: string; canonicalUrl?: string; noindex?: boolean; ogImage?: Media }>;
  header?: Section;
  footer?: Section;
  sections?: Section[];
}
export type PageEntry = CFNode<PageFields>;

export const ctId = (e?: { sys?: { contentType?: { sys?: { id?: string } } } }): string =>
  e?.sys?.contentType?.sys?.id ?? "";
