import { ctId, type Section } from "@/types";
import type { HeadingLevel } from "@/components/common/Heading";
import { registry } from "@/components/registry";
import { logger } from "@/lib/logger/log";

const SUBORDINATE_HEADING_LEVEL: HeadingLevel = 2;

export function SectionRenderer({
  sections, leadHeadingLevel = SUBORDINATE_HEADING_LEVEL,
}: { sections?: Section[]; leadHeadingLevel?: HeadingLevel }) {
  return (
    <>
      {(sections ?? []).map((entry, index) => {
        const type = ctId(entry);
        const Component = registry[type];
        if (!Component) {
          logger.error(`[SectionRenderer] No renderer for section type: "${type}"`);
          return null;
        }
        return (
          <Component
            key={entry?.sys?.id}
            fields={entry.fields}
            headingLevel={index === 0 ? leadHeadingLevel : SUBORDINATE_HEADING_LEVEL}
          />
        );
      })}
    </>
  );
}
