"use client";
import { useState } from "react";
import { asFields, type AccordionFields, type AccordionItem, type Section } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { Heading, type HeadingLevel } from "@/components/ui/Heading";
import { DocumentLink } from "@/components/ui/DocumentLink";
import styles from "@/components/sections/Accordion.module.css";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

// One group: a heading-wrapped disclosure button controlling a labelled region
// (WCAG accordion pattern). Content and/or a document list render inside the region.
function AccordionGroup({
  item, level, isOpen, onToggle,
}: { item?: AccordionItem; level: HeadingLevel; isOpen: boolean; onToggle: () => void }) {
  const f = item?.fields;
  const id = item?.sys?.id ?? "";
  if (!f) return null;

  const panelId = `acc-panel-${id}`;
  const btnId = `acc-btn-${id}`;
  const docs = f.documents ?? [];

  return (
    <div className={styles.item}>
      <Heading level={level} className={styles.header}>
        <button
          type="button" id={btnId} className={styles.trigger}
          aria-expanded={isOpen} aria-controls={panelId} onClick={onToggle}
        >
          <span>{f.title}</span>
          <span className={cx(styles.icon, isOpen && styles.iconOpen)} aria-hidden="true" />
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={btnId} className={styles.panel} hidden={!isOpen}>
        {f.content?.fields?.content ? <div className={styles.content}><RichText doc={f.content.fields.content} /></div> : null}
        {docs.length ? (
          <ul className={styles.docs}>
            {docs.map((d) => <li key={d?.sys?.id}><DocumentLink doc={d} /></li>)}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

// `className` lets a container (e.g. ResourceLibrary, which nests this section
// and needs to zero out its own top/bottom padding) layer on a contextual override.
export function Accordion({ fields, className }: { fields: Section["fields"]; className?: string }) {
  const f = asFields<AccordionFields>(fields);
  const items = f.items ?? [];
  const allowMultiple = f.allowMultipleOpen ?? false;
  // All groups start collapsed (matches the design); hook runs before any early
  // return (sonarqube-compliance rule 2).
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  // Single-open mode collapses siblings; multi-open toggles each independently.
  const toggle = (id?: string) => {
    if (!id) return;
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  if (!items.length) return null;

  // Keep the outline valid: an accordion heading (h2) pushes group titles to h3;
  // without one the groups sit under the page h1, so they are h2.
  const titleLevel: HeadingLevel = f.heading ? 3 : 2;

  return (
    <section className={cx(styles.accordion, className)}>
      <div className="container-xxl">
        {f.heading ? <Heading level={2} className={styles.heading}>{f.heading}</Heading> : null}
        <div className={styles.list}>
          {items.map((item) => (
            <AccordionGroup
              key={item?.sys?.id} item={item} level={titleLevel}
              isOpen={open.has(item?.sys?.id ?? "")} onToggle={() => toggle(item?.sys?.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
