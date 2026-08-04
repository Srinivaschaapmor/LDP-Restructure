"use client";
import { useId, useState } from "react";
import { asFields, type ResourceLibraryFields, type Section } from "@/types";
import { Accordion } from "@/components/sections/Accordion";
import { RL_SELECT_LABEL, RL_SELECT_PLACEHOLDER } from "@/lib/constants";
import styles from "@/components/sections/ResourceLibrary.module.css";

// The dropdown option for a state is that state's accordion heading (e.g. "Alabama").
function stateName(accordion?: Section): string {
  return asFields<{ heading?: string }>(accordion?.fields ?? {}).heading ?? "";
}

export function ResourceLibrary({ fields }: { fields: Section["fields"] }) {
  const f = asFields<ResourceLibraryFields>(fields);
  const states = (f.accordions ?? []).filter((a) => stateName(a));
  const selectId = useId();
  // "" = no state chosen yet — the page opens on the placeholder with no accordion.
  // Hook runs before any early return (sonarqube-compliance rule 2).
  const [value, setValue] = useState("");

  if (!states.length) return null;
  const selected = value === "" ? undefined : states[Number(value)];

  return (
    <section className={styles.rl}>
      <div className="container-xxl">
        {f.heading ? <h1 className={styles.title}>{f.heading}</h1> : null}
        <div className={styles.selector}>
          <label htmlFor={selectId} className={styles.prompt}>{f.selectPrompt ?? RL_SELECT_LABEL}</label>
          <div className={styles.selectwrap}>
            <select
              id={selectId} className={styles.select} value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="">{RL_SELECT_PLACEHOLDER}</option>
              {states.map((a, i) => <option key={a?.sys?.id} value={i}>{stateName(a)}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Nothing until a state is chosen; key re-mounts the accordion on each change
          so its open/closed state resets cleanly (and starts collapsed). */}
      {selected ? <Accordion key={selected?.sys?.id} fields={selected.fields} className={styles.nestedAccordion} /> : null}
    </section>
  );
}
