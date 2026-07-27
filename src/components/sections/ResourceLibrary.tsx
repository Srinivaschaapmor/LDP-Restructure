"use client";
import { useId, useState } from "react";
import { asFields, type Section } from "@/lib/types";
import { Accordion } from "@/components/sections/Accordion";
import { RL_SELECT_LABEL, RL_SELECT_PLACEHOLDER } from "@/lib/constants";

interface ResourceLibraryFields { heading?: string; selectPrompt?: string; accordions?: Section[] }

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
    <section className="ld-rl">
      <div className="container">
        {f.heading ? <h1 className="ld-rl__title">{f.heading}</h1> : null}
        <div className="ld-rl__selector">
          <label htmlFor={selectId} className="ld-rl__prompt">{f.selectPrompt ?? RL_SELECT_LABEL}</label>
          <div className="ld-rl__selectwrap">
            <select
              id={selectId} className="ld-rl__select" value={value}
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
      {selected ? <Accordion key={selected?.sys?.id} fields={selected.fields} /> : null}
    </section>
  );
}
