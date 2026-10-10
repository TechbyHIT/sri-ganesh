/**
 * Settings for the service-and-location URL matrix.
 * The candidate target and the indexable target are separate on purpose.
 * Reaching the candidate target never publishes or indexes a page.
 */
export const URL_MATRIX = {
  /** Distinct service-and-location URL candidates the generator should be able to produce. */
  candidateTarget: 50000,
  /**
   * Indexable pages are decided by approvals in data/matrix-approvals.ts and the quality gate.
   * This is a ceiling for reporting only. It does not publish anything.
   */
  indexableTarget: 0,
  /** Location levels in the default run. Villages are opt-in because they multiply every service entry. */
  defaultLevels: ["district", "mandal", "city", "town", "locality"] as const,
  allLevels: ["district", "mandal", "city", "town", "locality", "village"] as const,
  batchSize: 5000,
  /** No trailing slash, matching the canonical policy of the existing 53 pages. */
  trailingSlash: false,
  outputDirectory: "reports/url-registry",
} as const;

export type MatrixLevel = (typeof URL_MATRIX.allLevels)[number];

export const MATRIX_STATUSES = [
  "candidate",
  "needs-coverage-confirmation",
  "needs-content",
  "editorial-review",
  "approved",
  "published",
  "noindex",
  "redirect",
  "excluded",
] as const;

export type MatrixStatus = (typeof MATRIX_STATUSES)[number];
