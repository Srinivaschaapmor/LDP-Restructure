import { registry } from "@/components/registry";

// Contract (content-model spec §11): every section content-type id that can appear in
// Page.sections MUST have a renderer, or the page silently drops it. Keep in sync with
// the Page.sections whitelist in the migrations.
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
