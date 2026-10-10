import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import type { MatrixStats } from "../src/lib/url-matrix/generate";
import { requireBatchSize } from "../src/lib/publishing/args";
import { buildUrlRegistry, summarizeRegistry, takeRegistryBatch, URL_CAPACITY } from "../src/lib/url-registry";

const args = process.argv.slice(2);
if (args.includes("--write")) {
  throw new Error(
    "The URL registry command is dry-run only. Use pages:create with an explicit limit after DATABASE_URL is configured.",
  );
}

const dryRun = true;
const records = buildUrlRegistry();
const summary = summarizeRegistry(records);
const batchSize = args.some((arg) => arg.startsWith("--batch-size=")) ? requireBatchSize(args) : Math.min(records.length, 500);
const cursorArg = args.find((arg) => arg.startsWith("--cursor="));
const cursor = cursorArg ? cursorArg.slice("--cursor=".length) : null;
const batch = records.length === 0 ? { items: [], nextCursor: null } : takeRegistryBatch(records, cursor, Math.min(batchSize, 500));

const report = {
  dryRun,
  capacity: URL_CAPACITY,
  summary,
  batch: {
    size: batch.items.length,
    nextCursor: batch.nextCursor,
  },
};

console.log(JSON.stringify(report, null, 2));

if (dryRun) {
  console.log("Dry run only. No page files or database rows were written.");
}

const lines = [
  "# Programmatic SEO audit",
  "",
  `Generated ${new Date().toISOString().slice(0, 10)} from the verified catalogue. Capacity target: ${URL_CAPACITY} URL records. This run did not invent places or publish unconfirmed service combinations.`,
  "",
  "## Counts",
  "",
  `| Check | Count |`,
  `| --- | ---: |`,
  ...Object.entries(summary.verifiedLocationsByType).map(([type, count]) => `| Verified ${type} records | ${count} |`),
  `| Active services | ${summary.activeServices} |`,
  `| Confirmed service-location relationships | ${summary.confirmedServiceLocations} |`,
  `| Candidate URLs | ${summary.candidateUrls} |`,
  `| Unique URLs | ${summary.uniqueUrls} |`,
  `| Indexable URLs under the strict quality gate | ${summary.indexableUrls} |`,
  `| Noindex or withheld URLs | ${summary.noindexUrls} |`,
  `| Invalid URLs | ${summary.invalidUrls} |`,
  `| Duplicate URLs | ${summary.duplicateUrls} |`,
  `| Thin-content URLs | ${summary.thinContentUrls} |`,
  `| Missing-data items | ${summary.missingData.length} |`,
  `| Orphan indexable pages | ${summary.orphanPages} |`,
  `| Sitemap URLs | ${summary.sitemapUrls} |`,
  `| Gap to the ${URL_CAPACITY} capacity | ${summary.gapToCapacity} |`,
  "",
  "## Drafts by type",
  "",
  ...Object.entries(summary.draftsByType).map(([type, count]) => `- ${type}: ${count}`),
  "",
  "## Supplied service catalog",
  "",
  `${summary.serviceCatalog.categories} categories and ${summary.serviceCatalog.entries} named entries are stored in \`src/data/service-catalog.ts\` (the brief said 56; the supplied list has 54). ${summary.serviceCatalog.canonical} are the published service pages themselves, ${summary.serviceCatalog.merged} share the intent of an existing page and resolve there through a redirect alias under \`/services/{category}/{entry}\`, and ${summary.serviceCatalog.unverified} (football goal nets, golf nets, volleyball nets) are not confirmed work and have no public link. No entry became a separate page.`,
  "",
  "## Missing verified data",
  "",
  ...summary.missingData.map((gap) => `- ${gap}`),
  "",
  "## Supplied starter PDF",
  "",
  "The starter PDF was stored only as unconfirmed town records under the 26 portal districts. Those records are withheld, have no service coverage, and are not indexable. The PDF does not name a mandal, so each imported town uses its district as parent until an official mandal mapping exists. Addanki, Atmakur, Ponnur, and Prathipadu were listed under more than one district and were left out. Markapuram, Giddalur, and Polavaram were left out because they are not in the current 26-district portal list. Names that already exist as cities, localities, or Tirupati mandals were not duplicated.",
  "",
  "## Route decision",
  "",
  "Public URLs stay on the existing routes: `/services/[service]`, `/locations/[city]`, `/locations/[city]/[locality]`, `/[city]/[service]`, and `/[city]/[locality]/[service]`. A root pattern such as `/invisible-grills/[district]` would collide with the city-service route, so it was not added. District, revenue-division, and mandal records are withheld. Their paths return notFound until a reviewed page exists. Service combinations exist only for rows in `data/serviceLocations.ts`.",
  "",
  "## Batch",
  "",
  `Dry run processed ${batch.items.length} records in this batch. Next cursor: ${batch.nextCursor ?? "none"}. The generator is sorted by URL and can resume with \`--cursor\`. Nothing was written to PostgreSQL. The existing \`pages:create\` command performs guarded database upserts after \`DATABASE_URL\` is configured; it does not overwrite publication or indexing decisions.`,
  "",
];

const matrixSummaryPath = "reports/url-registry/summary.json";

if (existsSync(matrixSummaryPath)) {
  const matrix = JSON.parse(readFileSync(matrixSummaryPath, "utf-8")) as MatrixStats;
  lines.push(
    "## Service-and-location URL matrix",
    "",
    `Generated by \`npm run generate:urls\` into \`reports/url-registry/\` (not committed; regenerate any time). Levels: ${matrix.levels.join(", ")}. Candidates are records, not pages. None has a route, a link, or a sitemap entry until the business approves it in \`src/data/matrix-approvals.ts\`.`,
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| Service entries supplied | ${matrix.serviceEntries.total} |`,
    `| Service entries in the matrix | ${matrix.serviceEntries.offeredForReview} |`,
    `| Service entries held out (work not confirmed) | ${matrix.serviceEntries.unverifiedHeldOut} |`,
    `| Distinct search intents among those entries | ${matrix.serviceEntries.intentGroups} |`,
    `| Location records (all types) | ${Object.values(matrix.locationRecords).reduce((total, count) => total + count, 0)} |`,
    `| Locations in this matrix | ${Object.values(matrix.locationsInMatrix).reduce((total, count) => total + count, 0)} |`,
    `| Combinations considered | ${matrix.combinationsConsidered} |`,
    `| Candidate URL records | ${matrix.candidateUrls} |`,
    `| Unique canonical paths | ${matrix.uniqueCanonicalPaths} |`,
    `| Duplicate URLs removed | ${matrix.duplicateUrlsRemoved} |`,
    `| Invalid combinations rejected | ${matrix.invalidCombinationsRejected.total} |`,
    `| Confirmed coverage (already served by an existing page) | ${matrix.confirmedCoverage} |`,
    `| Primary-intent candidates | ${matrix.byIntentRole.primary} |`,
    `| Overlapping-intent variants | ${matrix.byIntentRole.variant} |`,
    `| Published matrix pages | ${matrix.published} |`,
    `| Indexable matrix pages | ${matrix.indexable} |`,
    `| Excluded from indexing | ${matrix.excludedFromIndexing} |`,
    `| Awaiting coverage or content | ${matrix.awaitingCoverageOrContent} |`,
    `| In sitemaps | ${matrix.sitemapIncluded} |`,
    `| Villages available but not generated | ${(matrix.notGeneratedByConfiguration.village ?? 0)} |`,
    "",
    "Most candidates are variants of the same intent, so the distinct-page ceiling is the primary-intent count, and only after the business confirms coverage and supplies local content for each place.",
    "",
  );
}

mkdirSync("reports", { recursive: true });
writeFileSync("reports/url-registry-dry-run.json", `${JSON.stringify(report, null, 2)}\n`);
writeFileSync("PROGRAMMATIC_SEO_AUDIT.md", `${lines.join("\n")}\n`);
