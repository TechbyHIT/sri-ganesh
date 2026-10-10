export const contentModules = [
  { key: "service-introduction", pageTypes: ["service", "service-location", "service-area"] },
  { key: "local-introduction", pageTypes: ["service-location", "service-area", "location"] },
  { key: "installation", pageTypes: ["service", "service-location", "service-area"] },
  { key: "pricing-factors", pageTypes: ["service-location", "service-area", "core"] },
  { key: "faq", pageTypes: ["service", "service-location", "service-area", "core"] },
] as const;
