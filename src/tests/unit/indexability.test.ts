import { describe, expect, it } from "vitest";
import { indexabilityGaps, isPageIndexable } from "@/lib/seo/is-page-indexable";
import type { PageIndexabilityInput } from "@/types/page";

const ready: PageIndexabilityInput = {
  publicationStatus: "published",
  allowIndexing: true,
  qualityScore: 80,
  contentReviewed: true,
  localDataVerified: true,
  hasUniqueMetadata: true,
  hasUniqueContent: true,
  hasValidCanonical: true,
  hasInternalLinks: true,
  hasValidSchema: true,
  wordCount: 900,
  minimumRequiredWordCount: 900,
  similarityScore: 0.2,
};

describe("isPageIndexable", () => {
  it("accepts a page that passes every gate", () => {
    expect(isPageIndexable(ready)).toBe(true);
  });

  it("rejects a review page and a short page", () => {
    expect(isPageIndexable({ ...ready, publicationStatus: "review" })).toBe(false);
    expect(isPageIndexable({ ...ready, wordCount: 100 })).toBe(false);
    expect(isPageIndexable({ ...ready, similarityScore: 0.71 })).toBe(false);
    expect(indexabilityGaps({ ...ready, qualityScore: 79 })).toContain("qualityScore");
  });
});
