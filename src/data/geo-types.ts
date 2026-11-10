export type GeoRegion = "Uttarandhra" | "Coastal Andhra" | "Rayalaseema";

export type UlbType = "municipal-corporation" | "municipality" | "nagar-panchayat";

export type GeoSource = {
  url: string;
  title: string;
  accessed: string;
  covers: string[];
};

export type GeoDivision = {
  slug: string;
  name: string;
  mandals: string[];
};

export type GeoMandal = {
  slug: string;
  name: string;
  division: string | null;
};

export type GeoUlb = {
  slug: string;
  name: string;
  type: UlbType;
};

export type GeoDistrict = {
  slug: string;
  name: string;
  headquarters: string;
  region: GeoRegion;
  hubCity: string;
  officialSite: string;
  divisions: GeoDivision[];
  mandals: GeoMandal[];
  ulbs: GeoUlb[];
  sources: GeoSource[];
  notes: string;
  verified: boolean;
  verifiedAt: string;
};

export type GeoFile = {
  state: { slug: string; name: string };
  generatedAt: string;
  reorganisation: string;
  districts: GeoDistrict[];
};

export type LocalityKind = "village" | "colony" | "apartment" | "locality";

export type Locality = {
  id: string;
  slug: string;
  name: string;
  kind: LocalityKind;
  district: string;
  mandal: string;
  source: string;
  verified: boolean;
  createdAt: string;
};
