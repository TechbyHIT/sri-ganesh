import { URL_MATRIX, type MatrixLevel, type MatrixStatus } from "@/config/url-matrix";
import { catalogEntries, serviceCategories, type CatalogEntry } from "@/data/service-catalog";
import { matrixApprovals } from "@/data/matrix-approvals";
import { serviceLocations } from "@/data/serviceLocations";
import type { AdminLocation } from "@/data/types";
import { allAdminLocations, validateLocationHierarchy } from "@/lib/location-validation";
import { checkApproval, type MatrixApproval } from "@/lib/url-matrix/content-model";

export type MatrixRow = {
  id: string;
  path: string;
  canonicalPath: string;
  pageType: string;
  serviceEntryId: string;
  serviceSlug: string;
  categoryId: string;
  searchIntent: string;
  intentGroup: string;
  intentRole: "primary" | "variant";
  locationId: string;
  locationSlug: string;
  locationType: string;
  districtSlug: string;
  parentLocationId: string | null;
  coverageStatus: "confirmed" | "unconfirmed";
  contentStatus: "none" | "partial" | "complete";
  duplicateCheck: "unique" | "intent-overlap";
  indexability: "indexable" | "withheld";
  publicationStatus: MatrixStatus;
  statusReason: string;
  sitemapStatus: "included" | "excluded";
  lastMeaningfulUpdate: string | null;
};

export type MatrixOptions = {
  levels?: readonly MatrixLevel[];
  approvals?: readonly MatrixApproval[];
  /** Stop after this many candidate rows. For smoke tests. */
  limit?: number;
};

export type MatrixStats = {
  levels: MatrixLevel[];
  serviceEntries: { total: number; offeredForReview: number; unverifiedHeldOut: number; categories: number; intentGroups: number };
  locationRecords: Record<string, number>;
  locationsInMatrix: Record<string, number>;
  combinationsConsidered: number;
  candidateUrls: number;
  uniqueCanonicalPaths: number;
  duplicateUrlsRemoved: number;
  invalidCombinationsRejected: {
    unverifiedService: number;
    unresolvedDistrict: number;
    inactiveLocation: number;
    total: number;
  };
  notGeneratedByConfiguration: Record<string, number>;
  byStatus: Record<MatrixStatus, number>;
  byLevel: Record<string, number>;
  byIntentRole: { primary: number; variant: number };
  confirmedCoverage: number;
  published: number;
  indexable: number;
  excludedFromIndexing: number;
  awaitingCoverageOrContent: number;
  sitemapIncluded: number;
};

const LEVEL_FOR_TYPE: Record<string, MatrixLevel | undefined> = {
  district: "district",
  mandal: "mandal",
  city: "city",
  town: "town",
  locality: "locality",
  village: "village",
};

export function emptyStats(levels: readonly MatrixLevel[]): MatrixStats {
  const byStatus = {} as Record<MatrixStatus, number>;
  for (const status of [
    "candidate",
    "needs-coverage-confirmation",
    "needs-content",
    "editorial-review",
    "approved",
    "published",
    "noindex",
    "redirect",
    "excluded",
  ] as const) {
    byStatus[status] = 0;
  }

  return {
    levels: [...levels],
    serviceEntries: { total: 0, offeredForReview: 0, unverifiedHeldOut: 0, categories: serviceCategories.length, intentGroups: 0 },
    locationRecords: {},
    locationsInMatrix: {},
    combinationsConsidered: 0,
    candidateUrls: 0,
    uniqueCanonicalPaths: 0,
    duplicateUrlsRemoved: 0,
    invalidCombinationsRejected: { unverifiedService: 0, unresolvedDistrict: 0, inactiveLocation: 0, total: 0 },
    notGeneratedByConfiguration: {},
    byStatus,
    byLevel: {},
    byIntentRole: { primary: 0, variant: 0 },
    confirmedCoverage: 0,
    published: 0,
    indexable: 0,
    excludedFromIndexing: 0,
    awaitingCoverageOrContent: 0,
    sitemapIncluded: 0,
  };
}

export function matrixPath(entrySlug: string, districtSlug: string, locationSlug: string | null, stateSlug: string): string {
  return `/${entrySlug}/${stateSlug}/${districtSlug}${locationSlug ? `/${locationSlug}` : ""}`;
}

/** Entries that go into the matrix: every supplied entry except work the business has not confirmed. */
export function matrixEntries(): { offered: CatalogEntry[]; heldOut: CatalogEntry[] } {
  return {
    offered: catalogEntries.filter((entry) => entry.status !== "unverified"),
    heldOut: catalogEntries.filter((entry) => entry.status === "unverified"),
  };
}

/** One primary entry per intent group. Other entries in the group are variants of the same search intent. */
export function primaryEntryByIntent(entries: readonly CatalogEntry[]): Map<string, string> {
  const primary = new Map<string, string>();

  for (const entry of entries) {
    const current = primary.get(entry.canonicalPath);
    const currentEntry = current ? entries.find((item) => item.id === current) : undefined;

    if (!currentEntry || (entry.status === "canonical" && currentEntry.status !== "canonical")) {
      primary.set(entry.canonicalPath, entry.id);
    }
  }

  return primary;
}

/** (service page slug):(location slug) pairs the business already confirmed. Each has an existing page. */
function confirmedPairs(): Map<string, string> {
  const pairs = new Map<string, string>();

  for (const row of serviceLocations) {
    if (!row.active || !row.indexable) {
      continue;
    }

    pairs.set(`${row.locationSlug}:${row.serviceSlug}`, row.locationSlug);
  }

  return pairs;
}

function existingPagePath(serviceSlug: string, location: AdminLocation, byId: Map<string, AdminLocation>): string | null {
  if (location.type === "city") {
    return `/${location.slug}/${serviceSlug}`;
  }

  if (location.type === "locality") {
    const city = location.parentId ? byId.get(location.parentId) : undefined;
    return city ? `/${city.slug}/${location.slug}/${serviceSlug}` : null;
  }

  return null;
}

function serviceSlugOf(entry: CatalogEntry): string | null {
  return entry.canonicalPath.startsWith("/services/") ? entry.canonicalPath.slice("/services/".length) : null;
}

/** Locations a matrix URL can be built for at the chosen levels. */
export function eligibleLocations(levels: readonly MatrixLevel[], places: readonly AdminLocation[] = allAdminLocations()) {
  const byId = new Map(places.map((place) => [place.id, place]));
  const want = new Set(levels);
  const eligible: { place: AdminLocation; district: AdminLocation; level: MatrixLevel }[] = [];
  const rejected = { unresolvedDistrict: 0, inactiveLocation: 0 };
  const records: Record<string, number> = {};
  const inMatrix: Record<string, number> = {};
  const skippedByConfiguration: Record<string, number> = {};

  for (const place of places) {
    records[place.type] = (records[place.type] ?? 0) + 1;
    const level = LEVEL_FOR_TYPE[place.type];

    if (!level) {
      continue;
    }

    if (!want.has(level)) {
      skippedByConfiguration[level] = (skippedByConfiguration[level] ?? 0) + 1;
      continue;
    }

    if (!place.active) {
      rejected.inactiveLocation += 1;
      continue;
    }

    const district = place.districtId ? byId.get(place.districtId) : undefined;

    if (!district || district.type !== "district") {
      rejected.unresolvedDistrict += 1;
      continue;
    }

    inMatrix[level] = (inMatrix[level] ?? 0) + 1;
    eligible.push({ place, district, level });
  }

  return { eligible, rejected, records, inMatrix, skippedByConfiguration, byId };
}

/**
 * Streams every candidate row. Deterministic order, no hidden state, so an interrupted run can resume
 * by skipping rows it already wrote. Statistics are collected for the whole matrix on every run.
 */
export function* generateMatrix(options: MatrixOptions = {}, stats: MatrixStats = emptyStats(options.levels ?? URL_MATRIX.defaultLevels)): Generator<MatrixRow, MatrixStats> {
  validateLocationHierarchy();

  const levels = options.levels ?? URL_MATRIX.defaultLevels;
  const approvals = options.approvals ?? matrixApprovals;
  const approvalByPath = new Map(approvals.map((approval) => [approval.path, approval]));
  const places = allAdminLocations();
  const state = places.find((place) => place.type === "state");

  if (!state) {
    throw new Error("The location data has no state record.");
  }

  const { offered, heldOut } = matrixEntries();
  const primary = primaryEntryByIntent(offered);
  const covered = confirmedPairs();
  const { eligible, rejected, records, inMatrix, skippedByConfiguration, byId } = eligibleLocations(levels, places);
  const seen = new Set<string>();
  const slugOwners = new Set<string>();

  for (const entry of catalogEntries) {
    if (slugOwners.has(entry.slug)) {
      throw new Error(`Service entry slug "${entry.slug}" is used twice, so matrix paths would collide.`);
    }

    slugOwners.add(entry.slug);
  }

  stats.serviceEntries = {
    total: catalogEntries.length,
    offeredForReview: offered.length,
    unverifiedHeldOut: heldOut.length,
    categories: serviceCategories.length,
    intentGroups: primary.size,
  };
  stats.locationRecords = records;
  stats.locationsInMatrix = inMatrix;
  stats.notGeneratedByConfiguration = Object.fromEntries(
    Object.entries(skippedByConfiguration).map(([level, count]) => [level, count * offered.length]),
  );
  stats.invalidCombinationsRejected.unresolvedDistrict = rejected.unresolvedDistrict * offered.length;
  stats.invalidCombinationsRejected.inactiveLocation = rejected.inactiveLocation * offered.length;
  stats.invalidCombinationsRejected.unverifiedService = eligible.length * heldOut.length;
  stats.invalidCombinationsRejected.total =
    stats.invalidCombinationsRejected.unresolvedDistrict +
    stats.invalidCombinationsRejected.inactiveLocation +
    stats.invalidCombinationsRejected.unverifiedService;
  stats.combinationsConsidered =
    (eligible.length + rejected.unresolvedDistrict + rejected.inactiveLocation) * catalogEntries.length;

  let produced = 0;

  for (const { place, district, level } of eligible) {
    for (const entry of offered) {
      if (options.limit !== undefined && produced >= options.limit) {
        return stats;
      }

      const locationSegment = level === "district" ? null : place.slug;
      const path = matrixPath(entry.slug, district.slug, locationSegment, state.slug);

      if (seen.has(path)) {
        stats.duplicateUrlsRemoved += 1;
        continue;
      }

      seen.add(path);

      const serviceSlug = serviceSlugOf(entry);
      const confirmed = serviceSlug ? covered.has(`${place.slug}:${serviceSlug}`) : false;
      const servedBy = confirmed && serviceSlug ? existingPagePath(serviceSlug, place, byId) : null;
      const role = primary.get(entry.canonicalPath) === entry.id ? "primary" : "variant";
      const approval = approvalByPath.get(path);
      const approvalCheck = approval ? checkApproval(approval) : null;

      let publicationStatus: MatrixStatus;
      let statusReason: string;

      if (approval && approvalCheck?.ok) {
        publicationStatus = "published";
        statusReason = "approved by the business with original content";
      } else if (approval) {
        publicationStatus = "editorial-review";
        statusReason = `approval incomplete: ${approvalCheck?.reasons[0] ?? "unknown"}`;
      } else if (confirmed && servedBy) {
        publicationStatus = "excluded";
        statusReason = `same intent is already served by ${servedBy}`;
      } else if (confirmed) {
        publicationStatus = "needs-content";
        statusReason = "coverage confirmed; original local content is still needed";
      } else if (role === "variant") {
        publicationStatus = "needs-coverage-confirmation";
        statusReason = `no confirmed coverage; same search intent as the primary entry for ${entry.canonicalPath}`;
      } else {
        publicationStatus = "needs-coverage-confirmation";
        statusReason = "no confirmed coverage for this service at this place";
      }

      const row: MatrixRow = {
        id: `${entry.slug}~${place.slug}`,
        path,
        canonicalPath: servedBy ?? path,
        pageType: `service-${level}`,
        serviceEntryId: entry.id,
        serviceSlug: entry.slug,
        categoryId: entry.categoryId,
        searchIntent: entry.searchIntent,
        intentGroup: entry.canonicalPath,
        intentRole: role,
        locationId: place.id,
        locationSlug: place.slug,
        locationType: place.type,
        districtSlug: district.slug,
        parentLocationId: place.parentId,
        coverageStatus: confirmed || approval ? "confirmed" : "unconfirmed",
        contentStatus: approval ? (approvalCheck?.ok ? "complete" : "partial") : "none",
        duplicateCheck: role === "variant" ? "intent-overlap" : "unique",
        indexability: publicationStatus === "published" ? "indexable" : "withheld",
        publicationStatus,
        statusReason,
        sitemapStatus: publicationStatus === "published" ? "included" : "excluded",
        lastMeaningfulUpdate: approval ? approval.content.source.verifiedOn : null,
      };

      produced += 1;
      stats.candidateUrls += 1;
      stats.uniqueCanonicalPaths += 1;
      stats.byStatus[row.publicationStatus] += 1;
      stats.byLevel[level] = (stats.byLevel[level] ?? 0) + 1;
      stats.byIntentRole[role] += 1;
      if (row.coverageStatus === "confirmed") stats.confirmedCoverage += 1;
      if (row.publicationStatus === "published") stats.published += 1;
      if (row.indexability === "indexable") stats.indexable += 1;
      else stats.excludedFromIndexing += 1;
      if (row.publicationStatus === "needs-coverage-confirmation" || row.publicationStatus === "needs-content") {
        stats.awaitingCoverageOrContent += 1;
      }
      if (row.sitemapStatus === "included") stats.sitemapIncluded += 1;

      yield row;
    }
  }

  return stats;
}

/** Runs the whole matrix and returns only the statistics. Used by tests and reports. */
export function summarizeMatrix(options: MatrixOptions = {}): MatrixStats {
  const iterator = generateMatrix(options);
  let step = iterator.next();

  while (!step.done) {
    step = iterator.next();
  }

  return step.value;
}

export type ResolvedMatrixPath = {
  entry: CatalogEntry;
  district: AdminLocation;
  location: AdminLocation | null;
};

let resolver: {
  entries: Map<string, CatalogEntry>;
  state: AdminLocation;
  districts: Map<string, AdminLocation>;
  places: Map<string, AdminLocation>;
} | null = null;

function loadResolver() {
  if (resolver) {
    return resolver;
  }

  const places = allAdminLocations();
  const state = places.find((place) => place.type === "state");

  if (!state) {
    throw new Error("The location data has no state record.");
  }

  resolver = {
    entries: new Map(matrixEntries().offered.map((entry) => [entry.slug, entry])),
    state,
    districts: new Map(places.filter((place) => place.type === "district").map((place) => [place.slug, place])),
    places: new Map(places.map((place) => [place.slug, place])),
  };

  return resolver;
}

/** Resolves a matrix path to its records without building the matrix. Returns null for anything invalid. */
export function resolveMatrixPath(path: string): ResolvedMatrixPath | null {
  const parts = path.split("/").filter(Boolean);

  if ((parts.length !== 3 && parts.length !== 4) || parts.some((part) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(part))) {
    return null;
  }

  const lookup = loadResolver();
  const [entrySlug = "", stateSlug = "", districtSlug = "", locationSlug] = parts;
  const entry = lookup.entries.get(entrySlug);
  const district = lookup.districts.get(districtSlug);

  if (!entry || stateSlug !== lookup.state.slug || !district) {
    return null;
  }

  if (!locationSlug) {
    return { entry, district, location: null };
  }

  const location = lookup.places.get(locationSlug);

  if (!location || location.districtId !== district.id || !LEVEL_FOR_TYPE[location.type] || location.type === "district") {
    return null;
  }

  return { entry, district, location };
}
