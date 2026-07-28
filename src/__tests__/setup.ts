import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

// next/image renders a plain <img> in jsdom so component tests can assert on it.
// Forwards the props tests actually assert on (className/style/sizes/loading) and
// drops next/image-only props that aren't valid <img> attributes or would warn as
// unrecognized DOM props (fill, priority, fetchPriority).
vi.mock("next/image", () => ({
  default: ({ src, alt, className, style, sizes, loading }: Record<string, unknown>) =>
    createElement("img", { src, alt: alt ?? "", className, style, sizes, loading }),
}));
