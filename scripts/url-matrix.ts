import {
  appendFileSync,
  closeSync,
  createReadStream,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
  writeSync,
} from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { MATRIX_STATUSES, URL_MATRIX, type MatrixLevel } from "../src/config/url-matrix";
import { matrixApprovals } from "../src/data/matrix-approvals";
import { allAdminLocations, validateLocationHierarchy } from "../src/lib/location-validation";
import { summarizeCatalog, validateCatalog } from "../src/lib/service-catalog";
import { getIndexableEntries } from "../src/lib/sitemap-data";
import { findOrphanPages } from "../src/lib/internal-links";
import { sitemapFiles, urlsForGroup } from "../src/lib/sitemap/groups";
import { generateMatrix, matrixEntries, type MatrixRow, type MatrixStats } from "../src/lib/url-matrix/generate";
import { findInvalidApprovals, getPublishedMatrixPaths } from "../src/lib/url-matrix/published";

const [command = "help", ...rest] = process.argv.slice(2);
const flags = new Map(
  rest.map((arg) => {
    const [key = "", value] = arg.replace(/^--/, "").split("=");
    return [key, value ?? "true"] as const;
  }),
);
const outDir = path.join(process.cwd(), flags.get("out") ?? URL_MATRIX.outputDirectory);
const registryFile = path.join(outDir, "candidates.ndjson");
const checkpointFile = path.join(outDir, "checkpoint.json");

function levelsFromFlags(): MatrixLevel[] {
  const requested = flags.get("levels");
  const levels = requested
    ? requested.split(",").map((item) => item.trim())
    : [...URL_MATRIX.defaultLevels, ...(flags.has("include-villages") ? (["village"] as const) : [])];

  for (const level of levels) {
    if (!(URL_MATRIX.allLevels as readonly string[]).includes(level)) {
      throw new Error(`Unknown level "${level}". Use: ${URL_MATRIX.allLevels.join(", ")}.`);
    }
  }

  return [...new Set(levels)] as MatrixLevel[];
}

function batchSizeFromFlags(): number {
  const value = Number(flags.get("batch-size") ?? URL_MATRIX.batchSize);

  if (!Number.isInteger(value) || value < 1 || value > 20000) {
    throw new Error("--batch-size must be an integer from 1 to 20000.");
  }

  return value;
}

function csvLine(values: readonly unknown[]): string {
  return values.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",");
}

function writeJson(name: string, value: unknown) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`);
}

function writeCsv(name: string, header: readonly string[], rows: readonly (readonly unknown[])[]) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, name), `${[csvLine(header), ...rows.map(csvLine)].join("\n")}\n`);
}

async function* readRegistry(): AsyncGenerator<MatrixRow> {
  if (!existsSync(registryFile)) {
    throw new Error(`No registry at ${registryFile}. Run generate:urls first.`);
  }

  const lines = readline.createInterface({ input: createReadStream(registryFile, "utf-8"), crlfDelay: Infinity });

  for await (const line of lines) {
    if (line.trim()) {
      yield JSON.parse(line) as MatrixRow;
    }
  }
}

function drain(levels: MatrixLevel[], limit: number | undefined, onRow: (row: MatrixRow, index: number) => void): MatrixStats {
  const iterator = generateMatrix({ levels, limit });
  let index = 0;
  let step = iterator.next();

  while (!step.done) {
    onRow(step.value, index);
    index += 1;
    step = iterator.next();
  }

  return step.value;
}

function printStats(stats: MatrixStats) {
  console.log(JSON.stringify(stats, null, 2));
}

function statsRows(stats: MatrixStats): [string, string | number][] {
  const rows: [string, string | number][] = [
    ["Service entries supplied", stats.serviceEntries.total],
    ["Service entries offered for review", stats.serviceEntries.offeredForReview],
    ["Service entries held out (not confirmed)", stats.serviceEntries.unverifiedHeldOut],
    ["Service categories", stats.serviceEntries.categories],
    ["Search-intent groups", stats.serviceEntries.intentGroups],
    ...Object.entries(stats.locationRecords).map(([type, count]) => [`Location records: ${type}`, count] as [string, number]),
    ...Object.entries(stats.locationsInMatrix).map(([type, count]) => [`Locations in matrix: ${type}`, count] as [string, number]),
    ["Service-location combinations considered", stats.combinationsConsidered],
    ["Candidate URL records", stats.candidateUrls],
    ["Unique canonical paths", stats.uniqueCanonicalPaths],
    ["Duplicate URLs removed", stats.duplicateUrlsRemoved],
    ["Invalid combinations rejected", stats.invalidCombinationsRejected.total],
    ["  rejected: service not confirmed", stats.invalidCombinationsRejected.unverifiedService],
    ["  rejected: no district resolved", stats.invalidCombinationsRejected.unresolvedDistrict],
    ["  rejected: inactive location", stats.invalidCombinationsRejected.inactiveLocation],
    ["Confirmed service-location combinations", stats.confirmedCoverage],
    ["Primary-intent candidates", stats.byIntentRole.primary],
    ["Variant (overlapping-intent) candidates", stats.byIntentRole.variant],
    ["Published matrix pages", stats.published],
    ["Indexable matrix pages", stats.indexable],
    ["Excluded from indexing", stats.excludedFromIndexing],
    ["Awaiting coverage or content verification", stats.awaitingCoverageOrContent],
    ["Matrix URLs in sitemaps", stats.sitemapIncluded],
    ...Object.entries(stats.notGeneratedByConfiguration).map(([level, count]) => [`Available but not generated (${level} level)`, count] as [string, number]),
    ...MATRIX_STATUSES.map((status) => [`Status: ${status}`, stats.byStatus[status]] as [string, number]),
    ...Object.entries(stats.byLevel).map(([level, count]) => [`Candidates at ${level} level`, count] as [string, number]),
  ];
  return rows;
}

async function generate() {
  const levels = levelsFromFlags();
  const batchSize = batchSizeFromFlags();
  const dryRun = flags.has("dry-run");
  const resume = flags.has("resume");
  const limitFlag = flags.get("limit");
  const limit = limitFlag ? Number(limitFlag) : undefined;
  const stopAfterBatches = flags.get("stop-after-batches") ? Number(flags.get("stop-after-batches")) : undefined;

  if (dryRun) {
    const stats = drain(levels, limit, () => {});
    printStats(stats);
    console.log(`Dry run only. ${stats.candidateUrls} candidate URLs counted. Nothing was written.`);
    return;
  }

  mkdirSync(outDir, { recursive: true });
  let skip = 0;

  if (resume && existsSync(checkpointFile)) {
    const checkpoint = JSON.parse(readFileSync(checkpointFile, "utf-8")) as { rowsWritten: number; complete: boolean; levels: MatrixLevel[] };

    if (checkpoint.levels.join(",") !== levels.join(",")) {
      throw new Error("The checkpoint was made with different levels. Run without --resume to start over.");
    }

    if (checkpoint.complete) {
      console.log("The previous run finished. Nothing to resume.");
      return;
    }

    skip = checkpoint.rowsWritten;
    console.log(`Resuming after ${skip} rows already written.`);
  } else {
    writeFileSync(registryFile, "");
  }

  const fd = openSync(registryFile, "a");
  let batch: string[] = [];
  let rowsWritten = skip;
  let batches = 0;
  let stopped = false;

  const flush = () => {
    if (batch.length === 0) {
      return;
    }

    writeSync(fd, `${batch.join("\n")}\n`);
    rowsWritten += batch.length;
    batch = [];
    batches += 1;
    writeJson("checkpoint.json", { rowsWritten, complete: false, levels, updatedAt: new Date().toISOString() });
  };

  const stats = drain(levels, limit, (row, index) => {
    if (stopped || index < skip) {
      return;
    }

    batch.push(JSON.stringify(row));

    if (batch.length >= batchSize) {
      flush();

      if (stopAfterBatches !== undefined && batches >= stopAfterBatches) {
        stopped = true;
      }
    }
  });

  if (!stopped) {
    flush();
  }

  closeSync(fd);

  if (stopped) {
    console.log(`Stopped after ${batches} batches (${rowsWritten} rows). Run again with --resume to continue.`);
    return;
  }

  writeJson("checkpoint.json", { rowsWritten, complete: true, levels, updatedAt: new Date().toISOString() });
  writeJson("summary.json", stats);
  writeCsv("summary.csv", ["metric", "value"], statsRows(stats));
  writeCsv(
    "status-by-level.csv",
    ["level", "candidates"],
    Object.entries(stats.byLevel),
  );
  printStats(stats);
  console.log(`Wrote ${rowsWritten} rows to ${path.relative(process.cwd(), registryFile)}.`);
}

async function exportRegistry() {
  mkdirSync(outDir, { recursive: true });
  const columns: (keyof MatrixRow)[] = [
    "id", "path", "canonicalPath", "pageType", "serviceEntryId", "serviceSlug", "categoryId", "searchIntent", "intentGroup", "intentRole",
    "locationId", "locationSlug", "locationType", "districtSlug", "parentLocationId", "coverageStatus", "contentStatus", "duplicateCheck",
    "indexability", "publicationStatus", "statusReason", "sitemapStatus", "lastMeaningfulUpdate",
  ];
  const csvPath = path.join(outDir, "candidates.csv");
  const jsonPath = path.join(outDir, "candidates.json");
  writeFileSync(csvPath, `${csvLine(columns)}\n`);
  writeFileSync(jsonPath, "[");
  let count = 0;
  let csvBuffer: string[] = [];
  let jsonBuffer: string[] = [];
  let firstJson = true;

  const flushExport = () => {
    if (csvBuffer.length === 0) {
      return;
    }

    appendFileSync(csvPath, `${csvBuffer.join("\n")}\n`);
    appendFileSync(jsonPath, `${firstJson ? "\n" : ",\n"}${jsonBuffer.map((line) => `  ${line}`).join(",\n")}`);
    firstJson = false;
    csvBuffer = [];
    jsonBuffer = [];
  };

  for await (const row of readRegistry()) {
    csvBuffer.push(csvLine(columns.map((column) => row[column])));
    jsonBuffer.push(JSON.stringify(row));
    count += 1;

    if (csvBuffer.length >= 5000) {
      flushExport();
    }
  }

  flushExport();
  appendFileSync(jsonPath, "\n]\n");
  console.log(`Exported ${count} rows to candidates.csv and candidates.json in ${path.relative(process.cwd(), outDir)}.`);
}

function validateServices() {
  const published = new Set(getIndexableEntries().map((entry) => entry.path));
  validateCatalog(published);
  const summary = summarizeCatalog();
  const { offered, heldOut } = matrixEntries();
  const groups = new Map<string, string[]>();

  for (const entry of offered) {
    groups.set(entry.canonicalPath, [...(groups.get(entry.canonicalPath) ?? []), entry.name]);
  }

  const report = {
    ...summary,
    offeredForReview: offered.length,
    heldOut: heldOut.map((entry) => entry.name),
    intentGroups: [...groups.entries()].map(([canonicalPath, names]) => ({ canonicalPath, entries: names.length, names })),
    note: "Entries with the same canonical path share one search intent. Only the primary entry is a distinct page candidate.",
  };
  writeJson("services-validation.json", report);
  writeCsv("services-intent-groups.csv", ["canonicalPath", "entries", "names"], report.intentGroups.map((group) => [group.canonicalPath, group.entries, group.names.join("; ")]));
  console.log(JSON.stringify({ ...summary, offeredForReview: offered.length, heldOut: heldOut.length, intentGroups: groups.size }, null, 2));
}

function validateLocations() {
  validateLocationHierarchy();
  const places = allAdminLocations();
  const counts: Record<string, number> = {};
  const nameInDistrict = new Map<string, string[]>();

  for (const place of places) {
    counts[place.type] = (counts[place.type] ?? 0) + 1;

    if (place.districtId && place.type !== "district") {
      const key = `${place.districtId}|${place.type}|${place.name.toLowerCase()}`;
      nameInDistrict.set(key, [...(nameInDistrict.get(key) ?? []), place.id]);
    }
  }

  const ambiguous = [...nameInDistrict.entries()].filter(([, ids]) => ids.length > 1).map(([key, ids]) => ({ key, ids }));
  const report = {
    total: places.length,
    byType: counts,
    hierarchy: "valid",
    sameNameInSameDistrict: ambiguous.length,
    ambiguous: ambiguous.slice(0, 200),
    excluded: "Markapuram and Polavaram were in the Local Government Directory download and are not imported. They are not on the Andhra Pradesh District Portal list of 26 districts.",
  };
  writeJson("locations-validation.json", report);
  console.log(JSON.stringify({ total: report.total, byType: counts, hierarchy: report.hierarchy, sameNameInSameDistrict: report.sameNameInSameDistrict }, null, 2));
}

async function auditDuplicates() {
  const paths = new Set<string>();
  const ids = new Set<string>();
  const pairs = new Set<string>();
  let rows = 0;
  let duplicatePaths = 0;
  let duplicateIds = 0;
  let duplicatePairs = 0;
  let uppercaseOrTrailingSlash = 0;

  for await (const row of readRegistry()) {
    rows += 1;
    if (paths.has(row.path)) duplicatePaths += 1;
    if (ids.has(row.id)) duplicateIds += 1;
    const pair = `${row.serviceEntryId}|${row.locationId}`;
    if (pairs.has(pair)) duplicatePairs += 1;
    paths.add(row.path);
    ids.add(row.id);
    pairs.add(pair);
    if (row.path !== row.path.toLowerCase() || row.path.endsWith("/")) uppercaseOrTrailingSlash += 1;
  }

  const report = { rows, uniquePaths: paths.size, duplicatePaths, duplicateIds, duplicateServiceLocationPairs: duplicatePairs, nonCanonicalFormat: uppercaseOrTrailingSlash };
  writeJson("duplicates-audit.json", report);
  console.log(JSON.stringify(report, null, 2));
  process.exit(duplicatePaths + duplicateIds + duplicatePairs + uppercaseOrTrailingSlash > 0 ? 1 : 0);
}

async function auditCoverage() {
  const byStatus: Record<string, number> = {};
  const byCoverage: Record<string, number> = {};
  const reasons: Record<string, number> = {};
  const confirmed: string[] = [];

  for await (const row of readRegistry()) {
    byStatus[row.publicationStatus] = (byStatus[row.publicationStatus] ?? 0) + 1;
    byCoverage[row.coverageStatus] = (byCoverage[row.coverageStatus] ?? 0) + 1;
    const reason = row.statusReason.replace(/for \/[a-z/-]+$/, "for <service page>").replace(/served by \/\S+/, "served by <existing page>");
    reasons[reason] = (reasons[reason] ?? 0) + 1;
    if (row.coverageStatus === "confirmed" && confirmed.length < 500) confirmed.push(`${row.path} -> ${row.canonicalPath}`);
  }

  const report = { byStatus, byCoverage, reasons, confirmedSample: confirmed };
  writeJson("coverage-audit.json", report);
  writeCsv("status-reasons.csv", ["reason", "candidates"], Object.entries(reasons));
  console.log(JSON.stringify({ byStatus, byCoverage, reasons }, null, 2));
}

async function auditContent() {
  const invalid = findInvalidApprovals();
  const contentStatus: Record<string, number> = {};
  const statusCount: Record<string, number> = {};

  for await (const row of readRegistry()) {
    contentStatus[row.contentStatus] = (contentStatus[row.contentStatus] ?? 0) + 1;
    statusCount[row.publicationStatus] = (statusCount[row.publicationStatus] ?? 0) + 1;
  }

  const report = {
    approvals: matrixApprovals.length,
    invalidApprovals: invalid,
    contentStatus,
    needsContent: statusCount["needs-content"] ?? 0,
    awaitingCoverage: statusCount["needs-coverage-confirmation"] ?? 0,
    note: "Content is written by the business and added in data/matrix-approvals.ts. Nothing is filled in from templates.",
  };
  writeJson("content-audit.json", report);
  console.log(JSON.stringify(report, null, 2));
  process.exit(invalid.length > 0 ? 1 : 0);
}

function auditLinks() {
  const published = new Set(getIndexableEntries().map((entry) => entry.path));
  const problems: { path: string; problem: string }[] = [];

  for (const approval of matrixApprovals) {
    for (const related of approval.content.relatedServicePaths) {
      if (!published.has(related)) problems.push({ path: approval.path, problem: `related link ${related} is not published` });
    }
  }

  const orphans = findOrphanPages();
  const report = {
    approvedMatrixPages: matrixApprovals.length,
    brokenLinks: problems,
    existingOrphanPages: orphans.services.length + orphans.locations.length + orphans.serviceLocations.length,
    note: "Matrix candidates are not linked from any page. They have no route until approved.",
  };
  writeJson("internal-links-audit.json", report);
  console.log(JSON.stringify(report, null, 2));
  process.exit(problems.length + report.existingOrphanPages > 0 ? 1 : 0);
}

async function sitemaps() {
  const files = sitemapFiles().map((item) => ({
    file: item.file,
    urls: item.group === "images" || item.group === "blog" ? 0 : urlsForGroup(item.group).length,
  }));
  const total = getIndexableEntries().length;
  const publishedMatrix = new Set(getPublishedMatrixPaths());
  let leaked = 0;

  if (existsSync(registryFile)) {
    const listed = new Set(getIndexableEntries().map((entry) => entry.path));

    for await (const row of readRegistry()) {
      if (listed.has(row.path) && !publishedMatrix.has(row.path)) leaked += 1;
    }
  }

  const report = { files, totalSitemapUrls: total, matrixUrlsInSitemap: publishedMatrix.size, candidatesWronglyListed: leaked, limitPerFile: 50000 };
  writeJson("sitemap-summary.json", report);
  console.log(JSON.stringify(report, null, 2));
  process.exit(leaked > 0 || files.some((item) => item.urls >= 50000) ? 1 : 0);
}

async function main() {
  switch (command) {
    case "generate":
      return generate();
    case "export":
      return exportRegistry();
    case "validate-services":
      return validateServices();
    case "validate-locations":
      return validateLocations();
    case "audit-duplicates":
      return auditDuplicates();
    case "audit-coverage":
      return auditCoverage();
    case "audit-content":
      return auditContent();
    case "audit-links":
      return auditLinks();
    case "sitemaps":
      return sitemaps();
    default:
      console.log(
        "Commands: generate [--dry-run] [--resume] [--levels=a,b] [--include-villages] [--batch-size=N] [--limit=N], export, validate-services, validate-locations, audit-duplicates, audit-coverage, audit-content, audit-links, sitemaps",
      );
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
