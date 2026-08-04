import { render, screen, fireEvent } from "@testing-library/react";
import { Accordion } from "@/components/sections/Accordion";
import type { AccordionItem, DocumentEntry, Section } from "@/types";

const pdf = (id: string, label: string): DocumentEntry => ({
  sys: { id, contentType: { sys: { id: "document" } } },
  fields: { label, isExternal: false, kind: "pdf", file: { fields: { file: { url: `//cdn/${id}.pdf` } } } },
});
const item = (id: string, title: string, documents: DocumentEntry[]): AccordionItem => ({
  sys: { id, contentType: { sys: { id: "accordionItem" } } }, fields: { title, documents },
});

const fields = (allowMultipleOpen: boolean): Section["fields"] => ({
  heading: "Alabama", allowMultipleOpen,
  items: [
    item("forms", "Forms", [pdf("d1", "ADA claim form")]),
    item("faqs", "FAQs", [pdf("d2", "ECHO FAQ")]),
  ],
}) as unknown as Section["fields"];

const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
  it("renders the heading and group titles", () => {
    render(<Accordion fields={fields(true)} />);
    expect(screen.getByRole("heading", { name: "Alabama" })).toBeInTheDocument();
    expect(trigger("Forms")).toBeInTheDocument();
  });

  it("starts with every group closed", () => {
    const { container } = render(<Accordion fields={fields(true)} />);
    expect(trigger("Forms")).toHaveAttribute("aria-expanded", "false");
    expect(trigger("FAQs")).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector("#acc-panel-forms")).toHaveAttribute("hidden");
  });

  it("expands a group and reveals its documents when clicked", () => {
    render(<Accordion fields={fields(true)} />);
    fireEvent.click(trigger("Forms"));
    expect(trigger("Forms")).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: /ADA claim form/ })).toHaveAttribute("href", "https://cdn/d1.pdf");
  });

  it("keeps only one group open in single-open mode", () => {
    render(<Accordion fields={fields(false)} />);
    fireEvent.click(trigger("Forms"));
    fireEvent.click(trigger("FAQs"));
    expect(trigger("FAQs")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("Forms")).toHaveAttribute("aria-expanded", "false"); // sibling collapsed
  });

  it("allows multiple groups open at once in multi-open mode", () => {
    render(<Accordion fields={fields(true)} />);
    fireEvent.click(trigger("Forms"));
    fireEvent.click(trigger("FAQs"));
    expect(trigger("Forms")).toHaveAttribute("aria-expanded", "true");
    expect(trigger("FAQs")).toHaveAttribute("aria-expanded", "true");
  });

  it("renders nothing when there are no items", () => {
    const { container } = render(<Accordion fields={{ items: [] } as unknown as Section["fields"]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
