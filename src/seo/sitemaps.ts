import { posts } from "@/data/blog";
import { libraryItems } from "@/data/library";
import { site } from "@/config/site";
import { publishedRecords } from "@/seo/indexable";

const staticPaths = [
  "/",
  "/services",
  "/locations",
  "/gallery",
  "/about",
  "/blog",
  "/faq",
  "/contact",
  "/sitemap",
  ...libraryItems.map((item) => `/services/library/${item.slug}`),
];

export function xmlEscape(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function absoluteLoc(path: string) {
  return `${site.url.replace(/\/$/, "")}${path}`;
}

export function urlsFor(group: "core" | "services" | "locations" | "coverage") {
  const blog = posts.map((post) => `/blog/${post.slug}`);
  const published = publishedRecords();
  const paths = new Set<string>();
  if (group === "core") {
    for (const path of staticPaths) paths.add(path);
    for (const path of blog) paths.add(path);
    for (const record of published) {
      if (record.kind === "guide") paths.add(record.path);
    }
  } else if (group === "services") {
    for (const record of published) {
      if (record.kind === "service") paths.add(record.path);
    }
  } else if (group === "locations") {
    for (const record of published) {
      if (record.kind === "city" || record.kind === "area" || record.kind === "state") paths.add(record.path);
    }
  } else {
    for (const record of published) {
      if (record.kind === "service-city" || record.kind === "service-area" || record.kind === "guide-city") paths.add(record.path);
    }
  }
  return [...paths];
}

export function urlset(paths: string[]) {
  const modified = new Map(publishedRecords().map((record) => [record.path, record.updatedAt.slice(0, 10)]));
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
