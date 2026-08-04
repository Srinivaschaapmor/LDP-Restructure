import "@testing-library/jest-dom";
import { createElement } from "react";

// next/image renders a plain <img> in jsdom so component tests can assert on it.
// Forwards the props tests actually assert on (className/style/sizes/loading) and
// drops next/image-only props that aren't valid <img> attributes or would warn as
// unrecognized DOM props (fill, priority, fetchPriority).
jest.mock("next/image", () => ({
  // Jest's CommonJS interop reads this flag to unwrap `.default` correctly for a
  // `import Image from "next/image"` consumer — without it, MediaImg receives the
  // whole mock module object instead of the function itself.
  __esModule: true,
  default: ({ src, alt, className, style, sizes, loading }: Record<string, unknown>) =>
    createElement("img", { src, alt: alt ?? "", className, style, sizes, loading }),
}));
