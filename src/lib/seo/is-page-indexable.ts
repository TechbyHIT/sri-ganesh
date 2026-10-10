import type { PageIndexabilityInput } from "@/types/page";

export function isPageIndexable(page: PageIndexabilityInput): boolean {
  return (
    page.publicationStatus === "published" &&
    page.allowIndexing &&
    page.qualityScore >= 80 &&
    page.contentReviewed &&
    page.localDataVerified &&
    page.hasUniqueMetadata &&
    page.hasUniqueContent &&
    page.hasValidCanonical &&
    page.hasInternalLinks &&
    page.hasValidSchema &&
    page.wordCount >= page.minimumRequiredWordCount &&
    page.similarityScore <= 0.7
  );
}

/** Gates other than publication status. Publishing sets status only after these pass. */
export function indexabilityGaps(page: PageIndexabilityInput): string[] {
  const gaps: string[] = [];

  if (!page.allowIndexing) gaps.push("allowIndexing");
  if (page.qualityScore < 80) gaps.push("qualityScore");
  if (!page.contentReviewed) gaps.push("contentReviewed");
  if (!page.localDataVerified) gaps.push("localDataVerified");
  if (!page.hasUniqueMetadata) gaps.push("hasUniqueMetadata");
  if (!page.hasUniqueContent) gaps.push("hasUniqueContent");
  if (!page.hasValidCanonical) gaps.push("hasValidCanonical");
  if (!page.hasInternalLinks) gaps.push("hasInternalLinks");
  if (!page.hasValidSchema) gaps.push("hasValidSchema");
  if (page.wordCount < page.minimumRequiredWordCount) gaps.push("wordCount");
  if (page.similarityScore > 0.7) gaps.push("similarityScore");

  return gaps;
}
