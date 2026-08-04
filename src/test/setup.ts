import "@testing-library/jest-dom";
import { createElement } from "react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className, style, sizes, loading }: Record<string, unknown>) =>
    createElement("img", { src, alt: alt ?? "", className, style, sizes, loading }),
}));
