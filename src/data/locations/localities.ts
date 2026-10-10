import type { AdminLocation, ContentQualityStatus } from "@/data/types";

const verifiedAt = "2026-10-09";

function locality(input: {
  slug: string;
  name: string;
  cityId: string;
  districtId: string;
  active: boolean;
  serviceAvailable: boolean;
  indexable: boolean;
}): AdminLocation {
  const status: ContentQualityStatus = input.active ? "published-page" : "inactive";

  return {
    id: `locality-${input.slug}`,
    name: input.name,
    slug: input.slug,
    type: "locality",
    parentId: input.cityId,
    districtId: input.districtId,
    mandalId: null,
    aliases: [],
    languageNames: {},
    sourceUrl: "",
    verifiedAt,
    active: input.active,
    serviceAvailable: input.serviceAvailable,
    indexable: input.indexable,
    contentQualityStatus: status,
  };
}

/**
 * Neighbourhoods already stored in data/locations.ts.
 * sourceUrl is blank because no official colony list was imported for them.
 */
export const localities: AdminLocation[] = [
  locality({
    slug: "madhurawada",
    name: "Madhurawada",
    cityId: "city-visakhapatnam",
    districtId: "district-visakhapatnam",
    active: true,
    serviceAvailable: true,
    indexable: true,
  }),
  locality({
    slug: "gajuwaka",
    name: "Gajuwaka",
    cityId: "city-visakhapatnam",
    districtId: "district-visakhapatnam",
    active: true,
    serviceAvailable: true,
    indexable: true,
  }),
  locality({
    slug: "mvp-colony",
    name: "MVP Colony",
    cityId: "city-visakhapatnam",
    districtId: "district-visakhapatnam",
    active: false,
    serviceAvailable: false,
    indexable: false,
  }),
  locality({
    slug: "benz-circle",
    name: "Benz Circle",
    cityId: "city-vijayawada",
    districtId: "district-ntr",
    active: false,
    serviceAvailable: false,
    indexable: false,
  }),
  locality({
    slug: "governorpet",
    name: "Governorpet",
    cityId: "city-vijayawada",
    districtId: "district-ntr",
    active: false,
    serviceAvailable: false,
    indexable: false,
  }),
  locality({
    slug: "korlagunta",
    name: "Korlagunta",
    cityId: "city-tirupati",
    districtId: "district-tirupati",
    active: false,
    serviceAvailable: false,
    indexable: false,
  }),
];
