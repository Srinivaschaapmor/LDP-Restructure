import type { CSSProperties } from "react";
import type { HeadingLevel } from "@/components/common/Heading";
import type { Section } from "./content";

export interface Crumb { label: string; href?: string }

export type StyleWithVars = CSSProperties & Record<string, string>;

export interface SectionProps { fields: Section["fields"]; headingLevel?: HeadingLevel }
