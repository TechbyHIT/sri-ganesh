import { priceGuides } from "@/data/materials";
import { cities, getArea, getCity } from "@/data/cities";
import { getIntent, getService, services } from "@/data/services";
import { parseCombo } from "@/lib/pages";
import { topicOverlap } from "./topics";
import { areaPath, cityPath, guidePath, serviceAreaPath, serviceCityPath, servicePath } from "./urls";

const retiredGuides: Record<string, string> = {
  "invisible-grills-for-balcony": "balcony-invisible-grills",
};

export function legacyRedirect(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
  const retired = path.match(/^\/guides\/([^/]+)(?:\/([^/]+))?$/);
  if (retired && retiredGuides[retired[1]]) {
    const target = retiredGuides[retired[1]];
    return retired[2] && getCity(retired[2]) ? serviceCityPath(target, retired[2]) : servicePath(target);
  }
  if (path === "/" || path.startsWith("/services") || path.startsWith("/guides") || path.startsWith("/blog") || path.startsWith("/locations/andhra-pradesh")) {
    return null;
  }

  const areaMatch = path.match(/^\/areas\/([^/]+)$/);
  if (areaMatch) {
    const found = getArea(areaMatch[1]);
    return found ? areaPath(found.city.slug, found.area.slug) : null;
  }

  const cityMatch = path.match(/^\/locations\/([^/]+)$/);
  if (cityMatch && getCity(cityMatch[1])) return cityPath(cityMatch[1]);

  const service = getService(path.slice(1));
  if (service) return servicePath(service.slug);

  const intent = getIntent(path.slice(1));
  if (intent) return guidePath(intent.intent.slug);

  const price = priceGuides.find((guide) => `/${guide.slug}` === path);
  if (price) return guidePath(price.slug);

  const combo = parseCombo(path.slice(1));
  if (combo) return serviceCityPath(combo.service.slug, combo.city.slug);

  return flatAlias(path.slice(1));
}

const servicesByLength = [...services].sort((a, b) => b.slug.length - a.slug.length);

function uniqueArea(slug: string) {
  const found = cities.flatMap((city) => city.areas.filter((area) => area.slug === slug).map((area) => ({ city, area })));
  return found.length === 1 ? found[0] : undefined;
}

function flatAlias(slug: string) {
  const service = servicesByLength.find((item) => slug.startsWith(`${item.slug}-in-`));
  if (!service) return null;
  const place = slug.slice(service.slug.length + 4);
  if (place === "andhra-pradesh" || place === "ap") return servicePath(service.slug);
  const found = uniqueArea(place);
  if (!found) return null;
  return topicOverlap(service, `${found.area.detail} ${found.area.name}`)
    ? serviceAreaPath(service.slug, found.city.slug, found.area.slug)
    : serviceCityPath(service.slug, found.city.slug);
}
