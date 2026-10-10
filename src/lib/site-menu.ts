import { serviceLocations } from "@/data/serviceLocations";
import { getActiveCities, getLocalitiesByCity } from "@/lib/locations";
import {
  locationCityPath,
  locationLocalityPath,
  serviceCityPath,
} from "@/lib/paths";
import { getServiceBySlug } from "@/lib/services";

export type MenuLink = {
  href: string;
  label: string;
};

export type MenuColumn = {
  href: string;
  title: string;
  links: MenuLink[];
};

function byLabel(left: MenuLink, right: MenuLink): number {
  if (left.label === "Vijayawada") {
    return -1;
  }

  if (right.label === "Vijayawada") {
    return 1;
  }

  return left.label.localeCompare(right.label);
}

/**
 * Services menu in the same column pattern as a trade mega menu.
 * Labels can name a use, such as pigeon mesh or cricket practice.
 * Every href is a page that already exists.
 */
export function serviceMenuColumns(): MenuColumn[] {
  return [
    column("/services/invisible-grills", "Invisible Grills", [
      link("/services/invisible-grills", "Invisible Grills"),
      link("/services/invisible-grills", "Balcony Invisible Grills"),
      link("/services/invisible-grills", "Window Invisible Grills"),
      link("/property-types", "Invisible Grills for Apartments"),
      link("/property-types", "Invisible Grills for Villas"),
      link("/solutions/child-balcony-safety", "Invisible Grills for Child Safety"),
      link("/solutions/pet-balcony-safety", "Invisible Grills for Pets"),
    ]),
    column("/services/balcony-safety-nets", "Safety Nets", [
      link("/services/balcony-safety-nets", "Safety Nets"),
      link("/services/balcony-safety-nets", "Balcony Safety Nets"),
      link("/solutions/child-balcony-safety", "Kids Safety Nets"),
      link("/solutions/child-balcony-safety", "Child Safety Nets"),
      link("/solutions/pet-balcony-safety", "Pet Safety Nets"),
      link("/solutions/pet-balcony-safety", "Cat Safety Nets"),
      link("/solutions/pet-balcony-safety", "Dog Safety Nets"),
    ]),
    column("/services/balcony-safety-nets", "Balcony Nets", [
      link("/services/balcony-safety-nets", "Balcony Nets"),
      link("/services/balcony-safety-nets", "Balcony Protection Nets"),
      link("/solutions/child-balcony-safety", "Balcony Children Safety Nets"),
      link("/solutions/pet-balcony-safety", "Balcony Pet Safety Nets"),
      link("/solutions/pet-balcony-safety", "Balcony Cat Nets"),
      link("/property-types", "Apartment Balcony Nets"),
      link("/property-types", "High Rise Balcony Nets"),
    ]),
    column("/services/duct-area-nets", "Bird Nets", [
      link("/services/duct-area-nets", "Bird Nets"),
      link("/services/duct-area-nets", "Anti Bird Nets"),
      link("/services/duct-area-nets", "Bird Protection Nets"),
      link("/services/balcony-safety-nets", "Balcony Bird Nets"),
      link("/services/balcony-safety-nets", "Window Bird Nets"),
      link("/services/duct-area-nets", "Duct Area Bird Nets"),
    ]),
    column("/services/balcony-safety-nets", "Pigeon Nets", [
      link("/services/balcony-safety-nets", "Pigeon Nets"),
      link("/services/balcony-safety-nets", "Anti Pigeon Nets"),
      link("/services/balcony-safety-nets", "Pigeon Safety Nets"),
      link("/services/balcony-safety-nets", "Balcony Pigeon Nets"),
      link("/services/balcony-safety-nets", "Window Pigeon Nets"),
      link("/services/duct-area-nets", "Duct Area Pigeon Nets"),
    ]),
    column("/services/sports-nets", "Sports Nets", [
      link("/services/sports-nets", "Sports Nets"),
      link("/services/sports-nets", "Cricket Nets"),
      link("/services/sports-nets", "Cricket Practice Nets"),
      link("/services/sports-nets", "Football Nets"),
      link("/tirupati/sports-nets", "Tirupati"),
    ]),
    column("/services/cloth-hangers", "Cloth Hangers", [
      link("/services/cloth-hangers", "Cloth Hangers"),
      link("/services/cloth-hangers", "Ceiling Cloth Hangers"),
      link("/services/cloth-hangers", "Balcony Cloth Hangers"),
      link("/services/cloth-hangers", "Wall Mounted Cloth Hangers"),
      link("/services/cloth-hangers", "Pulley Cloth Hangers"),
      link("/services/cloth-hangers", "Stainless Steel Cloth Hangers"),
      link("/services/cloth-hangers", "Clothes Drying Hangers"),
    ]),
    column("/services/safety-spikes", "Bird Spikes", [
      link("/services/safety-spikes", "Bird Spikes"),
      link("/services/safety-spikes", "Pigeon Spikes"),
      link("/services/safety-spikes", "Anti Bird Spikes"),
      link("/services/safety-spikes", "Anti Pigeon Spikes"),
      link("/services/safety-spikes", "Bird Control Spikes"),
      link("/services/safety-spikes", "Pigeon Control Spikes"),
      link("/services/safety-spikes", "Stainless Steel Bird Spikes"),
    ]),
  ];
}

function link(href: string, label: string): MenuLink {
  return { href, label };
}

function column(href: string, title: string, links: MenuLink[]): MenuColumn {
  return { href, title, links };
}

/** Published cities, with their localities and the services offered there. */
export function areaMenuColumns(): MenuColumn[] {
  return getActiveCities().map((city) => {
    const localities = getLocalitiesByCity(city.slug)
      .filter((locality) => locality.active)
      .map((locality) => ({
        href: locationLocalityPath(city.slug, locality.slug),
        label: locality.name,
      }))
      .sort(byLabel);

    const services = serviceLocations
      .filter((row) => row.active && row.indexable && row.locationSlug === city.slug)
      .flatMap((row) => {
        const service = getServiceBySlug(row.serviceSlug);

        if (!service?.active) {
          return [];
        }

        return [{ href: serviceCityPath(service.slug, city.slug), label: service.name }];
      })
      .sort(byLabel);

    return {
      href: locationCityPath(city.slug),
      title: city.name,
      links: [...localities, ...services],
    };
  });
}
