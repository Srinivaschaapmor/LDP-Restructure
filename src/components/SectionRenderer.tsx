import { ctId, type Section } from "@/types";
import { registry } from "@/components/registry";
import { logger } from "@/lib/log";

// Maps each section entry to its component by content-type ID, in array order.
// Unknown types fail gracefully (render nothing + log) instead of crashing the page.
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
