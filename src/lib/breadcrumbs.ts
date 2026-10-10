import type { Location } from "@/data/locations";
import { getLocationBySlug } from "@/lib/locations";
import {
  locationCityPath,
  locationLocalityPath,
  serviceCityPath,
  serviceLocalityPath,
  servicePath,
} from "@/lib/paths";

export type BreadcrumbItem = {
  href: string;
  label: string;
};

export function serviceBreadcrumbs(service: { slug: string; name: string }): BreadcrumbItem[] {
  return [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: servicePath(service.slug), label: service.name },
  ];
}

export function locationBreadcrumbs(location: Location): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { href: "/", label: "Home" },
    { href: "/locations", label: "Locations" },
  ];

  if (location.type === "locality") {
    const city = getLocationBySlug(location.citySlug);

    if (city) {
      items.push({ href: locationCityPath(city.slug), label: city.name });
    }
  }

  items.push({ href: locationHref(location), label: location.name });
  return items;
}

/**
 * Trail for a service + location URL.
 * Visible crumbs on that page must use this same list.
 */
export function serviceLocationBreadcrumbs(
  service: { slug: string; name: string },
  location: Location,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [{ href: "/", label: "Home" }];

  if (location.type === "locality") {
    const city = getLocationBySlug(location.citySlug);

    if (city) {
      items.push({ href: locationCityPath(city.slug), label: city.name });
    }

    items.push({
      href: locationLocalityPath(location.citySlug, location.slug),
      label: location.name,
    });
    items.push({
      href: serviceLocalityPath(service.slug, location.citySlug, location.slug),
      label: service.name,
    });
    return items;
  }

  items.push({ href: locationCityPath(location.slug), label: location.name });
  items.push({
    href: serviceCityPath(service.slug, location.slug),
    label: service.name,
  });
  return items;
}

function locationHref(location: Location): string {
  if (location.type === "locality") {
    return locationLocalityPath(location.citySlug, location.slug);
  }

  return locationCityPath(location.slug);
}
