import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";
import styles from "@/components/sections/styles/Hero.module.css";
import type { Media, Section } from "@/types";

const media = (url?: string): Media => ({
  sys: { id: "m", contentType: { sys: { id: "media" } } },
  fields: { altText: "", width: 1600, height: 644, asset: url ? { fields: { file: { url } } } : undefined },
}) as unknown as Media;

const homeHero = (over: Record<string, unknown> = {}): Section["fields"] => ({
  heading: "Making members shine, one smile at a time",
  backgroundImage: media("//cdn/hero.jpg"),
  variant: "image", height: "lg", overlay: "flat", overlayColor: "#0F1042",
  cta: {
    sys: { id: "b", contentType: { sys: { id: "button" } } },
    fields: { label: "Get started", variant: "primary", link: { fields: { href: "#" } } },
  },
  ...over,
}) as unknown as Section["fields"];

describe("Hero", () => {
  it("renders the heading at the level the page assigns it, not one chosen by an author", () => {
    render(<Hero fields={homeHero()} headingLevel={1} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Making members shine");
  });

  it("paints a flat wash from overlayColor, taking the opacity from the CSS token", () => {
    const { container } = render(<Hero fields={homeHero()} />);
    const overlay = container.querySelector(`.${styles.overlay}`) as HTMLElement;
    expect(overlay.style.background).toBe("rgb(15 16 66 / var(--ld-hero-overlay-alpha))");
  });

  it("falls back to the token wash when overlayColor is not a valid hex", () => {
    const { container } = render(<Hero fields={homeHero({ overlayColor: "cornflower" })} />);
    const overlay = container.querySelector(`.${styles.overlay}`) as HTMLElement;
    expect(overlay.className).toContain(styles.overlayFlat);
    expect(overlay.style.background).toBe("");
  });

  it("renders no overlay when the design asks for none", () => {
    const { container } = render(<Hero fields={homeHero({ overlay: "none" })} />);
    expect(container.querySelector(`.${styles.overlay}`)).toBeNull();
  });

  it("still renders heading, copy and CTA when the media entry has no asset attached yet", () => {
    const { container } = render(<Hero fields={homeHero({ backgroundImage: media(undefined) })} />);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Get started" })).toBeInTheDocument();
  });
});
