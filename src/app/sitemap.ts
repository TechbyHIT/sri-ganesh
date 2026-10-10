import type { MetadataRoute } from "next";
import { getSitemapSegments, SITEMAP_SEGMENT_SIZE } from "@/lib/sitemap-data";

/**
 * Serves /sitemap.xml as one urlset.
 * getSitemapSegments() already splits at SITEMAP_SEGMENT_SIZE.
 * This Next.js version publishes generateSitemaps() at /sitemap/[id].xml
 * and does not serve /sitemap.xml, so segmentation stays in the collector
 * until a second segment is actually required.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const segments = getSitemapSegments();

  if (segments.length > 1) {
    throw new Error(
      `Sitemap exceeds ${SITEMAP_SEGMENT_SIZE} URLs. Split app/sitemap.ts with generateSitemaps before publishing.`,
    );
  }

  return segments[0] ?? [];
}
