export const PUBLISHING = {
  qualityMinimum: 80,
  similarityMaximum: 0.7,
  maxBatchSize: 500,
  sitemapBatchSize: 10000,
  /** Target lengths. Pages below these stay in review instead of being padded. */
  wordTargets: {
    service: 1200,
    "service-location": 1000,
    "service-area": 900,
    guide: 1500,
    blog: 1200,
    location: 700,
  },
} as const;
