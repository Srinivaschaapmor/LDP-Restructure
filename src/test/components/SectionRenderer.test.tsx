import { render, screen } from "@testing-library/react";
import { SectionRenderer } from "@/components/SectionRenderer";
import type { Section } from "@/types";
import * as log from "@/lib/logger/log";

const section = (id: string, fields: Section["fields"]): Section => ({
  sys: { id: `e-${id}`, contentType: { sys: { id } }, }, fields,
});

const richTextDoc = {
  nodeType: "document", data: {},
  content: [{ nodeType: "paragraph", data: {}, content: [{ nodeType: "text", value: "Hello world", marks: [], data: {} }] }],
};

describe("SectionRenderer", () => {
  it("renders a known section type from the registry", () => {
    render(<SectionRenderer sections={[section("richTextItem", { content: richTextDoc })]} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("skips an unknown section type and logs an error", () => {
    const spy = jest.spyOn(log.logger, "error").mockImplementation(() => {});
    const { container } = render(<SectionRenderer sections={[section("mysteryBlock", {})]} />);
    expect(container).toBeEmptyDOMElement();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it("renders nothing for an empty list", () => {
    const { container } = render(<SectionRenderer sections={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
