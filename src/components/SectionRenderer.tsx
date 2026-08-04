import { ctId, type Section } from "@/types";
import { registry } from "@/components/registry";
import { logger } from "@/lib/logger/log";

export function SectionRenderer({ sections }: { sections?: Section[] }) {
  return (
    <>
      {(sections ?? []).map((entry) => {
        const type = ctId(entry);
        const Component = registry[type];
        if (!Component) {
          logger.error(`[SectionRenderer] No renderer for section type: "${type}"`);
          return null;
        }
        return <Component key={entry?.sys?.id} fields={entry.fields} />;
      })}
    </>
  );
}
