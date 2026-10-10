import { locationRecords } from "@/data/locations";
import { cities } from "@/data/locations/cities";
import { andhraPradesh, districts } from "@/data/locations/districts";
import { localities } from "@/data/locations/localities";
import { mandals } from "@/data/locations/mandals";
import { revenueDivisions } from "@/data/locations/revenue-divisions";
import { towns } from "@/data/locations/towns";
import { villages } from "@/data/locations/villages";
import { wards } from "@/data/locations/wards";
import { officialMandals, officialRevenueDivisions } from "@/data/locations/official-mandals";
import { lgdMandals } from "@/data/locations/lgd-mandals";
import { remainingMandals, remainingRevenueDivisions } from "@/data/locations/remaining-areas";
import { serviceLocations } from "@/data/serviceLocations";
import type { AdminLocation, AdminLocationType } from "@/data/types";
import { toLocationSlug } from "@/lib/location-slugs";

const parentType: Record<AdminLocationType, AdminLocationType | null> = {
  state: null,
  district: "state",
  "revenue-division": "district",
  mandal: "revenue-division",
  city: "district",
  town: "mandal",
  village: "mandal",
  ward: "city",
  locality: "city",
};

export function allAdminLocations(): AdminLocation[] {
  return [
    andhraPradesh,
    ...districts,
    ...revenueDivisions,
    ...officialRevenueDivisions,
    ...remainingRevenueDivisions,
    ...mandals,
    ...officialMandals,
    ...remainingMandals,
    ...lgdMandals,
    ...cities,
    ...towns,
    ...villages,
    ...wards,
    ...localities,
  ];
}

export function validateLocationHierarchy(): void {
  const records = allAdminLocations();
  validateAdminLocationTree(records);
  const seoPlaces = locationRecords.filter((place) => place.type === "city" || place.type === "locality");

  for (const place of seoPlaces) {
    const admin = records.find((record) => record.slug === place.slug && (record.type === "city" || record.type === "locality"));

    if (!admin) {
      throw new Error(`Published catalogue place "${place.slug}" is missing from the admin location files.`);
    }

    if (admin.active !== place.active || admin.indexable !== place.indexable) {
      throw new Error(`Admin record "${place.slug}" does not match the catalogue active/indexable flags.`);
    }

    const covered = serviceLocations.some((relation) => relation.active && relation.locationSlug === place.slug);

    if (admin.serviceAvailable !== covered) {
      throw new Error(`serviceAvailable for "${place.slug}" does not match serviceLocations.`);
    }
  }

  for (const relation of serviceLocations) {
    if (!locationRecords.some((place) => place.slug === relation.locationSlug)) {
      throw new Error(`serviceLocations uses unknown location "${relation.locationSlug}".`);
    }
  }
}

export function validateAdminLocationTree(records: readonly AdminLocation[]): void {
  const byId = new Map<string, AdminLocation>();
  const slugs = new Set<string>();

  for (const record of records) {
    if (byId.has(record.id)) {
      throw new Error(`Duplicate location id "${record.id}".`);
    }

    byId.set(record.id, record);

    if (slugs.has(record.slug)) {
      throw new Error(`Duplicate location slug "${record.slug}".`);
    }

    slugs.add(record.slug);
  }

  for (const record of records) {
    const expectedParent = parentType[record.type];
    const parent = record.parentId ? byId.get(record.parentId) : undefined;

    if (record.type === "town" && record.mandalId === null) {
      if (!parent || parent.type !== "district" || parent.id !== record.districtId) {
        throw new Error(`${record.id} is a town without a mandal and must use its district as parent.`);
      }
    } else if (record.type === "mandal" && parent?.type === "district" && parent.id === record.districtId) {
      // The district page named the mandal and did not name its revenue division.
    } else if (expectedParent === null) {
      if (record.parentId) {
        throw new Error(`${record.id} is a state and cannot have a parent.`);
      }
    } else if (!parent || parent.type !== expectedParent) {
      throw new Error(`${record.id} must have a ${expectedParent} parent.`);
    }

    if (record.type === "district" && record.districtId !== record.id) {
      throw new Error(`${record.id} must point districtId at itself.`);
    }

    if (record.type === "mandal" && record.mandalId !== record.id) {
      throw new Error(`${record.id} must point mandalId at itself.`);
    }

    if (record.districtId && record.type !== "state") {
      const district = byId.get(record.districtId);

      if (!district || district.type !== "district") {
        throw new Error(`${record.id} has an invalid districtId.`);
      }
    }

    if (parent?.districtId && record.districtId && parent.districtId !== record.districtId && parent.type !== "state") {
      throw new Error(`${record.id} districtId does not match its parent.`);
    }

    for (const alias of record.aliases) {
      const aliasSlug = toLocationSlug(alias);

      if (aliasSlug && aliasSlug !== record.slug && slugs.has(aliasSlug)) {
        throw new Error(`Alias "${alias}" on ${record.id} collides with another slug.`);
      }
    }
  }
}
