import { render } from "@testing-library/react";
import { Banner, hexToRgb, overlayGradient } from "@/components/sections/Banner";
import styles from "@/components/sections/Banner.module.css";
import type { Media, Section } from "@/types";

const media = (altText: string, url = "//cdn/x.jpg"): Media => ({
  sys: { id: "m", contentType: { sys: { id: "media" } } },
  fields: { altText, width: 100, height: 100, asset: { fields: { file: { url } } } },
}) as unknown as Media;

const fields = (over: Record<string, unknown>): Section["fields"] =>
  ({ backgroundImage: media("hero"), ...over }) as unknown as Section["fields"];

describe("hexToRgb", () => {
  it("parses a 6-digit hex", () => expect(hexToRgb("#3352A3")).toEqual([51, 82, 163]));
  it("parses a 3-digit hex, expanding each digit", () => expect(hexToRgb("#fff")).toEqual([255, 255, 255]));
  it("accepts hex without the leading #", () => expect(hexToRgb("3352A3")).toEqual([51, 82, 163]));
  it("returns null for invalid input", () => {
    expect(hexToRgb("not-a-color")).toBeNull();
    expect(hexToRgb(undefined)).toBeNull();
    expect(hexToRgb("")).toBeNull();
  });
});

describe("overlayGradient", () => {
  it("angles left at 90deg and right at 270deg using the given rgb", () => {
    expect(overlayGradient("left", [1, 2, 3])).toBe("linear-gradient(90deg, rgba(1,2,3,.6), rgba(1,2,3,0))");
    expect(overlayGradient("right", [1, 2, 3])).toBe("linear-gradient(270deg, rgba(1,2,3,.6), rgba(1,2,3,0))");
  });
});

describe("Banner", () => {
  it("renders nothing when there is no background image", () => {
    const { container } = render(<Banner fields={{} as Section["fields"]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the photo on mobile too when there is neither a logo nor a heading (no blank gap)", () => {
    const { container } = render(<Banner fields={fields({})} />);
    const bg = container.querySelector(`.${styles.bg}`);
    expect(bg?.className).not.toContain("d-none");
    expect(container.querySelector(`.${styles.mobile}`)).toBeNull();
  });

  it("swaps to a mobile heading band (and hides the desktop photo on mobile) when a heading is set", () => {
    const { container } = render(<Banner fields={fields({ heading: "5 toothbrush tips" })} />);
    expect(container.querySelector(`.${styles.bg}`)?.className).toContain("d-none d-md-block");
    expect(container.querySelector(`.${styles.heading}`)?.textContent).toBe("5 toothbrush tips");
    expect(container.querySelector(`.${styles.mobileHeading}`)?.textContent).toBe("5 toothbrush tips");
  });

  it("prefers the logo over the heading for mobile content when both are set", () => {
    const { container } = render(<Banner fields={fields({ heading: "Ignored on mobile", logo: media("Liberty logo") })} />);
    expect(container.querySelector(`.${styles.mobileLogo}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.mobileHeading}`)).toBeNull();
  });

  it("falls back to the default navy overlay when overlayColor is invalid", () => {
    const { container } = render(<Banner fields={fields({ overlay: "left", overlayColor: "not-a-hex" })} />);
    const overlay = container.querySelector(`.${styles.overlay}`);
    expect(overlay?.className).toContain(styles.overlayLeft);
    expect((overlay as HTMLElement)?.style.background).toBe("");
  });

  it("uses an inline gradient when overlayColor is a valid hex", () => {
    const { container } = render(<Banner fields={fields({ overlay: "left", overlayColor: "#3352A3" })} />);
    const overlay = container.querySelector(`.${styles.overlay}`) as HTMLElement;
    expect(overlay.style.background).toContain("rgba(51,82,163,.6)");
  });
});
