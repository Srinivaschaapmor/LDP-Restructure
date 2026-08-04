import { render, screen } from "@testing-library/react";
import { DocumentLink, resolveDocHref } from "@/components/media/DocumentLink";
import type { DocumentEntry } from "@/types";

const pdf = (url?: string, label = "ADA claim form"): DocumentEntry => ({
  sys: { id: "d1", contentType: { sys: { id: "document" } } },
  fields: { label, isExternal: false, kind: "pdf", file: { fields: { file: { url, contentType: "application/pdf" } } } },
});
const external = (): DocumentEntry => ({
  sys: { id: "d2", contentType: { sys: { id: "document" } } },
  fields: { label: "Fluoride guidelines", isExternal: true, kind: "external", externalUrl: "https://example.com/x" },
});

describe("resolveDocHref", () => {
  it("prefixes protocol-relative asset URLs with https", () => {
    expect(resolveDocHref(pdf("//cdn.contentful.com/a.pdf"))).toBe("https://cdn.contentful.com/a.pdf");
  });
  it("falls back to externalUrl when there is no file", () => {
    expect(resolveDocHref(external())).toBe("https://example.com/x");
  });
  it("returns undefined when neither file nor externalUrl is present", () => {
    expect(resolveDocHref(undefined)).toBeUndefined();
    expect(resolveDocHref({ sys: { id: "x", contentType: { sys: { id: "document" } } }, fields: {} })).toBeUndefined();
  });
});

describe("DocumentLink", () => {
  it("renders a PDF row with a badge and same-tab link", () => {
    render(<DocumentLink doc={pdf("//cdn/a.pdf")} />);
    const link = screen.getByRole("link", { name: /ADA claim form/ });
    expect(link).toHaveAttribute("href", "https://cdn/a.pdf");
    expect(link).not.toHaveAttribute("target");
    expect(screen.getByText("PDF")).toBeInTheDocument();
  });

  it("renders an external row that opens in a new tab safely", () => {
    render(<DocumentLink doc={external()} />);
    const link = screen.getByRole("link", { name: /Fluoride guidelines/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText(/opens in a new tab/)).toBeInTheDocument();
  });

  it("renders nothing without a resolvable target", () => {
    const { container } = render(<DocumentLink doc={pdf(undefined)} />);
    expect(container).toBeEmptyDOMElement();
  });
});
