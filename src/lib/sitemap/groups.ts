import { getSitemapSegments } from "@/lib/sitemap-data";
import { PUBLISHING } from "@/config/publishing";

export type SitemapGroup =
  | "core"
  | "services"
  | "locations"
  | "areas"
  | "service-location"
  | "service-area"
  | "solutions"
  | "property-types"
  | "guides"
  | "blog"
  | "images";

const files: { file: string; group: SitemapGroup }[] = [
  { file: "core-1.xml", group: "core" },
  { file: "services-1.xml", group: "services" },
  { file: "locations-1.xml", group: "locations" },
  { file: "areas-1.xml", group: "areas" },
  { file: "service-location-1.xml", group: "service-location" },
  { file: "service-area-1.xml", group: "service-area" },
  { file: "solutions-1.xml", group: "solutions" },
  { file: "property-types-1.xml", group: "property-types" },
  { file: "guides-1.xml", group: "guides" },
  { file: "blog-1.xml", group: "blog" },
  { file: "images-1.xml", group: "images" },
];

export function sitemapFiles(): { file: string; group: SitemapGroup }[] {
  return files;
}

export function groupForPath(path: string): SitemapGroup {
  if (path.startsWith("/services/")) return "services";
  if (/^\/locations\/[^/]+\/[^/]+$/.test(path)) return "areas";
  if (path.startsWith("/locations/")) return "locations";
  if (path.startsWith("/solutions")) return "solutions";
  if (path.startsWith("/property-types")) return "property-types";
  if (path.startsWith("/guides")) return "guides";
  if (path.startsWith("/blog")) return "blog";
  if (/^\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(path)) return "service-location";
  if (/^\/[^/]+\/[^/]+\/[^/]+$/.test(path)) return "service-area";
  if (/^\/[^/]+\/[^/]+$/.test(path)) return "service-location";
  return "core";
}

export function urlsForGroup(group: SitemapGroup): { url: string; lastModified: Date }[] {
  const urls = getSitemapSegments()
    .flat()
    .filter((item) => {
      const path = new URL(item.url).pathname.replace(/\/$/, "") || "/";
      return groupForPath(path) === group;
    })
    .map((item) => ({
      url: item.url,
      lastModified: item.lastModified instanceof Date ? item.lastModified : new Date(String(item.lastModified)),
    }));

  if (urls.length > PUBLISHING.sitemapBatchSize) {
    throw new Error(`Sitemap group ${group} exceeds ${PUBLISHING.sitemapBatchSize} URLs.`);
  }

  return urls;
}
