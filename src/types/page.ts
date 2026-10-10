export type PageIndexabilityInput = {
  publicationStatus: string;
  allowIndexing: boolean;
  qualityScore: number;
  contentReviewed: boolean;
  localDataVerified: boolean;
  hasUniqueMetadata: boolean;
  hasUniqueContent: boolean;
  hasValidCanonical: boolean;
  hasInternalLinks: boolean;
  hasValidSchema: boolean;
  wordCount: number;
  minimumRequiredWordCount: number;
  similarityScore: number;
};

export type PublicationStatus = "draft" | "review" | "published" | "noindex" | "archived";
