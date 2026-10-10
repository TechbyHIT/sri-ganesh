import type { AdminLocation } from "@/data/types";
import { serviceLocations } from "@/data/serviceLocations";
import { site } from "@/data/site";
import { PUBLISHING } from "@/config/publishing";
import { findOrphanPages } from "@/lib/internal-links";
import { allAdminLocations, validateLocationHierarchy } from "@/lib/location-validation";
import { locationCityPath, locationLocalityPath } from "@/lib/paths";
import { buildDraftRecords, countDraftsByType, type DraftRecord } from "@/lib/publishing/drafts";
import { generateCanonicalUrl } from "@/lib/seo";
import { summarizeCatalog, validateCatalog, type CatalogSummary } from "@/lib/service-catalog";
import { getIndexableEntries } from "@/lib/sitemap-data";
import { indexabilityGaps, isPageIndexable } from "@/lib/seo/is-page-indexable";
import { wordCount } from "@/lib/seo/similarity";
import { getSitemapSegments } from "@/lib/sitemap-data";
import { getAllServices } from "@/lib/services";
import type { PageIndexabilityInput } from "@/types/page";

export const URL_CAPACITY = 50000;

export type ServiceCoverageStatus = "confirmed" | "not-offered" | "not-applicable";

export type UrlPublicationStatus = "published" | "draft" | "withheld";

export type UrlQuality = {
  score: number;
  indexable: boolean;
  reasons: string[];
};

export type UrlRecord = {
  id: string;
  url: string;
  pageType: string;
  serviceId: string | null;
  locationId: string | null;
  parentLocationId: string | null;
  active: boolean;
  serviceCoverage: ServiceCoverageStatus;
  contentQualityStatus: string;
  indexable: boolean;
  canonicalUrl: string;
  lastModified: string;
  publicationStatus: UrlPublicationStatus;
  score: number;
  reasons: string[];
};

export type RegistryBatch = {
  items: UrlRecord[];
  nextCursor: string | null;
};

export type RegistrySummary = {
  capacity: number;
  verifiedLocationsByType: Record<string, number>;
  activeServices: number;
  confirmedServiceLocations: number;
  candidateUrls: number;
  uniqueUrls: number;
  indexableUrls: number;
  noindexUrls: number;
  invalidUrls: number;
  duplicateUrls: number;
  thinContentUrls: number;
  missingData: string[];
  orphanPages: number;
  sitemapUrls: number;
  gapToCapacity: number;
  draftsByType: Record<string, number>;
  serviceCatalog: CatalogSummary;
};

const confirmedCoverage = new Set(
  serviceLocations.filter((row) => row.active).map((row) => `${row.locationSlug}:${row.serviceSlug}`),
);

export function assessCandidate(input: PageIndexabilityInput): UrlQuality {
  const reasons = indexabilityGaps(input);

  if (input.publicationStatus !== "published") {
    reasons.unshift("publicationStatus");
  }

  return {
    score: input.qualityScore,
    indexable: isPageIndexable(input),
    reasons,
  };
}

export function buildUrlRegistry(): UrlRecord[] {
  validateLocationHierarchy();
  validateCatalog(new Set(getIndexableEntries().map((entry) => entry.path)));

  const places = allAdminLocations();
  const byId = new Map(places.map((place) => [place.id, place]));
  const bySlug = new Map(places.map((place) => [place.slug, place]));
  const servicesBySlug = new Map(getAllServices().map((service) => [service.slug, service.id]));
  const drafts = buildDraftRecords();
  const titleCounts = countValues(drafts.map((draft) => draft.title));
  const h1Counts = countValues(drafts.map((draft) => draft.h1));
  const seen = new Set<string>();
  const records: UrlRecord[] = [];

  for (const draft of drafts) {
    const record = fromDraft(
      draft,
      bySlug,
      servicesBySlug,
      titleCounts.get(draft.title) === 1 && h1Counts.get(draft.h1) === 1,
    );

    if (seen.has(record.url)) {
      throw new Error(`Duplicate URL candidate "${record.url}".`);
    }

    seen.add(record.url);
    records.push(record);
  }

  for (const place of places) {
    if (place.type === "state") {
      continue;
    }

    const path = pathForPlace(place, byId);

    if (!path || seen.has(path)) {
      continue;
    }

    seen.add(path);
    records.push(withheldPlace(place, path));
  }

  assertWithinCapacity(records.length);
  return records;
}

export function assertWithinCapacity(count: number): void {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error("URL record count must be a non-negative integer.");
  }

  if (count > URL_CAPACITY) {
    throw new Error(`URL registry exceeds its ${URL_CAPACITY}-record capacity.`);
  }
}

export function resolvePublishedUrl(path: string): UrlRecord | null {
  const normalized = normalizeRegistryPath(path);
  const record = buildUrlRegistry().find((candidate) => candidate.url === normalized);

  if (!record || !record.active || record.publicationStatus !== "published") {
    return null;
  }

  return record;
}

export function takeRegistryBatch(records: readonly UrlRecord[], cursor: string | null, batchSize: number): RegistryBatch {
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > PUBLISHING.maxBatchSize) {
    throw new Error(`Batch size must be an integer from 1 to ${PUBLISHING.maxBatchSize}.`);
  }

  const ordered = [...records].sort((left, right) => left.url.localeCompare(right.url));
  const start = cursor ? ordered.findIndex((record) => record.url === cursor) + 1 : 0;

  if (cursor && start === 0) {
    throw new Error(`Unknown registry cursor "${cursor}".`);
  }

  const items = ordered.slice(start, start + batchSize);
  const nextCursor = start + items.length < ordered.length ? (items[items.length - 1]?.url ?? null) : null;

  return { items, nextCursor };
}

export function summarizeRegistry(records: readonly UrlRecord[] = buildUrlRegistry()): RegistrySummary {
  const urls = records.map((record) => record.url);
  const uniqueUrls = new Set(urls).size;
  const places = allAdminLocations();
  const verifiedLocationsByType: Record<string, number> = {
    state: 0,
    district: 0,
    "revenue-division": 0,
    mandal: 0,
    city: 0,
    town: 0,
    village: 0,
    ward: 0,
    locality: 0,
  };

  for (const place of places) {
    verifiedLocationsByType[place.type] = (verifiedLocationsByType[place.type] ?? 0) + 1;
  }

  const orphans = findOrphanPages();
  const orphanPages = orphans.services.length + orphans.locations.length + orphans.serviceLocations.length;
  const sitemapUrls = getSitemapSegments().reduce((total, segment) => total + segment.length, 0);
  const missingData = missingVerifiedData(verifiedLocationsByType);

  return {
    capacity: URL_CAPACITY,
    verifiedLocationsByType,
    activeServices: getAllServices().length,
    confirmedServiceLocations: serviceLocations.filter((row) => row.active).length,
    candidateUrls: records.length,
    uniqueUrls,
    indexableUrls: records.filter((record) => record.indexable).length,
    noindexUrls: records.filter((record) => !record.indexable).length,
    invalidUrls: 0,
    duplicateUrls: records.length - uniqueUrls,
    thinContentUrls: records.filter((record) => record.reasons.some((reason) => reason === "wordCount" || reason === "hasUniqueContent" || reason === "qualityScore")).length,
    missingData,
    orphanPages,
    sitemapUrls,
    gapToCapacity: URL_CAPACITY - uniqueUrls,
    draftsByType: countDraftsByType(buildDraftRecords()),
    serviceCatalog: summarizeCatalog(),
  };
}

function fromDraft(
  draft: DraftRecord,
  bySlug: Map<string, AdminLocation>,
  servicesBySlug: Map<string, string>,
  hasUniqueMetadata: boolean,
): UrlRecord {
  const place = draft.locationSlug ? bySlug.get(draft.locationSlug) : undefined;
  const coverage = coverageFor(draft);
  const catalogueIndexable = isCatalogueIndexable(draft, coverage);
  const quality = assessCandidate({
    publicationStatus: catalogueIndexable ? "published" : "review",
    allowIndexing: catalogueIndexable,
    qualityScore: draft.qualityScore,
    contentReviewed: catalogueIndexable,
    localDataVerified: draft.localDataVerified,
    hasUniqueMetadata: Boolean(
      hasUniqueMetadata && draft.title.trim() && draft.metaDescription.trim() && draft.h1.trim(),
    ),
    hasUniqueContent: draft.body.trim().length > 80,
    hasValidCanonical: draft.path.startsWith("/") && !draft.path.includes("//"),
    hasInternalLinks: catalogueIndexable,
    hasValidSchema: catalogueIndexable,
    wordCount: wordCount(draft.body),
    minimumRequiredWordCount: draft.minimumWordCount,
    similarityScore: catalogueIndexable ? 0.2 : 1,
  });

  return {
    id: `url-${draft.pageType}-${draft.slug}`,
    url: draft.path,
    pageType: draft.pageType,
    serviceId: draft.serviceSlug ? (servicesBySlug.get(draft.serviceSlug) ?? null) : null,
    locationId: place?.id ?? null,
    parentLocationId: place?.parentId ?? null,
    active: true,
    serviceCoverage: coverage,
    contentQualityStatus: place?.contentQualityStatus ?? (catalogueIndexable ? "published-page" : "unconfirmed"),
    indexable: quality.indexable,
    canonicalUrl: generateCanonicalUrl(draft.path),
    lastModified: site.contentUpdated,
    publicationStatus: catalogueIndexable ? "published" : "draft",
    score: quality.score,
    reasons: quality.reasons,
  };
}

function withheldPlace(place: AdminLocation, path: string): UrlRecord {
  const quality = assessCandidate({
    publicationStatus: "review",
    allowIndexing: false,
    qualityScore: 0,
    contentReviewed: false,
    localDataVerified: false,
    hasUniqueMetadata: false,
    hasUniqueContent: false,
    hasValidCanonical: true,
    hasInternalLinks: false,
    hasValidSchema: false,
    wordCount: 0,
    minimumRequiredWordCount: PUBLISHING.wordTargets.location,
    similarityScore: 1,
  });

  return {
    id: `url-${place.id}`,
    url: path,
    pageType: place.type,
    serviceId: null,
    locationId: place.id,
    parentLocationId: place.parentId,
    active: place.active,
    serviceCoverage: "not-offered",
    contentQualityStatus: place.contentQualityStatus,
    indexable: false,
    canonicalUrl: generateCanonicalUrl(path),
    lastModified: place.verifiedAt,
    publicationStatus: "withheld",
    score: quality.score,
    reasons: ["no confirmed service coverage", ...quality.reasons],
  };
}

function coverageFor(draft: DraftRecord): ServiceCoverageStatus {
  if (!draft.serviceSlug || !draft.locationSlug) {
    return "not-applicable";
  }

  if (confirmedCoverage.has(`${draft.locationSlug}:${draft.serviceSlug}`)) {
    return "confirmed";
  }

  return "not-offered";
}

function isCatalogueIndexable(draft: DraftRecord, coverage: ServiceCoverageStatus): boolean {
  if (draft.pageType === "service-location" || draft.pageType === "service-area") {
    return coverage === "confirmed" && draft.localDataVerified && draft.qualityScore >= 70 && draft.body.trim().length > 0;
  }

  if (draft.pageType === "service" || draft.pageType === "location" || draft.pageType === "area") {
    return draft.localDataVerified && draft.qualityScore >= 70 && draft.body.trim().length > 0;
  }

  return draft.qualityScore >= 70 && draft.body.trim().length > 0 && draft.pageType === "core";
}

function pathForPlace(place: AdminLocation, byId: Map<string, AdminLocation>): string | null {
  if (place.type === "locality") {
    const city = place.parentId ? byId.get(place.parentId) : undefined;

    if (!city || city.type !== "city") {
      return null;
    }

    return locationLocalityPath(city.slug, place.slug);
  }

  if (place.type === "city" || place.type === "district") {
    return locationCityPath(place.slug);
  }

  const district = place.districtId ? byId.get(place.districtId) : undefined;

  if (!district || district.type !== "district") {
    return null;
  }

  if (place.type === "revenue-division" || place.type === "mandal") {
    return `/locations/${district.slug}/${place.slug}`;
  }

  if (place.type === "town" || place.type === "village") {
    const mandal = place.mandalId ? byId.get(place.mandalId) : undefined;

    if (mandal?.type === "mandal") {
      return `/locations/${district.slug}/${mandal.slug}/${place.slug}`;
    }

    if (place.type === "town" && place.mandalId === null) {
      return `/locations/${district.slug}/towns/${place.slug}`;
    }

    return null;
  }

  if (place.type === "ward") {
    const city = place.parentId ? byId.get(place.parentId) : undefined;

    if (!city || city.type !== "city") {
      return null;
    }

    return `/locations/${city.slug}/wards/${place.slug}`;
  }

  return null;
}

function countValues(values: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function normalizeRegistryPath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0]?.trim() || "/";
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, "/");
  return collapsed === "/" ? "/" : collapsed.replace(/\/$/, "");
}

function missingVerifiedData(counts: Record<string, number>): string[] {
  const gaps: string[] = [];

  if ((counts.town ?? 0) === 0) {
    gaps.push("Towns: no official municipal table was stable enough to import.");
  } else {
    gaps.push(
      "Towns: the district-wise starter list is stored as unconfirmed towns under the listed district. They are not mandals, not service areas, and not indexable. Addanki, Atmakur, Ponnur, and Prathipadu were named under more than one district and were not imported. Markapuram and Polavaram were not imported.",
    );
  }

  if ((counts.village ?? 0) === 0) {
    gaps.push("Villages: the Local Government Directory village download was not imported. A third-party dump listed 28 districts, which disagrees with the 26 districts on the Andhra Pradesh District Portal.");
  } else {
    gaps.push(
      "Villages: 16,613 revenue villages from the Local Government Directory download of 9 October 2026 are stored for the 26 districts on the Andhra Pradesh District Portal. Markapuram (510 villages) and Polavaram (834 villages) were listed in that download and were not imported. Earlier district-site gram-panchayat rows were replaced by this list. These records are not service pages.",
    );
  }

  if ((counts.mandal ?? 0) > 0) {
    gaps.push(
      "Mandals: district-site lists remain, and the 9 October 2026 Local Government Directory added the subdistricts those sites did not already name, including Alluri Sitharama Raju and YSR Kadapa. Markapuram (21 subdistricts) and Polavaram (12 subdistricts) were not imported. A mandal without a named revenue division is stored under its district.",
    );
  }

  if ((counts.ward ?? 0) === 0) {
    gaps.push("Wards: no official urban-local-body ward list with stable parent mappings was imported.");
  }
  gaps.push("Service coverage: a service and place are paired only when data/serviceLocations.ts confirms it. Unconfirmed pairs are not URLs.");

  return gaps;
}
