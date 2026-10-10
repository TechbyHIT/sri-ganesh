import { describe, expect, it } from "vitest";
import { serviceLocations } from "@/data/serviceLocations";
import type { AdminLocation } from "@/data/types";
import { validateAdminLocationTree } from "@/lib/location-validation";
import {
  assertWithinCapacity,
  assessCandidate,
  buildUrlRegistry,
  resolvePublishedUrl,
  summarizeRegistry,
  takeRegistryBatch,
  URL_CAPACITY,
} from "@/lib/url-registry";

describe("url registry", () => {
  const records = buildUrlRegistry();

  it("keeps one canonical record per URL and stays inside the capacity", () => {
    const summary = summarizeRegistry(records);

    expect(summary.duplicateUrls).toBe(0);
    expect(summary.invalidUrls).toBe(0);
    expect(summary.uniqueUrls).toBe(records.length);
    expect(summary.uniqueUrls).toBeLessThan(URL_CAPACITY);
    expect(summary.gapToCapacity).toBe(URL_CAPACITY - records.length);
    expect(records.every((record) => record.canonicalUrl.endsWith(record.url === "/" ? "" : record.url) || record.url === "/")).toBe(true);
  });

  it("pairs a service with a place only when coverage is confirmed", () => {
    const paired = records.filter((record) => record.pageType === "service-location" || record.pageType === "service-area");

    expect(paired.length).toBe(serviceLocations.filter((row) => row.active).length);
    expect(paired.every((record) => record.serviceCoverage === "confirmed")).toBe(true);
    expect(records.some((record) => record.url.startsWith("/coverage/"))).toBe(false);
  });

  it("withholds mandals and districts instead of indexing them", () => {
    const administrative = records.filter((record) => record.pageType === "mandal" || record.pageType === "district");

    expect(administrative.length).toBeGreaterThan(0);
    expect(administrative.every((record) => record.publicationStatus === "withheld" && record.indexable === false)).toBe(true);
    expect(administrative.every((record) => record.serviceCoverage === "not-offered")).toBe(true);
    expect(administrative.some((record) => record.url.split("/").length >= 4)).toBe(true);
  });

  it("stores starter towns as unconfirmed and skips disputed names", () => {
    const towns = records.filter((record) => record.pageType === "town");

    expect(towns.length).toBe(239);
    expect(towns.every((record) => record.indexable === false && record.serviceCoverage === "not-offered")).toBe(true);
    expect(towns.every((record) => record.publicationStatus === "withheld" && record.url.includes("/towns/"))).toBe(true);
    for (const name of ["addanki", "atmakur", "ponnur", "prathipadu"]) {
      expect(towns.some((record) => record.url.endsWith(`/${name}`))).toBe(false);
    }
    for (const name of ["markapuram", "giddalur", "polavaram"]) {
      expect(records.some((record) => (record.pageType === "district" || record.pageType === "town") && record.url.includes(name))).toBe(false);
    }
  });

  it("resolves only published catalogue paths", () => {
    expect(resolvePublishedUrl("/vijayawada/invisible-grills")?.pageType).toBe("service-location");
    expect(resolvePublishedUrl("/vijayawada/invisible-grills/")?.url).toBe("/vijayawada/invisible-grills");
    expect(resolvePublishedUrl("/vijayawada/sports-nets")).toBeNull();
    expect(resolvePublishedUrl("/locations/tirupati-district/tirupati-rural")).toBeNull();
  });

  it("enforces the registry capacity", () => {
    expect(() => assertWithinCapacity(URL_CAPACITY)).not.toThrow();
    expect(() => assertWithinCapacity(URL_CAPACITY + 1)).toThrow(/capacity/);
    expect(() => assertWithinCapacity(-1)).toThrow(/non-negative/);
  });

  it("resumes the next batch from the cursor", () => {
    const first = takeRegistryBatch(records, null, 2);
    const second = takeRegistryBatch(records, first.nextCursor, 2);

    expect(first.items).toHaveLength(2);
    expect(first.nextCursor).toBe(first.items[1]?.url);
    expect(second.items[0]?.url).not.toBe(first.items[0]?.url);
    expect(() => takeRegistryBatch(records, "/not-a-record", 2)).toThrow(/cursor/);
    expect(() => takeRegistryBatch(records, null, 501)).toThrow(/500/);
  });

  it("returns reasons when a candidate fails the quality gate", () => {
    const quality = assessCandidate({
      publicationStatus: "review",
      allowIndexing: false,
      qualityScore: 10,
      contentReviewed: false,
      localDataVerified: false,
      hasUniqueMetadata: false,
      hasUniqueContent: false,
      hasValidCanonical: false,
      hasInternalLinks: false,
      hasValidSchema: false,
      wordCount: 0,
      minimumRequiredWordCount: 700,
      similarityScore: 1,
    });

    expect(quality.indexable).toBe(false);
    expect(quality.score).toBe(10);
    expect(quality.reasons).toContain("qualityScore");
    expect(quality.reasons).toContain("publicationStatus");
  });
});

describe("administrative hierarchy", () => {
  const state: AdminLocation = {
    id: "state-test",
    name: "Test State",
    slug: "test-state",
    type: "state",
    parentId: null,
    districtId: null,
    mandalId: null,
    aliases: [],
    languageNames: {},
    sourceUrl: "https://example.gov.in",
    verifiedAt: "2026-10-09",
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
  const district: AdminLocation = {
    ...state,
    id: "district-test",
    name: "Test District",
    slug: "test-district",
    type: "district",
    parentId: state.id,
    districtId: "district-test",
  };

  it("rejects invalid parent-child relationships", () => {
    const invalidMandal: AdminLocation = {
      ...district,
      id: "mandal-test",
      name: "Test Mandal",
      slug: "test-mandal",
      type: "mandal",
      parentId: state.id,
      mandalId: "mandal-test",
    };

    expect(() => validateAdminLocationTree([state, district, invalidMandal])).toThrow(/revenue-division parent/);
  });

  it("rejects slug collisions", () => {
    expect(() =>
      validateAdminLocationTree([
        state,
        district,
        { ...district, id: "district-other", districtId: "district-other" },
      ]),
    ).toThrow(/Duplicate location slug/);
  });
});
