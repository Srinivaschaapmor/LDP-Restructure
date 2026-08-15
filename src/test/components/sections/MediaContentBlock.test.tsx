import { render, screen } from "@testing-library/react";
import { MediaContentBlock } from "@/components/sections/MediaContentBlock";
import styles from "@/components/sections/styles/MediaContentBlock.module.css";
import type { Section } from "@/types";

const media = (altText: string, url?: string, width = 24, height = 24) => ({
  sys: { id: `m-${altText}`, contentType: { sys: { id: "media" } } },
  fields: { altText, width, height, asset: url ? { fields: { file: { url } } } : undefined },
});

const bulletsDoc = {
  nodeType: "document", data: {},
  content: [{
    nodeType: "unordered-list", data: {},
    content: [{
      nodeType: "list-item", data: {},
      content: [{ nodeType: "paragraph", data: {}, content: [{ nodeType: "text", value: "Efficient claims processing", marks: [], data: {} }] }],
    }],
  }],
};

const richText = (doc: unknown) => ({ sys: { id: "rt", contentType: { sys: { id: "richTextItem" } } }, fields: { content: doc } });

const cta = (id: string, label: string, variant: string) => ({
  sys: { id, contentType: { sys: { id: "button" } } },
  fields: { label, variant, link: { fields: { href: "/join" } } },
});

const imageLink = (id: string, label: string, iconUrl?: string) => ({
  sys: { id, contentType: { sys: { id: "link" } } },
  fields: { label, href: "https://apps.example.com", isExternal: true, icon: media(label, iconUrl, 172, 57) },
});

const fields = (over: Record<string, unknown>): Section["fields"] => over as unknown as Section["fields"];

describe("MediaContentBlock — CTAs", () => {
  it("renders every button in ctas, which the block previously dropped", () => {
    render(<MediaContentBlock fields={fields({ heading: "Become a Liberty provider", ctas: [cta("b1", "Join our network", "primary")] })} />);
    expect(screen.getByRole("link", { name: "Join our network" })).toHaveAttribute("href", "/join");
  });

  it("uses the on-brand button treatment inside a brand band", () => {
    render(<MediaContentBlock fields={fields({ tone: "brand", ctas: [cta("b2", "Get a quote", "secondary")] })} />);
    expect(screen.getByRole("link", { name: "Get a quote" }).className).toContain("ld-btn--on-brand");
  });
});

describe("MediaContentBlock — bullet icon", () => {
  it("paints the authored icon as the list marker via a custom property", () => {
    const { container } = render(<MediaContentBlock fields={fields({
      bullets: richText(bulletsDoc), bulletIcon: media("", "//cdn/check.svg"),
    })} />);
    const bullets = container.querySelector(`.${styles.bullets}`) as HTMLElement;
    expect(bullets.className).toContain(styles.bulletsIconed);
    expect(bullets.getAttribute("style")).toContain("--ld-bullet-icon");
    expect(screen.getByText("Efficient claims processing")).toBeInTheDocument();
  });

  it("keeps the default marker when the icon entry has no asset attached yet", () => {
    const { container } = render(<MediaContentBlock fields={fields({
      bullets: richText(bulletsDoc), bulletIcon: media(""),
    })} />);
    const bullets = container.querySelector(`.${styles.bullets}`) as HTMLElement;
    expect(bullets.className).not.toContain(styles.bulletsIconed);
    expect(bullets.getAttribute("style")).toBeNull();
  });
});

describe("MediaContentBlock — image links", () => {
  it("renders app-store badges as images inside anchors, not as text buttons", () => {
    render(<MediaContentBlock fields={fields({ links: [imageLink("l1", "Download on the App Store", "//cdn/appstore.svg")] })} />);
    const link = screen.getByRole("link", { name: "Download on the App Store" });
    expect(link).toHaveAttribute("href", "https://apps.example.com");
    expect(link.querySelector("img")).toBeInTheDocument();
    expect(link.className).not.toContain("ld-btn");
  });

  it("falls back to the link label when the badge image is not available yet", () => {
    render(<MediaContentBlock fields={fields({ links: [imageLink("l2", "Get it on Google Play")] })} />);
    const link = screen.getByRole("link", { name: "Get it on Google Play" });
    expect(link.querySelector("img")).toBeNull();
    expect(link).toHaveTextContent("Get it on Google Play");
  });
});

describe("MediaContentBlock — layout", () => {
  it("lays content and media side by side when mediaPlacement is left or right", () => {
    const { container } = render(<MediaContentBlock fields={fields({
      heading: "Become a Liberty provider", mediaPlacement: "right", media: media("Dentist", "//cdn/p.jpg", 555, 568),
    })} />);
    expect(container.querySelector(`.${styles.split}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.mediaSide}`)).toBeInTheDocument();
  });

  it("renders the section heading below the page h1", () => {
    render(<MediaContentBlock fields={fields({ heading: "Become a Liberty broker" })} headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Become a Liberty broker");
  });
});
