import { render, screen } from "@testing-library/react";
import { CardCollection } from "@/components/sections/CardCollection";
import styles from "@/components/sections/styles/CardCollection.module.css";
import type { Section } from "@/types";

const media = (altText: string, url?: string) => ({
  sys: { id: `m-${altText}`, contentType: { sys: { id: "media" } } },
  fields: { altText, width: 42, height: 42, asset: url ? { fields: { file: { url } } } : undefined },
});

const card = (id: string, over: Record<string, unknown>) => ({
  sys: { id, contentType: { sys: { id: "card" } } }, fields: over,
});

const button = {
  sys: { id: "btn", contentType: { sys: { id: "button" } } },
  fields: { label: "Shop plans", variant: "primary", link: { fields: { href: "/shop-plans" } } },
};

const article = (id: string, title: string, publishDate: string, slug: string) => ({
  sys: { id, contentType: { sys: { id: "newsArticle" } } },
  fields: { title, publishDate, slug },
});

const fields = (over: Record<string, unknown>): Section["fields"] => over as unknown as Section["fields"];

describe("CardCollection — chips layout", () => {
  const chips = fields({
    heading: "Individual and family dental plans",
    layout: "chips",
    cards: [
      card("c2", { title: "No waiting period", media: media("", "//cdn/b.svg"), order: 2 }),
      card("c1", { title: "No deductibles", media: media("", "//cdn/a.svg"), order: 1 }),
    ],
    cta: button,
  });

  it("renders a list of icon+label chips with no heading-level chrome per chip", () => {
    const { container } = render(<CardCollection fields={chips} />);
    const items = container.querySelectorAll(`.${styles.chip}`);
    expect(items).toHaveLength(2);
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("orders chips by the card order field, not authoring order", () => {
    const { container } = render(<CardCollection fields={chips} />);
    const labels = [...container.querySelectorAll(`.${styles.chipLabel}`)].map((n) => n.textContent);
    expect(labels).toEqual(["No deductibles", "No waiting period"]);
  });

  it("renders the section CTA after the cards", () => {
    render(<CardCollection fields={chips} />);
    expect(screen.getByRole("link", { name: "Shop plans" })).toBeInTheDocument();
  });
});

describe("CardCollection — logos layout", () => {
  it("renders logo images with their alt text and no card chrome", () => {
    const { container } = render(<CardCollection fields={fields({
      heading: "Accredited by", layout: "logos",
      cards: [card("l1", { media: media("URAC accredited", "//cdn/urac.png"), order: 1 })],
    })} />);
    expect(screen.getByAltText("URAC accredited")).toBeInTheDocument();
    expect(container.querySelector(`.${styles.card}`)).toBeNull();
  });

  it("falls back to the logo's alt text when the media entry has no asset attached yet", () => {
    render(<CardCollection fields={fields({
      layout: "logos", cards: [card("l1", { media: media("HITRUST certified"), order: 1 })],
    })} />);
    expect(screen.getByText("HITRUST certified")).toBeInTheDocument();
  });
});

describe("CardCollection — latest news", () => {
  const news = fields({
    heading: "Liberty news", layout: "carousel", source: "latestNews", limit: 3,
    newsItems: [article("n1", "Storm response line opens", "2025-09-02", "/news/storm-response")],
  });

  it("renders each article as a date / title / read-more teaser", () => {
    render(<CardCollection fields={news} headingLevel={2} />);
    expect(screen.getByText("09/02/2025")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: /Storm response line opens/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Read more about Storm response line opens/ }))
      .toHaveAttribute("href", "/news/storm-response");
  });

  it("renders the section heading and intro even when no articles come back", () => {
    render(<CardCollection fields={fields({ heading: "Liberty news", source: "latestNews" })} />);
    expect(screen.getByRole("heading", { name: "Liberty news" })).toBeInTheDocument();
  });
});

describe("CardCollection — tone", () => {
  it("puts a brand band behind the section and flips its CTA to the on-brand treatment", () => {
    const { container } = render(<CardCollection fields={fields({
      heading: "Teledentistry", layout: "grid-3", tone: "brand",
      cta: { sys: { id: "b", contentType: { sys: { id: "button" } } }, fields: { label: "Schedule now", variant: "secondary", link: { fields: { href: "#" } } } },
    })} />);
    expect(container.querySelector("section")?.className).toContain(styles.toneBrand);
    expect(screen.getByRole("link", { name: "Schedule now" }).className).toContain("ld-btn--on-brand");
  });
});
