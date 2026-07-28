import { describe, expect, it } from "vitest";
import { buildCrumbs } from "@/components/layout/Breadcrumbs";

describe("buildCrumbs", () => {
  it("derives Home + segment links + current page from the slug and title", () => {
    const crumbs = buildCrumbs("/providers/resource-library", "Provider resource library");
    expect(crumbs).toEqual([
      { label: "Home", href: "/" },
      { label: "Providers", href: "/providers" },
      { label: "Provider resource library", href: undefined },
    ]);
  });

  it("title-cases the last segment when no title is given", () => {
    const crumbs = buildCrumbs("/providers/resource-library");
    expect(crumbs[crumbs.length - 1]).toEqual({ label: "Resource library", href: undefined });
  });

  it("returns just Home for the root or a missing slug", () => {
    expect(buildCrumbs("/")).toEqual([{ label: "Home", href: "/" }]);
    expect(buildCrumbs(undefined)).toEqual([{ label: "Home", href: "/" }]);
  });
});
