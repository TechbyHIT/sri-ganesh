import type { Metadata } from "next";

export function generateRobots(indexable: boolean): Metadata["robots"] {
  return {
    index: indexable,
    follow: true,
    googleBot: {
      index: indexable,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}
