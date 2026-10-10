import { staticPages } from "../src/lib/content/static-pages";
import { findPlaceholders } from "../src/lib/content/placeholders";
import { getSitemapSegments } from "../src/lib/sitemap-data";
import { writeReport } from "./write-json";

const titles = new Map<string, string>();
const descriptions = new Map<string, string>();
const critical: string[] = [];

for (const page of staticPages) {
  if (!page.title.trim()) critical.push(`Missing title ${page.path}`);
  if (!page.description.trim()) critical.push(`Missing description ${page.path}`);
  if (page.description.length > 160) critical.push(`Long description ${page.path}`);
  const titleOwner = titles.get(page.title);
  if (titleOwner) critical.push(`Duplicate title ${page.title}`);
  titles.set(page.title, page.path);
  const descriptionOwner = descriptions.get(page.description);
  if (descriptionOwner) critical.push(`Duplicate description ${page.path}`);
  descriptions.set(page.description, page.path);
  const placeholders = findPlaceholders(`${page.title} ${page.h1} ${page.description} ${page.sections.map((section) => section.paragraphs.join(" ")).join(" ")}`);
  if (placeholders.length > 0) critical.push(`Placeholder on ${page.path}: ${placeholders.join(", ")}`);
}

const urls = getSitemapSegments().flat().map((item) => item.url);
const unique = new Set(urls);
if (unique.size !== urls.length) critical.push("Duplicate sitemap URL");

const report = { critical, sitemapUrls: urls.length, staticPages: staticPages.length };
writeReport("seo-audit.json", report);
writeReport("sitemap-summary.json", { urls: urls.length, files: 11, maxPerFile: 10000 });

if (critical.length > 0) {
  console.error(critical.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify(report));
