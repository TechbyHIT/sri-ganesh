import { serviceLocations } from "@/data/serviceLocations";
import type { Location } from "@/data/locations";
import {
  locationBreadcrumbs,
  serviceBreadcrumbs,
  serviceLocationBreadcrumbs,
  type BreadcrumbItem,
} from "@/lib/breadcrumbs";
import {
  getActiveCities,
  getActiveLocalities,
  getLocalitiesByCity,
  getLocationBySlug,
  getLocationsByService,
  getServiceLocation,
} from "@/lib/locations";
import {
  locationCityPath,
  locationLocalityPath,
  serviceCityPath,
  serviceLocalityPath,
  servicePath,
} from "@/lib/paths";
import { getAllServices, getRelatedServices as getCuratedRelatedServices, getServiceBySlug } from "@/lib/services";

export type LinkSection =
  | "related-services"
  | "service-areas"
  | "nearby-locations"
  | "popular-services"
  | "explore-more";

export type InternalLink = {
  href: string;
  label: string;
  section: LinkSection;
};

export type LinkGroup = {
  id: LinkSection;
  title: string;
  links: InternalLink[];
};

export type OrphanReport = {
  services: string[];
  locations: string[];
  serviceLocations: string[];
};

const limits = {
  relatedServices: 3,
  serviceAreas: 4,
  nearby: 4,
  localities: 4,
  popularServices: 4,
} as const;

const servicePhrase: Record<string, string> = {
  "invisible-grills": "invisible grill",
  "balcony-safety-nets": "balcony safety net",
  "cloth-hangers": "cloth hanger",
  "sports-nets": "sports net",
  "safety-spikes": "safety spike",
  "duct-area-nets": "duct area net",
  "building-covering": "building covering",
};

const sectionTitle: Record<LinkSection, string> = {
  "related-services": "Related services",
  "service-areas": "Service areas",
  "nearby-locations": "Nearby locations",
  "popular-services": "Popular services",
  "explore-more": "Explore more",
};

export function getRelatedServices(serviceSlug: string): InternalLink[] {
  return getCuratedRelatedServices(serviceSlug)
    .slice(0, limits.relatedServices)
    .map((service) =>
      link(
        servicePath(service.slug),
        `View our ${phrase(service.slug, service.name)} solutions.`,
        "related-services",
      ),
    );
}

export function getRelatedLocations(serviceSlug: string): InternalLink[] {
  const service = getServiceBySlug(serviceSlug);

  if (!service?.active) {
    return [];
  }

  const locations = getLocationsByService(service.slug).filter((location) => location.indexable);
  const ordered = [
    ...locations.filter((location) => location.type === "city"),
    ...locations.filter((location) => location.type === "locality"),
  ];

  return ordered.slice(0, limits.serviceAreas).map((location) =>
    link(
      combinationHref(service.slug, location),
      `Explore ${phrase(service.slug, service.name)} options in ${location.name}.`,
      "service-areas",
    ),
  );
}

export function getNearbyLocations(locationSlug: string): InternalLink[] {
  const location = getLocationBySlug(locationSlug);

  if (!location?.active) {
    return [];
  }

  const links: InternalLink[] = [];
  const seen = new Set<string>();

  for (const name of location.nearbyAreas) {
    const match = resolveNearby(name, location.slug);

    if (!match || seen.has(match.slug)) {
      continue;
    }

    seen.add(match.slug);
    links.push(link(hrefFor(match), `See the service area in ${match.name}.`, "nearby-locations"));

    if (links.length === limits.nearby) {
      break;
    }
  }

  return links;
}

/**
 * Links for one published service + location pairing.
 * Targets are the live service and location pages. Unpublished combination URLs are not emitted.
 */
export function getServiceLocationLinks(serviceSlug: string, locationSlug: string): InternalLink[] {
  const service = getServiceBySlug(serviceSlug);
  const location = getLocationBySlug(locationSlug);
  const relation = getServiceLocation(serviceSlug, locationSlug);

  if (!service?.active || !location?.active || location.type === "state" || !relation) {
    return [];
  }

  const links: InternalLink[] = [
    link(
      servicePath(service.slug),
      `View our ${phrase(service.slug, service.name)} solutions.`,
      "related-services",
    ),
    link(hrefFor(location), `See home safety in ${location.name}.`, "service-areas"),
  ];

  if (location.type === "locality") {
    const city = getLocationBySlug(location.citySlug);

    if (city?.active && city.type === "city") {
      links.push(link(hrefFor(city), `See home safety across ${city.name}.`, "service-areas"));
    }
  }

  const available = new Set(location.serviceAvailability);
  for (const related of getRelatedServices(service.slug)) {
    const slug = slugFromServicePath(related.href);

    if (slug && available.has(slug)) {
      const relatedService = getServiceBySlug(slug);

      if (relatedService) {
        links.push(
          link(
            related.href,
            `Explore ${phrase(relatedService.slug, relatedService.name)} options in ${location.name}.`,
            "popular-services",
          ),
        );
      }
    }
  }

  links.push(...getNearbyLocations(location.slug));
  links.push(contactLink());
  return dedupe(links);
}

export function getBreadcrumbLinks(
  page:
    | { kind: "service"; serviceSlug: string }
    | { kind: "location"; locationSlug: string }
    | { kind: "service-location"; serviceSlug: string; locationSlug: string },
): BreadcrumbItem[] {
  if (page.kind === "service") {
    const service = getServiceBySlug(page.serviceSlug);
    return service?.active ? serviceBreadcrumbs(service) : [];
  }

  if (page.kind === "location") {
    const location = getLocationBySlug(page.locationSlug);
    return location?.active ? locationBreadcrumbs(location) : [];
  }

  const service = getServiceBySlug(page.serviceSlug);
  const location = getLocationBySlug(page.locationSlug);

  if (!service?.active || !location?.active || !getServiceLocation(page.serviceSlug, page.locationSlug)) {
    return [];
  }

  return serviceLocationBreadcrumbs(service, location);
}

export function getServicePageLinks(serviceSlug: string): LinkGroup[] {
  return groups([
    getRelatedServices(serviceSlug),
    getRelatedLocations(serviceSlug),
    [contactLink()],
  ]);
}

export function getCityPageLinks(citySlug: string): LinkGroup[] {
  const city = getLocationBySlug(citySlug);

  if (!city?.active || city.type !== "city") {
    return [];
  }

  const localities = localitiesFor(city.slug);
  const localityHrefs = new Set(localities.map((item) => item.href));

  return groups([
    servicesIn(city).slice(0, limits.popularServices),
    localities,
    getNearbyLocations(city.slug).filter((item) => !localityHrefs.has(item.href)),
    [contactLink()],
  ]);
}

export function getLocalityPageLinks(localitySlug: string): LinkGroup[] {
  const locality = getLocationBySlug(localitySlug);

  if (!locality?.active || locality.type !== "locality") {
    return [];
  }

  const city = getLocationBySlug(locality.citySlug);
  const explore: InternalLink[] = [];
  const parentHref = city?.active && city.type === "city" ? hrefFor(city) : "";

  if (parentHref) {
    explore.push(link(parentHref, `See home safety across ${city?.name}.`, "explore-more"));
  }

  explore.push(...relatedToAvailable(locality), contactLink());

  return groups([
    servicesIn(locality).slice(0, limits.popularServices),
    getNearbyLocations(locality.slug).filter((item) => item.href !== parentHref),
    explore,
  ]);
}

export function findOrphanPages(): OrphanReport {
  const pages = liveIndexablePaths();
  const incoming = new Map<string, number>();

  for (const path of pages) {
    incoming.set(path, 0);
  }

  for (const edge of linkEdges()) {
    if (edge.to === edge.from || !incoming.has(edge.to)) {
      continue;
    }

    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
  }

  const services: string[] = [];
  const locations: string[] = [];

  const serviceLocations: string[] = [];

  for (const [path, count] of incoming) {
    if (count > 0) {
      continue;
    }

    if (path.startsWith("/services/")) {
      services.push(path);
    } else if (path.startsWith("/locations/")) {
      locations.push(path);
    } else {
      serviceLocations.push(path);
    }
  }

  return {
    services,
    locations,
    serviceLocations,
  };
}

export function findInvalidLinks(): string[] {
  const allowed = livePaths();
  const invalid = new Set<string>();

  const consider = (href: string) => {
    const path = href.split("#")[0] || "/";

    if (!allowed.has(path)) {
      invalid.add(href);
    }
  };

  for (const service of getAllServices()) {
    for (const group of getServicePageLinks(service.slug)) {
      group.links.forEach((item) => consider(item.href));
    }
  }

  for (const city of getActiveCities()) {
    for (const group of getCityPageLinks(city.slug)) {
      group.links.forEach((item) => consider(item.href));
    }
  }

  for (const locality of getActiveLocalities()) {
    for (const group of getLocalityPageLinks(locality.slug)) {
      group.links.forEach((item) => consider(item.href));
    }

    for (const item of getBreadcrumbLinks({ kind: "location", locationSlug: locality.slug })) {
      consider(item.href);
    }
  }

  for (const relation of serviceLocations) {
    if (!relation.active) {
      continue;
    }

    for (const item of getServiceLocationLinks(relation.serviceSlug, relation.locationSlug)) {
      consider(item.href);
    }

    for (const item of getBreadcrumbLinks({
      kind: "service-location",
      serviceSlug: relation.serviceSlug,
      locationSlug: relation.locationSlug,
    })) {
      consider(item.href);
    }
  }

  return [...invalid];
}

function servicesIn(location: Location): InternalLink[] {
  return location.serviceAvailability.flatMap((slug) => {
    const service = getServiceBySlug(slug);

    if (!service?.active || !getServiceLocation(service.slug, location.slug)) {
      return [];
    }

    return [
      link(
        combinationHref(service.slug, location),
        `Explore ${phrase(service.slug, service.name)} options in ${location.name}.`,
        "popular-services",
      ),
    ];
  });
}

function localitiesFor(citySlug: string): InternalLink[] {
  return getLocalitiesByCity(citySlug)
    .filter((locality) => locality.active && locality.indexable)
    .slice(0, limits.localities)
    .map((locality) =>
      link(hrefFor(locality), `See home safety in ${locality.name}.`, "explore-more"),
    );
}

function relatedToAvailable(location: Location): InternalLink[] {
  const present = new Set(location.serviceAvailability);
  const links: InternalLink[] = [];
  const seen = new Set<string>();

  for (const slug of location.serviceAvailability) {
    for (const related of getRelatedServices(slug)) {
      const relatedSlug = slugFromServicePath(related.href);

      if (!relatedSlug || present.has(relatedSlug) || seen.has(related.href)) {
        continue;
      }

      seen.add(related.href);
      links.push({ ...related, section: "related-services" });

      if (links.length === limits.relatedServices) {
        return links;
      }
    }
  }

  return links;
}

function contactLink(): InternalLink {
  return link("/#book", "Book a measurement.", "explore-more");
}

function groups(lists: InternalLink[][]): LinkGroup[] {
  const grouped = new Map<LinkSection, InternalLink[]>();

  for (const item of dedupe(lists.flat())) {
    const current = grouped.get(item.section) ?? [];
    current.push(item);
    grouped.set(item.section, current);
  }

  return [...grouped.entries()].map(([id, links]) => ({
    id,
    title: sectionTitle[id],
    links,
  }));
}

function linkEdges(): { from: string; to: string }[] {
  const edges: { from: string; to: string }[] = [];
  const push = (from: string, hrefs: string[]) => {
    for (const href of hrefs) {
      edges.push({ from, to: href.split("#")[0] || "/" });
    }
  };

  push(
    "/",
    getAllServices()
      .filter((service) => service.indexable)
      .map((service) => servicePath(service.slug)),
  );
  push(
    "/",
    getActiveCities()
      .filter((city) => city.indexable)
      .map((city) => locationCityPath(city.slug)),
  );
  push(
    "/services",
    getAllServices().map((service) => servicePath(service.slug)),
  );
  push("/locations", [
    ...getActiveCities().map((city) => locationCityPath(city.slug)),
    ...getActiveLocalities().map((locality) => locationLocalityPath(locality.citySlug, locality.slug)),
  ]);

  for (const service of getAllServices()) {
    push(
      servicePath(service.slug),
      getServicePageLinks(service.slug).flatMap((group) => group.links.map((item) => item.href)),
    );
  }

  for (const city of getActiveCities()) {
    push(
      locationCityPath(city.slug),
      getCityPageLinks(city.slug).flatMap((group) => group.links.map((item) => item.href)),
    );
  }

  for (const locality of getActiveLocalities()) {
    push(
      locationLocalityPath(locality.citySlug, locality.slug),
      getLocalityPageLinks(locality.slug).flatMap((group) => group.links.map((item) => item.href)),
    );
  }

  return edges;
}

function publishedCombinationPaths(indexableOnly: boolean): string[] {
  return serviceLocations.flatMap((relation) => {
    if (!relation.active || (indexableOnly && !relation.indexable)) {
      return [];
    }

    const location = getLocationBySlug(relation.locationSlug);

    if (!location?.active || location.type === "state" || (indexableOnly && !location.indexable)) {
      return [];
    }

    return [combinationHref(relation.serviceSlug, location)];
  });
}

function liveIndexablePaths(): Set<string> {
  return new Set([
    ...getAllServices()
      .filter((service) => service.indexable)
      .map((service) => servicePath(service.slug)),
    ...getActiveCities()
      .filter((city) => city.indexable)
      .map((city) => locationCityPath(city.slug)),
    ...getActiveLocalities()
      .filter((locality) => locality.indexable)
      .map((locality) => locationLocalityPath(locality.citySlug, locality.slug)),
    ...publishedCombinationPaths(true),
  ]);
}

function livePaths(): Set<string> {
  return new Set([
    "/",
    "/services",
    "/locations",
    ...getAllServices().map((service) => servicePath(service.slug)),
    ...getActiveCities().map((city) => locationCityPath(city.slug)),
    ...getActiveLocalities().map((locality) => locationLocalityPath(locality.citySlug, locality.slug)),
    ...publishedCombinationPaths(false),
  ]);
}

function combinationHref(serviceSlug: string, location: Location): string {
  if (location.type === "locality") {
    return serviceLocalityPath(serviceSlug, location.citySlug, location.slug);
  }

  return serviceCityPath(serviceSlug, location.slug);
}

function resolveNearby(name: string, currentSlug: string): Location | undefined {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const match = getLocationBySlug(slug);

  if (!match?.active || !match.indexable || match.slug === currentSlug || match.type === "state") {
    return undefined;
  }

  return match;
}

function hrefFor(location: Location): string {
  if (location.type === "locality") {
    return locationLocalityPath(location.citySlug, location.slug);
  }

  return locationCityPath(location.slug);
}

function phrase(slug: string, name: string): string {
  return servicePhrase[slug] ?? name.toLowerCase();
}

function slugFromServicePath(href: string): string | undefined {
  const match = href.split("#")[0]?.match(/^\/services\/([a-z0-9-]+)$/);
  return match?.[1];
}

function dedupe(links: InternalLink[]): InternalLink[] {
  const seen = new Set<string>();

  return links.filter((item) => {
    const key = `${item.section}:${item.href}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function link(href: string, label: string, section: LinkSection): InternalLink {
  return { href, label, section };
}

function assertLinkGraph(): void {
  const invalid = findInvalidLinks();

  if (invalid.length > 0) {
    throw new Error(`Internal links point at unpublished URLs: ${invalid.join(", ")}`);
  }

  const orphans = findOrphanPages();

  if (
    orphans.services.length > 0 ||
    orphans.locations.length > 0 ||
    orphans.serviceLocations.length > 0
  ) {
    throw new Error(
      `Indexable pages have no incoming links: ${[...orphans.services, ...orphans.locations, ...orphans.serviceLocations].join(", ")}`,
    );
  }
}

assertLinkGraph();
