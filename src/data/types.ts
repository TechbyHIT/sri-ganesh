import type {
  City,
  Locality,
  Location,
  LocationRecord,
  LocationType,
  State,
} from "@/data/locations";

export type { City, Locality, Location, LocationRecord, LocationType, State };

export type AdminLocationType =
  | "state"
  | "district"
  | "revenue-division"
  | "mandal"
  | "city"
  | "town"
  | "village"
  | "ward"
  | "locality";

export type ContentQualityStatus =
  | "published-page"
  | "administrative-record"
  | "unconfirmed"
  | "inactive";

export type LanguageNames = {
  te?: string;
};

/**
 * One administrative or neighbourhood record.
 * indexable is not permission to mint a new URL. A true value must match
 * an existing page in data/locations.ts with the same slug.
 */
export type AdminLocation = {
  id: string;
  name: string;
  slug: string;
  type: AdminLocationType;
  parentId: string | null;
  districtId: string | null;
  mandalId: string | null;
  aliases: string[];
  languageNames: LanguageNames;
  sourceUrl: string;
  verifiedAt: string;
  active: boolean;
  serviceAvailable: boolean;
  indexable: boolean;
  contentQualityStatus: ContentQualityStatus;
};

export type AdminBreadcrumb = {
  id: string;
  name: string;
  slug: string;
  href: string | null;
};

export type LocationSource = {
  id: string;
  name: string;
  url: string;
  level: string;
  verifiedAt: string;
  knownGaps: string;
  validationStatus: "verified" | "partial" | "not-imported";
};
