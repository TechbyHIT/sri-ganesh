import raw from "../../data/locations/ap/districts.json";
import type { City } from "./cities";
import { cities } from "./cities";
import type { GeoDistrict, GeoDivision, GeoFile, GeoMandal } from "./geo-types";

export const geo = raw as GeoFile;

export const geoDistricts: GeoDistrict[] = geo.districts;

const bySlug = new Map(geoDistricts.map((district) => [district.slug, district]));

const legacyNames: Record<string, string> = {
  "spsr nellore": "nellore",
  "sri potti sriramulu nellore": "nellore",
  nellore: "nellore",
  anantapur: "ananthapuramu",
  anantapuramu: "ananthapuramu",
  "dr. b.r. ambedkar konaseema": "konaseema",
  "b.r. ambedkar konaseema": "konaseema",
  konaseema: "konaseema",
  kadapa: "ysr-kadapa",
  "ysr kadapa": "ysr-kadapa",
  "y.s.r. kadapa": "ysr-kadapa",
  "alluri sitarama raju": "alluri-sitharama-raju",
};

export function getDistrict(slug: string) {
  return bySlug.get(slug);
}

export function districtByName(name: string) {
  const key = name.trim().toLowerCase();
  const alias = legacyNames[key];
  if (alias) return bySlug.get(alias);
  return geoDistricts.find((district) => district.name.toLowerCase() === key || district.slug === key.replace(/[^a-z0-9]+/g, "-"));
}

export function getMandal(districtSlug: string, mandalSlug: string) {
  const district = bySlug.get(districtSlug);
  const mandal = district?.mandals.find((item) => item.slug === mandalSlug);
  return district && mandal ? { district, mandal, division: divisionOf(district, mandal) } : undefined;
}

export function divisionOf(district: GeoDistrict, mandal: GeoMandal): GeoDivision | undefined {
  return mandal.division ? district.divisions.find((division) => division.slug === mandal.division) : undefined;
}

export function mandalsOf(district: GeoDistrict, division?: GeoDivision) {
  if (!division) return district.mandals;
  return division.mandals.flatMap((slug) => district.mandals.filter((mandal) => mandal.slug === slug));
}

export function districtOfCity(city: City) {
  return districtByName(city.district);
}

export function citiesInDistrict(district: GeoDistrict) {
  return cities.filter((city) => districtOfCity(city)?.slug === district.slug);
}

export function hubCityOf(district: GeoDistrict) {
  return cities.find((city) => city.slug === district.hubCity);
}

function squash(value: string) {
  return value.toLowerCase().replace(/\b(urban|rural|town)\b/g, "").replace(/[^a-z]/g, "");
}

export function cityForMandal(district: GeoDistrict, mandal: GeoMandal) {
  const key = squash(mandal.name);
  return citiesInDistrict(district).find((city) => {
    const name = squash(city.name);
    return name === key || (name.length >= 5 && key.length >= 5 && (name.startsWith(key) || key.startsWith(name)) && Math.abs(name.length - key.length) <= 2);
  });
}

export function ulbsForMandal(district: GeoDistrict, mandal: GeoMandal) {
  const key = squash(mandal.name);
  return district.ulbs.filter((ulb) => {
    const name = squash(ulb.name);
    return name === key || (name.length >= 5 && key.length >= 5 && (name.startsWith(key) || key.startsWith(name)) && Math.abs(name.length - key.length) <= 2);
  });
}

export const geoTotals = {
  districts: geoDistricts.length,
  divisions: geoDistricts.reduce((sum, district) => sum + district.divisions.length, 0),
  mandals: geoDistricts.reduce((sum, district) => sum + district.mandals.length, 0),
  ulbs: geoDistricts.reduce((sum, district) => sum + district.ulbs.length, 0),
};

export function districtPath(district: string) {
  return `/locations/andhra-pradesh/districts/${district}`;
}

export function mandalPath(district: string, mandal: string) {
  return `/locations/andhra-pradesh/districts/${district}/${mandal}`;
}

export const ulbLabel = {
  "municipal-corporation": "Municipal corporation",
  municipality: "Municipality",
  "nagar-panchayat": "Nagar panchayat",
} as const;
