import type { ReactNode } from "react";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function Heading({
  level, className, children,
}: { level: HeadingLevel; className?: string; children: ReactNode }) {
  const Tag = `h${level}` as const;
  return <Tag className={className}>{children}</Tag>;
}
