import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResourceLibrary } from "@/components/sections/ResourceLibrary";
import type { AccordionItem, DocumentEntry, Section } from "@/types";

const pdf = (id: string, label: string): DocumentEntry => ({
  sys: { id, contentType: { sys: { id: "document" } } },
  fields: { label, isExternal: false, kind: "pdf", file: { fields: { file: { url: `//cdn/${id}.pdf` } } } },
});
const item = (id: string, title: string, docs: DocumentEntry[]): AccordionItem => ({
  sys: { id, contentType: { sys: { id: "accordionItem" } } }, fields: { title, documents: docs },
});
// A state = an accordion whose heading is the state name.
const stateAccordion = (id: string, name: string, docLabel: string): Section => ({
  sys: { id, contentType: { sys: { id: "accordion" } } },
  fields: { heading: name, allowMultipleOpen: true, items: [item(`${id}-g`, "Forms", [pdf(`${id}-d`, docLabel)]) ] },
}) as unknown as Section;

const fields = (): Section["fields"] => ({
  heading: "Provider resource library",
  selectPrompt: "Select your state to access Liberty forms and documents",
  accordions: [
    stateAccordion("al", "Alabama", "ADA claim form"),
    stateAccordion("ca", "California", "California enrollment form"),
  ],
}) as unknown as Section["fields"];

describe("ResourceLibrary", () => {
  it("renders the H1, the prompt, and a dropdown with a placeholder + all states", () => {
    render(<ResourceLibrary fields={fields()} />);
    expect(screen.getByRole("heading", { level: 1, name: "Provider resource library" })).toBeInTheDocument();
    const select = screen.getByLabelText(/Select your state/);
    const options = [...select.querySelectorAll("option")].map((o) => o.textContent);
    expect(options).toEqual(["Select state", "Alabama", "California"]);
  });

  it("shows no accordion until a state is chosen", () => {
    render(<ResourceLibrary fields={fields()} />);
    expect(screen.getByLabelText(/Select your state/)).toHaveValue("");
    expect(screen.queryByRole("heading", { name: "Alabama" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Forms" })).not.toBeInTheDocument();
  });

  it("shows the selected state's content after choosing a state", () => {
    render(<ResourceLibrary fields={fields()} />);
    fireEvent.change(screen.getByLabelText(/Select your state/), { target: { value: "1" } });
    expect(screen.getByRole("heading", { name: "California" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Alabama" })).not.toBeInTheDocument();
    // Groups start collapsed; opening one reveals that state's document.
    fireEvent.click(screen.getByRole("button", { name: "Forms" }));
    expect(screen.getByRole("link", { name: /California enrollment form/ })).toBeInTheDocument();
  });

  it("renders nothing when there are no states", () => {
    const { container } = render(<ResourceLibrary fields={{ accordions: [] } as unknown as Section["fields"]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
