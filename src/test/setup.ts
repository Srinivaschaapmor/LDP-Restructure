import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

// next/image renders a plain <img> in jsdom so component tests can assert on it.
vi.mock("next/image", () => ({
  default: (props: { src?: string; alt?: string; [k: string]: unknown }) => {
    const { src, alt } = props;
    return createElement("img", { src, alt: alt ?? "" });
  },
}));
