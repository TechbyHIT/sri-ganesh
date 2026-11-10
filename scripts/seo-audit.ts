import { posts } from "../src/data/blog";
import { pageAt } from "../src/seo/catalog";
import { publishedRecords, registryByPath } from "../src/seo/indexable";
import { districtPath, geoDistricts, mandalPath } from "../src/data/geo";
import { legacyRedirect } from "../src/seo/legacy";
import { absoluteLoc, chunkName, chunkSize, sitemapFiles, urlsFor, urlset, xmlEscape } from "../src/seo/sitemaps";
import { TEMPLATE_VERSION } from "../src/seo/types";
import { readRegistry } from "../src/seo/registry";

const failures: string[] = [];

function check(name: string, ok: boolean, detail: string) {
  if (!ok) failures.push(`${name}: ${detail}`);
  else console.log(`ok ${name}`);
}

const file = readRegistry();
check("registry exists", Boolean(file), "data/seo/registry.json is missing. Run npm run seo:generate.");
check("template version", file?.templateVersion === TEMPLATE_VERSION, `expected ${TEMPLATE_VERSION}, got ${file?.templateVersion}`);

const records = [...registryByPath().values()];
const paths = new Set<string>();
let duplicatePaths = 0;
const titles = new Map<string, number>();
for (const record of records) {
  if (paths.has(record.path)) duplicatePaths += 1;
  paths.add(record.path);
  if (record.status === "publish") titles.set(record.title, (titles.get(record.title) ?? 0) + 1);
}
const duplicateTitles = [...titles.values()].filter((count) => count > 1).length;
const emptyTitles = records.filter((record) => record.status === "publish" && !record.title.trim()).length;
const published = publishedRecords();

check("published pages", published.length > 0, "no indexable records");
check("unique paths", duplicatePaths === 0, `${duplicatePaths} duplicate paths`);
check("unique published titles", duplicateTitles === 0, `${duplicateTitles} duplicate titles`);
check("published titles present", emptyTitles === 0, `${emptyTitles} empty titles`);

const reviewInSitemap = published.filter((record) => record.status !== "publish").length;
check("review excluded", reviewInSitemap === 0, `${reviewInSitemap} non-publish records marked indexable`);

const groups = ["core", "services", "locations", "coverage"] as const;
const seen = new Set<string>();
let overlap = 0;
for (const group of groups) {
  const urls = urlsFor(group);
  check(`${group} under 50000`, urls.length <= 50_000, `${urls.length} urls`);
  check(`${group} non-empty`, urls.length > 0, "empty sitemap group");
  for (const path of urls) {
    if (seen.has(path)) overlap += 1;
    seen.add(path);
    if (!path.startsWith("/")) failures.push(`${group} relative path missing: ${path}`);
  }
  const xml = urlset(urls.slice(0, 3));
  check(`${group} xml declaration`, xml.startsWith("<?xml"), "missing declaration");
  check(`${group} escaped sample`, !xml.includes("&amp;amp;") && xml.includes("<loc>"), "loc missing");
}
check("sitemap groups do not repeat URLs", overlap === 0, `${overlap} URLs appear in more than one group`);

const escaped = xmlEscape(`https://example.com/a&b`);
check("xml escape", escaped === "https://example.com/a&amp;b", escaped);
check("absolute loc", absoluteLoc("/services").endsWith("/services"), absoluteLoc("/services"));
check("blog posts included", posts.every((post) => urlsFor("core").includes(`/blog/${post.slug}`)), "a blog post is missing from the core sitemap");

const review = records.find((record) => record.status === "review");
if (review) {
  const page = pageAt(review.path);
  check("review url is noindex", page?.index === false && page.status === "review", review.path);
} else {
  check("review url is noindex", false, "no review record to test");
}
const publishedSample = published[0];
if (publishedSample) {
  const page = pageAt(publishedSample.path);
  check("published url stays indexable", page?.index === true && page.status === "publish", publishedSample.path);
}
check("unknown path is not a page", pageAt("/services/not-a-real-service") === undefined, "draft returned a page");

check("28 districts compiled", geoDistricts.length === 28, `${geoDistricts.length} districts`);
const districtRecords = records.filter((record) => record.kind === "district");
check("every district has a page", districtRecords.length === geoDistricts.length, `${districtRecords.length} district records`);
const unverifiedPublished = geoDistricts.filter((district) => !district.verified && registryByPath().get(districtPath(district.slug))?.status === "publish");
check("unverified districts held", unverifiedPublished.length === 0, unverifiedPublished.map((district) => district.slug).join(", "));
const mandalRecords = records.filter((record) => record.kind === "mandal");
check("every mandal has a page", mandalRecords.length === geoDistricts.reduce((sum, district) => sum + district.mandals.length, 0), `${mandalRecords.length} mandal records`);
const sampleDistrict = geoDistricts.find((district) => district.mandals.length)!;
const sampleMandal = pageAt(mandalPath(sampleDistrict.slug, sampleDistrict.mandals[0].slug));
check("mandal page renders", Boolean(sampleMandal?.h1), mandalPath(sampleDistrict.slug, sampleDistrict.mandals[0].slug));
if (sampleMandal && !sampleMandal.params.city) check("directory-only mandal is noindex", sampleMandal.index === false, sampleMandal.path);
check("mandals in locations sitemap only when published", urlsFor("locations").filter((path) => registryByPath().get(path)?.kind === "mandal").every((path) => registryByPath().get(path)?.status === "publish"), "review mandal in sitemap");
check("sitemap chunk names", chunkName("coverage", 0) === "coverage.xml" && chunkName("coverage", 1) === "coverage-2.xml", chunkName("coverage", 1));
check("sitemap chunk size", sitemapFiles().every((entry) => entry.size <= chunkSize), "a sitemap file is over the chunk size");
check("flat service alias redirects", legacyRedirect("/invisible-grills-in-visakhapatnam") === "/services/invisible-grills/visakhapatnam", String(legacyRedirect("/invisible-grills-in-visakhapatnam")));
check("retired guide redirects", Boolean(legacyRedirect("/guides/invisible-grills-for-balcony")), "no redirect");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ records: records.length, published: published.length, sitemapUrls: seen.size }));
