import { cities } from "./cities";
import { districtPath, geoDistricts } from "./geo";
import { services } from "./services";
import type { SearchOption } from "@/components/HeroSearch";

export function searchOptions(): SearchOption[] {
  return [
    ...services.map((service) => ({ label: service.name, href: `/services/${service.slug}`, kind: "Service" })),
    ...geoDistricts.map((district) => ({ label: `${district.name} district`, href: districtPath(district.slug), kind: "District" })),
    ...cities.map((city) => ({
      label: city.district === city.name ? city.name : `${city.name}, ${city.district}`,
      href: `/locations/andhra-pradesh/${city.slug}`,
      kind: "City",
    })),
  ];
}
