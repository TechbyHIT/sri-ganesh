import { describe, expect, it } from "vitest";
import { URL_MATRIX } from "@/config/url-matrix";
import { matrixApprovals } from "@/data/matrix-approvals";
import { catalogEntries } from "@/data/service-catalog";
import { parseCsv, validateLocationImport } from "@/lib/location-import";
import { allAdminLocations } from "@/lib/location-validation";
import { checkApproval, type MatrixApproval } from "@/lib/url-matrix/content-model";
import { generateMatrix, resolveMatrixPath, summarizeMatrix, type MatrixRow } from "@/lib/url-matrix/generate";
import { findInvalidApprovals, getPublishedMatrixPage, getPublishedMatrixPaths } from "@/lib/url-matrix/published";

function collect(options: Parameters<typeof generateMatrix>[0] = {}): { rows: MatrixRow[] } {
  const rows: MatrixRow[] = [];
  const iterator = generateMatrix(options);
  let step = iterator.next();

  while (!step.done) {
    rows.push(step.value);
    step = iterator.next();
  }

  return { rows };
}

function approvalFor(path: string): MatrixApproval {
  return {
    path,
    coverage: { confirmedBy: "Owner", confirmedOn: "2026-10-09" },
    title: "Service installation at this place, checked with the business",
    description:
      "A page written from work the business confirmed at this place. It names the property types, the fixing method, and how to ask for a visit.",
    content: {
      introduction:
        "This page exists because the business confirmed it installs this fitting here and supplied the details below. Each sentence describes measured work, not a template.",
      verifiedCoverage: "The business confirmed it serves this place and visits for measurement before quoting.",
      propertyTypes: ["Apartment balconies"],
      applications: ["Closing a balcony gap for children", "Keeping pets inside a balcony"],
      installationDetails:
        "The opening is measured first, then the fixing points are chosen from the wall or slab that will hold them. The quote names those fixings. Nothing is assumed from a brochure.",
      materials: ["Stainless steel wire"],
      projects: [],
      maintenance: "Check wire tension and fixings once a year, and rinse salt from coastal balconies with clean water.",
      faqs: [
        { question: "Do you measure before quoting here?", answer: "Yes. The opening is measured on site before any quote is given." },
        { question: "Can a photo replace the visit?", answer: "A photo helps planning but the visit still measures the real opening." },
      ],
      relatedServicePaths: ["/services/invisible-grills"],
      nearbyLocationSlugs: [],
      source: { note: "Supplied by the business owner", verifiedOn: "2026-10-09", verifiedBy: "Owner" },
    },
  };
}

describe("url matrix generation", () => {
  const stats = summarizeMatrix();

  it("produces at least the candidate target from valid data without villages", () => {
    expect(stats.candidateUrls).toBeGreaterThanOrEqual(URL_MATRIX.candidateTarget);
    expect(stats.uniqueCanonicalPaths).toBe(stats.candidateUrls);
    expect(stats.duplicateUrlsRemoved).toBe(0);

    const inMatrix = Object.values(stats.locationsInMatrix).reduce((total, count) => total + count, 0);
    expect(stats.candidateUrls).toBe(inMatrix * stats.serviceEntries.offeredForReview);
  });

  it("keeps unconfirmed services out and counts them as rejected", () => {
    expect(stats.serviceEntries.unverifiedHeldOut).toBe(3);
    expect(stats.invalidCombinationsRejected.unverifiedService).toBe(3 * Object.values(stats.locationsInMatrix).reduce((a, b) => a + b, 0));

    const { rows } = collect({ limit: 3000 });
    expect(rows.some((row) => /golf|volleyball|football-goal/.test(row.serviceSlug))).toBe(false);
  });

  it("makes every path unique, lowercase, hyphenated, state-scoped, and without a trailing slash", () => {
    const { rows } = collect();
    const paths = new Set(rows.map((row) => row.path));

    expect(paths.size).toBe(rows.length);
    expect(rows.every((row) => /^\/[a-z0-9-]+\/andhra-pradesh\/[a-z0-9-]+(\/[a-z0-9-]+)?$/.test(row.path))).toBe(true);
    expect(rows.some((row) => row.path.endsWith("/"))).toBe(false);
    expect(new Set(rows.map((row) => row.id)).size).toBe(rows.length);
  });

  it("does not publish, index, or list in a sitemap any candidate", () => {
    expect(matrixApprovals).toHaveLength(0);
    expect(stats.published).toBe(0);
    expect(stats.indexable).toBe(0);
    expect(stats.sitemapIncluded).toBe(0);
    expect(stats.excludedFromIndexing).toBe(stats.candidateUrls);
    expect(getPublishedMatrixPaths()).toEqual([]);
    expect(stats.byStatus.published).toBe(0);
    expect(stats.awaitingCoverageOrContent + stats.byStatus.excluded).toBe(stats.candidateUrls);
  });

  it("marks pairs the business already serves as served by the existing page", () => {
    const { rows } = collect();
    const row = rows.find((item) => item.serviceSlug === "invisible-grills" && item.locationSlug === "vijayawada");

    expect(row?.publicationStatus).toBe("excluded");
    expect(row?.canonicalPath).toBe("/vijayawada/invisible-grills");
    expect(row?.coverageStatus).toBe("confirmed");

    const other = rows.find((item) => item.serviceSlug === "invisible-grills" && item.locationSlug === "eluru");
    expect(other?.coverageStatus).toBe("unconfirmed");
    expect(other?.publicationStatus).toBe("needs-coverage-confirmation");
  });

  it("flags one primary entry per search intent and the rest as overlapping", () => {
    const { rows } = collect({ limit: 2000 });
    const forPlace = rows.filter((row) => row.locationSlug === rows[0]?.locationSlug);
    const primaries = forPlace.filter((row) => row.intentRole === "primary");

    expect(primaries.length).toBe(stats.serviceEntries.intentGroups);
    expect(forPlace.filter((row) => row.duplicateCheck === "intent-overlap").length).toBe(forPlace.length - primaries.length);
    expect(stats.serviceEntries.intentGroups).toBeLessThan(stats.serviceEntries.offeredForReview);
  });

  it("keeps villages opt-in and reports what they would add", () => {
    const villageCount = allAdminLocations().filter((place) => place.type === "village").length;
    expect(stats.notGeneratedByConfiguration.village).toBe(villageCount * stats.serviceEntries.offeredForReview);
    expect(stats.locationsInMatrix.village).toBeUndefined();

    const { rows } = collect({ levels: ["village"], limit: 20 });
    expect(rows).toHaveLength(20);
    expect(rows.every((row) => row.locationType === "village")).toBe(true);
  });

  it("is deterministic so an interrupted run can resume", () => {
    const first = collect({ limit: 500 }).rows.map((row) => row.id);
    const second = collect({ limit: 500 }).rows.map((row) => row.id);
    expect(second).toEqual(first);
  });

  it("every entry slug is unique across the whole catalog", () => {
    expect(new Set(catalogEntries.map((entry) => entry.slug)).size).toBe(catalogEntries.length);
  });
});

describe("matrix path resolution and approvals", () => {
  const sample = collect({ limit: 3000 }).rows.find((row) => row.pageType === "service-mandal");

  it("resolves only a catalog entry with a location in the named district", () => {
    expect(sample).toBeDefined();
    const path = sample?.path ?? "";
    expect(resolveMatrixPath(path)?.location?.slug).toBe(sample?.locationSlug);
    expect(resolveMatrixPath(path.replace("/andhra-pradesh/", "/tamil-nadu/"))).toBeNull();
    expect(resolveMatrixPath(path.replace(`/${sample?.districtSlug}/`, "/ntr/"))).toBeNull();
    expect(resolveMatrixPath("/golf-nets/andhra-pradesh/ntr")).toBeNull();
    expect(resolveMatrixPath("/invisible-grills/andhra-pradesh/ntr/does-not-exist")).toBeNull();
  });

  it("publishes a page only when its approval is complete", () => {
    const path = sample?.path ?? "";
    const good = approvalFor(path);
    expect(checkApproval(good).ok).toBe(true);
    expect(getPublishedMatrixPage(path, [good])?.resolved.entry.slug).toBe(sample?.serviceSlug);
    expect(getPublishedMatrixPage(`${path}/`, [good])).not.toBeNull();
    expect(getPublishedMatrixPage(path, [])).toBeNull();

    const thin = { ...good, content: { ...good.content, introduction: "Too short." } };
    expect(checkApproval(thin).ok).toBe(false);
    expect(getPublishedMatrixPage(path, [thin])).toBeNull();

    const stats = summarizeMatrix({ approvals: [good], limit: 3000 });
    expect(stats.published).toBe(1);
    expect(stats.sitemapIncluded).toBe(1);
    expect(getPublishedMatrixPaths([good])).toEqual([path]);

    const flagged = findInvalidApprovals([thin, approvalFor("/golf-nets/andhra-pradesh/ntr")]);
    expect(flagged).toHaveLength(2);
  });

  it("rejects placeholders and a missing coverage confirmation", () => {
    const path = sample?.path ?? "";
    const withTodo = approvalFor(path);
    withTodo.content.maintenance = "TODO write maintenance guidance for this place and fitting here please";
    expect(checkApproval(withTodo).ok).toBe(false);

    const noCoverage = { ...approvalFor(path), coverage: { confirmedBy: "", confirmedOn: "" } };
    expect(checkApproval(noCoverage).reasons).toContain("coverage confirmation is missing");
  });
});

describe("location import validation", () => {
  const base = { source: "https://example.gov.in", verifiedOn: "2026-10-09" };

  it("accepts a new village under a real mandal and rejects bad rows", () => {
    const mandal = allAdminLocations().find((place) => place.type === "mandal");
    expect(mandal).toBeDefined();

    const report = validateLocationImport([
      { name: "Zzyzx Test Palem", type: "village", parentSlug: mandal?.slug ?? "", ...base },
      { name: "Zzyzx Test Palem", type: "village", parentSlug: mandal?.slug ?? "", ...base },
      { name: "Nowhere", type: "village", parentSlug: "no-such-parent", ...base },
      { name: "Bad Type", type: "galaxy", parentSlug: mandal?.slug ?? "", ...base },
      { name: "Wrong Parent", type: "village", parentSlug: "andhra-pradesh", ...base },
      { name: "Vijayawada", type: "locality", parentSlug: "vijayawada", ...base },
    ]);

    expect(report.accepted.map((row) => row.slug)).toEqual(["zzyzx-test-palem"]);
    const codes = report.issues.filter((issue) => issue.severity === "error").map((issue) => issue.code);
    expect(codes).toEqual(expect.arrayContaining(["duplicate", "parent-missing", "type", "parent-type"]));
    expect(report.rejected).toBe(5);
  });

  it("warns when source or date is missing and reads CSV with quotes", () => {
    const rows = parseCsv('name,type,parentSlug,source,verifiedOn\n"Test, Quoted",village,vijayawada,,\n');
    expect(rows[0]?.name).toBe("Test, Quoted");

    const report = validateLocationImport([
      { name: "Needs Source", type: "locality", parentSlug: "vijayawada" },
    ]);
    expect(report.accepted).toHaveLength(1);
    expect(report.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(["source", "verified-on"]));
  });
});
