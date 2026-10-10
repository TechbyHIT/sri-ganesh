import type { AdminLocation } from "@/data/types";

const verifiedAt = "2026-10-09";

function division(
  id: string,
  name: string,
  slug: string,
  districtId: string,
  sourceUrl: string,
  aliases: string[] = [],
): AdminLocation {
  return {
    id,
    name,
    slug,
    type: "revenue-division",
    parentId: districtId,
    districtId,
    mandalId: null,
    aliases,
    languageNames: {},
    sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
}

const tirupatiSource = "https://tirupati.ap.gov.in/revenue-division/";
const ntrSource = "https://ntr.ap.gov.in/about-district/";

export const revenueDivisions: AdminLocation[] = [
  division(
    "division-srikalahasthi",
    "Srikalahasthi",
    "srikalahasthi-division",
    "district-tirupati",
    tirupatiSource,
    ["Srikalahasti"],
  ),
  division(
    "division-sullurpet",
    "Sullurpet",
    "sullurpet-division",
    "district-tirupati",
    tirupatiSource,
  ),
  division(
    "division-tirupati",
    "Tirupati",
    "tirupati-division",
    "district-tirupati",
    tirupatiSource,
  ),
  division(
    "division-vijayawada",
    "Vijayawada",
    "vijayawada-division",
    "district-ntr",
    ntrSource,
    ["Vijayawda"],
  ),
  division(
    "division-nandigama",
    "Nandigama",
    "nandigama-division",
    "district-ntr",
    ntrSource,
  ),
  division(
    "division-tiruvuru",
    "Tiruvuru",
    "tiruvuru-division",
    "district-ntr",
    ntrSource,
  ),
];
