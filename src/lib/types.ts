// Light, hand-rolled shapes for the CMS payload. The Contentful SDK's generics
// are intentionally not used here — we cast once at the boundary (getPageBySlug)
// and rely on optional chaining everywhere downstream (external data is never
// guaranteed; see sonarqube-compliance rule 1).
import type { Document } from "@contentful/rich-text-types";

export interface CFNode<T> {
  sys: { id: string; contentType: { sys: { id: string } } };
  fields: T;
}

// A CFNode whose content-type id is a literal at the type level, not just `string`.
// Needed wherever two node types form a union that must be narrowed (e.g. NavItem):
// with plain CFNode, Link/LinkGroup's all-optional fields structurally overlap and
// TypeScript can't tell them apart, forcing `as X` casts at every use site. Tagging
// the discriminant makes the union a real discriminated union, so a type-predicate
// guard (see isLinkGroup) narrows both branches correctly with no casts.
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

export interface LinkFields { internalName?: string; label?: string; href?: string; isExternal?: boolean; icon?: Media }
export type Link = TaggedNode<"link", LinkFields>;

// links is recursive: a group can contain links AND nested groups (multi-level menus).
// href makes a group navigable too (a section label that owns a sub-menu).
export interface LinkGroupFields { title?: string; href?: string; links?: NavItem[] }
export type LinkGroup = TaggedNode<"linkGroup", LinkGroupFields>;

// A nav item is either a plain Link or a LinkGroup (dropdown / drill-down panel).
// Link | LinkGroup is a true discriminated union (see TaggedNode) keyed on
// sys.contentType.sys.id, so this predicate narrows both branches with no casts.
export type NavItem = Link | LinkGroup;
export interface NavigationMenuFields { title?: string; items?: NavItem[] }
export type NavigationMenu = CFNode<NavigationMenuFields>;

export const isLinkGroup = (item?: NavItem): item is LinkGroup => item?.sys?.contentType?.sys?.id === "linkGroup";
// Pass this directly to Array.filter (not `!isLinkGroup`) — TS only infers a
// narrowed array type from a direct predicate reference, not a negated call.
export const isLink = (item?: NavItem): item is Link => item?.sys?.contentType?.sys?.id === "link";

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
  primaryNav?: NavigationMenu;
  sections?: Section[];
}
export type PageEntry = CFNode<PageFields>;

export const ctId = (e?: { sys?: { contentType?: { sys?: { id?: string } } } }): string =>
  e?.sys?.contentType?.sys?.id ?? "";

// Single, documented boundary cast. The Contentful CDA returns loosely-typed
// `fields`; each section knows its own shape, so we assert once here (with a
// justification) instead of scattering `as unknown as` across components.
export const asFields = <T,>(fields: Section["fields"]): T => fields as unknown as T;
