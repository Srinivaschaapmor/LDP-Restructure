import { registry } from "@/components/registry";

const EXPECTED_SECTION_TYPES = ["banner", "mediaContentBlock", "cardCollection", "richTextItem", "accordion", "resourceLibrary"];

describe("section registry contract", () => {
  it("has a component for every whitelisted section content-type id", () => {
    for (const id of EXPECTED_SECTION_TYPES) {
      expect(typeof registry[id]).toBe("function");
    }
  });

  it("registers only renderable components", () => {
    for (const Component of Object.values(registry)) {
      expect(typeof Component).toBe("function");
    }
  });
});
