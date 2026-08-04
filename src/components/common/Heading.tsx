import type { ReactNode } from "react";

// Renders the correct heading tag for its position in the document outline,
// so heading levels never skip (accessibility: logical heading hierarchy).
// Level is decided by the parent section, not hardcoded in leaf components.
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export function Heading({
  level, className, children,
}: { level: HeadingLevel; className?: string; children: ReactNode }) {
  const Tag = `h${level}` as const;
  return <Tag className={className}>{children}</Tag>;
}
