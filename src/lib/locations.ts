import {
  locationRecords,
  type City,
  type Locality,
  type Location,
  type LocationRecord,
  type State,
} from "@/data/locations";
import { cities as adminCities } from "@/data/locations/cities";
import { localities as adminLocalities } from "@/data/locations/localities";
import { towns as adminTowns } from "@/data/locations/towns";
import { villages as adminVillages } from "@/data/locations/villages";
import { serviceLocations, type ServiceLocation } from "@/data/serviceLocations";
import type { AdminBreadcrumb, AdminLocation } from "@/data/types";
import { allAdminLocations, validateLocationHierarchy } from "@/lib/location-validation";
import { toLocationSlug } from "@/lib/location-slugs";
import { getServiceBySlug } from "@/lib/services";

function assertLocationData(): void {
  const slugs = new Set<string>();

  for (const location of locationRecords) {
    if (slugs.has(location.slug)) {
      throw new Error(`Duplicate location slug "${location.slug}" in data/locations.ts.`);
    }

    slugs.add(location.slug);

    if (location.type === "locality" && !location.citySlug) {
      throw new Error(`Locality "${location.slug}" is missing a parent citySlug.`);
    }

    if (location.type === "locality") {
      const city = locationRecords.find(
        (item) => item.type === "city" && item.slug === location.citySlug,
      );

      if (!city) {
        throw new Error(
          `Locality "${location.slug}" references unknown city "${location.citySlug}".`,
        );
      }
    }
  }

  for (const relation of serviceLocations) {
    if (!getServiceBySlug(relation.serviceSlug)) {
      throw new Error(
        `serviceLocations references unknown service "${relation.serviceSlug}".`,
      );
    }

    if (!locationRecords.some((location) => location.slug === relation.locationSlug)) {
      throw new Error(
        `serviceLocations references unknown location "${relation.locationSlug}".`,
      );
    }
  }
}

assertLocationData();

function availabilityFor(locationSlug: string): string[] {
  const slugs = serviceLocations
    .filter((relation) => relation.active && relation.locationSlug === locationSlug)
    .map((relation) => relation.serviceSlug);

  return [...new Set(slugs)].filter((slug) => {
    const service = getServiceBySlug(slug);
    return Boolean(service?.active);
  });
}

function toLocation(record: LocationRecord): Location {
  return {
    ...record,
    serviceAvailability: availabilityFor(record.slug),
  };
}

const allLocations = locationRecords.map(toLocation);
const locationsBySlug = new Map(allLocations.map((location) => [location.slug, location]));
const cities = allLocations.filter((location): location is City => location.type === "city");
const citiesBySlug = new Map(cities.map((city) => [city.slug, city]));
const localities = allLocations.filter((location): location is Locality => location.type === "locality");
const localitiesByCity = new Map<string, Locality[]>();

for (const locality of localities) {
  const group = localitiesByCity.get(locality.citySlug) ?? [];
  group.push(locality);
  localitiesByCity.set(locality.citySlug, group);
}

const activeCities = cities.filter((city) => city.active);
const activeLocalities = localities.filter((locality) => locality.active);
const serviceSlugsByLocation = new Map<string, Set<string>>();

for (const relation of serviceLocations) {
  if (!relation.active) {
    continue;
  }

  const slugs = serviceSlugsByLocation.get(relation.serviceSlug) ?? new Set<string>();
  slugs.add(relation.locationSlug);
  serviceSlugsByLocation.set(relation.serviceSlug, slugs);
}

const locationsByService = new Map<string, Location[]>();

for (const [serviceSlug, slugs] of serviceSlugsByLocation) {
  locationsByService.set(
    serviceSlug,
    allLocations.filter((location) => location.active && slugs.has(location.slug)),
  );
}

const serviceLocationByPair = new Map<string, ServiceLocation>();

for (const relation of serviceLocations) {
  if (!relation.active) {
    continue;
  }

  serviceLocationByPair.set(`${relation.serviceSlug}:${relation.locationSlug}`, relation);
}

export function getAllLocations(): Location[] {
  return allLocations;
}

export function getState(): State | undefined {
  return allLocations.find((location): location is State => location.type === "state");
}

export function getCities(): City[] {
  return cities;
}

export function getLocalities(): Locality[] {
  return localities;
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locationsBySlug.get(slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return citiesBySlug.get(slug);
}

export function getLocalitiesByCity(citySlug: string): Locality[] {
  return localitiesByCity.get(citySlug) ?? [];
}

export function getLocationsByService(serviceSlug: string): Location[] {
  return [...(locationsByService.get(serviceSlug) ?? [])].sort(
    (left, right) => cityRank(left.slug) - cityRank(right.slug),
  );
}

export function getServiceLocation(
  serviceSlug: string,
  locationSlug: string,
): ServiceLocation | undefined {
  return serviceLocationByPair.get(`${serviceSlug}:${locationSlug}`);
}

export function getActiveCities(): City[] {
  return [...activeCities].sort((left, right) => cityRank(left.slug) - cityRank(right.slug));
}

function cityRank(slug: string): number {
  return slug === "vijayawada" ? 0 : 1;
}

export function getActiveLocalities(): Locality[] {
  return activeLocalities;
}

const adminLocations = allAdminLocations();
const adminById = new Map(adminLocations.map((location) => [location.id, location]));
const adminBySlug = new Map(adminLocations.map((location) => [location.slug, location]));
const childrenByParent = new Map<string, AdminLocation[]>();

for (const location of adminLocations) {
  if (!location.parentId) {
    continue;
  }

  const group = childrenByParent.get(location.parentId) ?? [];
  group.push(location);
  childrenByParent.set(location.parentId, group);
}

export function getAllDistricts(): AdminLocation[] {
  return districtsFromAdmin();
}

export function getDistrictBySlug(slug: string): AdminLocation | undefined {
  const district = adminBySlug.get(slug);
  return district?.type === "district" ? district : undefined;
}

export function getRevenueDivisionsByDistrict(districtId: string): AdminLocation[] {
  return adminLocations.filter((location) => location.type === "revenue-division" && location.districtId === districtId);
}

export function getMandalsByDistrict(districtId: string): AdminLocation[] {
  return adminLocations.filter((location) => location.type === "mandal" && location.districtId === districtId);
}

export function getCitiesByDistrict(districtId: string): AdminLocation[] {
  return adminCities.filter((city) => city.districtId === districtId);
}

export function getTownsByDistrict(districtId: string): AdminLocation[] {
  return adminTowns.filter((town) => town.districtId === districtId);
}

export function getTownsByMandal(mandalId: string): AdminLocation[] {
  return adminTowns.filter((town) => town.mandalId === mandalId || town.parentId === mandalId);
}

export function countVillagesByDistrict(districtId: string): number {
  return adminVillages.filter((village) => village.districtId === districtId).length;
}

export function getLocalitiesByCityId(cityId: string): AdminLocation[] {
  return adminLocalities.filter((locality) => locality.parentId === cityId);
}

export function getAdminLocationBySlug(slug: string): AdminLocation | undefined {
  return adminBySlug.get(slug);
}

export function getLocationAncestors(locationId: string): AdminLocation[] {
  const ancestors: AdminLocation[] = [];
  let current = adminById.get(locationId)?.parentId;

  while (current) {
    const parent = adminById.get(current);

    if (!parent) {
      break;
    }

    ancestors.push(parent);
    current = parent.parentId;
  }

  return ancestors.reverse();
}

export function getLocationBreadcrumbs(locationId: string): AdminBreadcrumb[] {
  const location = adminById.get(locationId);

  if (!location) {
    return [];
  }

  return [...getLocationAncestors(locationId), location].map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    href: breadcrumbHref(item),
  }));
}

export function getChildLocations(locationId: string): AdminLocation[] {
  return childrenByParent.get(locationId) ?? [];
}

export function searchLocations(query: string): AdminLocation[] {
  const needle = query.trim().toLowerCase();

  if (needle.length < 2) {
    return [];
  }

  const needleSlug = toLocationSlug(query);

  return adminLocations.filter((location) => {
    const haystack = [
      location.name,
      location.slug,
      ...location.aliases,
      location.languageNames.te ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle) || (needleSlug.length > 1 && location.slug.includes(needleSlug));
  });
}

export function getVerifiedServiceAreas(serviceSlug: string): Location[] {
  return getLocationsByService(serviceSlug);
}

export { validateLocationHierarchy };

function districtsFromAdmin(): AdminLocation[] {
  return adminLocations.filter((location) => location.type === "district" && location.active);
}

function breadcrumbHref(location: AdminLocation): string | null {
  if (location.type === "state") {
    return "/locations";
  }

  if (!location.indexable) {
    return null;
  }

  if (location.type === "city") {
    return `/locations/${location.slug}`;
  }

  if (location.type === "locality" && location.parentId) {
    const city = adminById.get(location.parentId);
    return city ? `/locations/${city.slug}/${location.slug}` : null;
  }

  return null;
}

validateLocationHierarchy();
