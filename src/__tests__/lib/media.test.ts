import { resolveUrl, resolveDimensions } from "@/components/ui/MediaImg";
import { ctId } from "@/types";
import type { Media } from "@/types";

const media = (fields: Media["fields"]): Media => ({ sys: { id: "x", contentType: { sys: { id: "media" } } }, fields });

describe("resolveUrl", () => {
  it("prefixes protocol-relative Contentful asset urls", () => {
    expect(resolveUrl(media({ asset: { fields: { file: { url: "//images.ctfassets.net/a.png" } } } }))).toBe("https://images.ctfassets.net/a.png");
  });
  it("falls back to externalUrl when no asset", () => {
    expect(resolveUrl(media({ externalUrl: "/images/logo.png" }))).toBe("/images/logo.png");
  });
  it("returns undefined when there is no image", () => {
    expect(resolveUrl(media({}))).toBeUndefined();
    expect(resolveUrl(undefined)).toBeUndefined();
  });
});

describe("resolveDimensions", () => {
  it("reads dimensions from the asset details", () => {
    expect(resolveDimensions(media({ asset: { fields: { file: { url: "//x", details: { image: { width: 921, height: 196 } } } } } }))).toEqual({ width: 921, height: 196 });
  });
  it("prefers explicit field dimensions", () => {
    expect(resolveDimensions(media({ width: 100, height: 50 }))).toEqual({ width: 100, height: 50 });
  });
});

describe("ctId", () => {
  it("returns the content-type id or empty string", () => {
    expect(ctId(media({}))).toBe("media");
    expect(ctId(undefined)).toBe("");
  });
});
