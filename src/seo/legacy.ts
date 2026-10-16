import { priceGuides } from "@/data/materials";
import { getArea, getCity } from "@/data/cities";
import { getIntent, getService } from "@/data/services";
import { parseCombo } from "@/lib/pages";
import { areaPath, cityPath, guidePath, serviceCityPath, servicePath } from "./urls";

export function legacyRedirect(pathname: string) {
  const path = pathname.replace(/\/$/, "") || "/";
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

  return null;
}
