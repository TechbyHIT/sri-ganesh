import type { AdminLocation } from "@/data/types";

const verifiedAt = "2026-10-09";
const portal = "https://andhrapradesh.s3waas.gov.in/";

function city(input: {
  slug: string;
  name: string;
  districtId: string;
  sourceUrl: string;
  aliases?: string[];
  serviceAvailable: boolean;
}): AdminLocation {
  return {
    id: `city-${input.slug}`,
    name: input.name,
    slug: input.slug,
    type: "city",
    parentId: input.districtId,
    districtId: input.districtId,
    mandalId: null,
    aliases: input.aliases ?? [],
    languageNames: {},
    sourceUrl: input.sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: input.serviceAvailable,
    indexable: true,
    contentQualityStatus: "published-page",
  };
}

/**
 * These slugs already have pages in data/locations.ts.
 * Parent districts are set only where an official page names the headquarters
 * or the district portal uses the same name as the published city.
 */
export const cities: AdminLocation[] = [
  city({
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    districtId: "district-visakhapatnam",
    sourceUrl: portal,
    aliases: ["Vishakapatnam"],
    serviceAvailable: true,
  }),
  city({
    slug: "vijayawada",
    name: "Vijayawada",
    districtId: "district-ntr",
    sourceUrl: "https://ntr.ap.gov.in/about-district/",
    aliases: ["Bezawada"],
    serviceAvailable: true,
  }),
  city({
    slug: "guntur",
    name: "Guntur",
    districtId: "district-guntur",
    sourceUrl: portal,
    serviceAvailable: true,
  }),
  city({
    slug: "tirupati",
    name: "Tirupati",
    districtId: "district-tirupati",
    sourceUrl: "https://tirupati.ap.gov.in/about-district/",
    serviceAvailable: true,
  }),
  city({
    slug: "rajahmundry",
    name: "Rajahmundry",
    districtId: "district-east-godavari",
    sourceUrl: "https://eastgodavari.ap.gov.in/about-district/",
    aliases: ["Rajamahendravaram", "Rajamandram"],
    serviceAvailable: true,
  }),
  city({
    slug: "kakinada",
    name: "Kakinada",
    districtId: "district-kakinada",
    sourceUrl: portal,
    serviceAvailable: true,
  }),
];
