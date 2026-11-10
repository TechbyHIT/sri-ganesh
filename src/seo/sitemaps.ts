import { posts } from "@/data/blog";
import { libraryItems } from "@/data/library";
import { site } from "@/config/site";
import { publishedRecords } from "@/seo/indexable";
import type { PageKind } from "@/seo/types";

export const sitemapGroups = ["core", "services", "locations", "coverage"] as const;
export type SitemapGroup = (typeof sitemapGroups)[number];

export const chunkSize = 40000;

const staticPaths = [
  "/",
  "/services",
  "/locations",
  "/locations/andhra-pradesh/districts",
  "/gallery",
  "/about",
  "/blog",
  "/faq",
  "/contact",
  "/sitemap",
  ...libraryItems.map((item) => `/services/library/${item.slug}`),
];

const kindsByGroup: Record<Exclude<SitemapGroup, "core">, PageKind[]> = {
  services: ["service"],
  locations: ["state", "district", "mandal", "city", "area"],
  coverage: ["service-city", "service-area", "guide-city"],
};

export function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function absoluteLoc(path: string) {
  return `${site.url.replace(/\/$/, "")}${path}`;
}

export function urlsFor(group: SitemapGroup) {
  const published = publishedRecords();
  const paths = new Set<string>();
  if (group === "core") {
    for (const path of staticPaths) paths.add(path);
    for (const post of posts) paths.add(`/blog/${post.slug}`);
    for (const record of published) if (record.kind === "guide") paths.add(record.path);
  } else {
    const kinds = new Set<string>(kindsByGroup[group]);
    for (const record of published) if (kinds.has(record.kind)) paths.add(record.path);
  }
  return [...paths];
}

export function chunkName(group: SitemapGroup, index: number) {
  return index === 0 ? `${group}.xml` : `${group}-${index + 1}.xml`;
}

export function sitemapFiles() {
  const modified = lastModified();
  return sitemapGroups.flatMap((group) => {
    const urls = urlsFor(group);
    const count = Math.max(1, Math.ceil(urls.length / chunkSize));
    return Array.from({ length: count }, (_, index) => {
      const slice = urls.slice(index * chunkSize, (index + 1) * chunkSize);
      const lastmod = slice.map((path) => modified.get(path) ?? "").sort().at(-1) ?? "";
      return { group, index, name: chunkName(group, index), size: slice.length, lastmod };
    });
  });
}

export function parseChunk(name: string): { group: SitemapGroup; index: number } | undefined {
  const match = name.match(/^([a-z]+)(?:-(\d+))?\.xml$/);
  if (!match || !sitemapGroups.includes(match[1] as SitemapGroup)) return undefined;
  const index = match[2] ? Number(match[2]) - 1 : 0;
  if (index < 0 || (match[2] && index === 0)) return undefined;
  return { group: match[1] as SitemapGroup, index };
}

function lastModified() {
  return new Map(publishedRecords().map((record) => [record.path, record.updatedAt.slice(0, 10)]));
}

export function urlset(paths: string[]) {
  const modified = lastModified();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => {
    const lastmod = modified.get(path);
    const loc = xmlEscape(absoluteLoc(path));
    return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : ""}</url>`;
  })
  .join("\n")}
</urlset>`;
}

export function sitemapIndex() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles()
  .map((file) => `  <sitemap><loc>${xmlEscape(absoluteLoc(`/sitemaps/${file.name}`))}</loc>${file.lastmod ? `<lastmod>${file.lastmod}</lastmod>` : ""}</sitemap>`)
  .join("\n")}
</sitemapindex>`;
}
