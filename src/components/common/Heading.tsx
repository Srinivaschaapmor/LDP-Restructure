import type { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export const nextHeadingLevel = (level: HeadingLevel): HeadingLevel =>
  (level < 6 ? level + 1 : 6) as HeadingLevel;

export function Heading({
  level, className, children,
}: { level: HeadingLevel; className?: string; children: ReactNode }) {
  const Tag = `h${level}` as const;
  return <Tag className={className}>{children}</Tag>;
}
