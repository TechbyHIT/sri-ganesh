export function servicePath(serviceSlug: string): string {
  return `/services/${serviceSlug}`;
}

export function locationCityPath(citySlug: string): string {
  return `/locations/${citySlug}`;
}

export function locationLocalityPath(citySlug: string, localitySlug: string): string {
  return `/locations/${citySlug}/${localitySlug}`;
}

export function serviceCityPath(serviceSlug: string, citySlug: string): string {
  return `/${citySlug}/${serviceSlug}`;
}

export function serviceLocalityPath(
  serviceSlug: string,
  citySlug: string,
  localitySlug: string,
): string {
  return `/${citySlug}/${localitySlug}/${serviceSlug}`;
}

export function legacyServiceCityPath(serviceSlug: string, citySlug: string): string {
  return `/services/${serviceSlug}/${citySlug}`;
}

export function legacyServiceLocalityPath(
  serviceSlug: string,
  citySlug: string,
  localitySlug: string,
): string {
  return `/services/${serviceSlug}/${citySlug}/${localitySlug}`;
}

export function cityAnchor(citySlug: string): string {
  return locationCityPath(citySlug);
}
