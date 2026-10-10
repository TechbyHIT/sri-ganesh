import { describe, expect, it } from "vitest";
import { serviceLocations } from "@/data/serviceLocations";
import { sliceCursorPage } from "@/lib/database/pagination";
import { requireBatchSize } from "@/lib/publishing/args";
import { PAGE_RECORD_TARGET, buildDraftRecords, countDraftsByType } from "@/lib/publishing/drafts";
import { similarityScore } from "@/lib/seo/similarity";
import { groupForPath } from "@/lib/sitemap/groups";
import { hasPlaceholder } from "@/lib/content/placeholders";

describe("publishing controls", () => {
  it("requires an explicit batch size at or below 500", () => {
    expect(requireBatchSize(["--batch-size=500"])).toBe(500);
    expect(() => requireBatchSize([])).toThrow(/batch-size/);
    expect(() => requireBatchSize(["--batch-size=501"])).toThrow(/500/);
  });

  it("creates records only for real catalogue rows", () => {
    const records = buildDraftRecords();
    const counts = countDraftsByType(records);
    const pairings = serviceLocations.filter((row) => row.active).length;

    expect(counts["service-location"] + counts["service-area"]).toBe(pairings);
    expect(records.some((record) => record.pageType === "coverage-review" || record.path.startsWith("/coverage/"))).toBe(false);
    expect(records.length).toBeLessThan(PAGE_RECORD_TARGET);
    expect(records.length).toBeGreaterThan(0);
    expect(new Set(records.map((record) => record.path)).size).toBe(records.length);
    expect(records.some((record) => hasPlaceholder(record.title))).toBe(false);
  });

  it("pages a cursor without keeping the extra row", () => {
    const rows = [{ id: "a" }, { id: "b" }, { id: "c" }];
    expect(sliceCursorPage(rows, 2)).toEqual({ items: [{ id: "a" }, { id: "b" }], nextCursor: "b" });
  });
});

describe("similarity and routes", () => {
  it("scores identical text as similar and different text as low", () => {
    const left = "stainless wire is measured for this balcony opening after the visit";
    expect(similarityScore(left, left)).toBeGreaterThan(0.9);
    expect(similarityScore(left, "a cloth hanger is a separate rod on the ceiling")).toBeLessThan(0.7);
  });

  it("groups canonical paths", () => {
    expect(groupForPath("/services/invisible-grills")).toBe("services");
    expect(groupForPath("/locations/visakhapatnam")).toBe("locations");
    expect(groupForPath("/locations/visakhapatnam/madhurawada")).toBe("areas");
    expect(groupForPath("/visakhapatnam/invisible-grills")).toBe("service-location");
    expect(groupForPath("/visakhapatnam/madhurawada/invisible-grills")).toBe("service-area");
    expect(groupForPath("/guides/invisible-grill-material-guide")).toBe("guides");
  });
});
