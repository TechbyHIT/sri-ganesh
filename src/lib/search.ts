import { cities } from "@/data/cities";
import { allServices } from "@/data/all-services";
import { districtPath, geoDistricts, mandalPath, ulbLabel } from "@/data/geo";
import { promotedPlaces } from "@/data/places";
import { allLocalities } from "@/lib/store";
import { areaPath, cityPath, servicePath } from "@/seo/urls";

export type SearchKind = "service" | "district" | "division" | "mandal" | "town" | "city" | "locality" | "village";

export type SearchHit = { kind: SearchKind; label: string; detail: string; href: string; score: number };

export const searchKinds: { id: SearchKind | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "district", label: "Districts" },
  { id: "mandal", label: "Mandals" },
  { id: "city", label: "Cities" },
  { id: "town", label: "Towns" },
  { id: "village", label: "Villages" },
  { id: "locality", label: "Colonies and localities" },
  { id: "service", label: "Services" },
];

function norm(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
}

function rank(label: string, query: string) {
  const value = norm(label);
  if (value === query) return 100;
  if (value.startsWith(query)) return 80;
  if (value.split(" ").some((word) => word.startsWith(query))) return 60;
  if (value.includes(query)) return 40;
  return 0;
}

export function searchLocations(raw: string, kind: SearchKind | "all" = "all") {
  const query = norm(raw);
  if (query.length < 2) return [];
  const hits: SearchHit[] = [];
  const add = (hit: Omit<SearchHit, "score">) => {
    if (kind !== "all" && hit.kind !== kind) return;
    const score = rank(hit.label, query);
    if (score) hits.push({ ...hit, score: score + (hit.kind === "city" || hit.kind === "district" ? 5 : 0) });
  };
  for (const service of allServices()) add({ kind: "service", label: service.name, detail: service.group, href: servicePath(service.slug) });
  for (const district of geoDistricts) {
    add({ kind: "district", label: `${district.name} district`, detail: `${district.region} · ${district.mandals.length} mandals`, href: districtPath(district.slug) });
    for (const division of district.divisions) {
      add({ kind: "division", label: `${division.name} revenue division`, detail: `${district.name} district`, href: `/locations/andhra-pradesh/districts#${district.slug}-division-${division.slug}` });
    }
    for (const mandal of district.mandals) {
      add({ kind: "mandal", label: `${mandal.name} mandal`, detail: `${district.name} district`, href: mandalPath(district.slug, mandal.slug) });
    }
    for (const ulb of district.ulbs) {
      const city = cities.find((item) => norm(item.name) === norm(ulb.name));
      add({ kind: "town", label: ulb.name, detail: `${ulbLabel[ulb.type]}, ${district.name}`, href: city ? cityPath(city.slug) : districtPath(district.slug) });
    }
  }
  for (const city of cities) {
    add({ kind: "city", label: city.name, detail: `${city.district} · ${city.region}`, href: cityPath(city.slug) });
    for (const area of city.areas) add({ kind: "locality", label: area.name, detail: city.name, href: areaPath(city.slug, area.slug) });
  }
  for (const place of promotedPlaces()) add({ kind: "town", label: place.name, detail: place.district, href: place.pagePath ?? cityPath(place.slug) });
  const districtNames = new Map(geoDistricts.map((district) => [district.slug, district]));
  for (const row of allLocalities()) {
    const district = districtNames.get(row.district);
    const mandal = district?.mandals.find((item) => item.slug === row.mandal);
    if (!district || !mandal) continue;
    add({
      kind: row.kind === "village" ? "village" : "locality",
      label: row.name,
      detail: `${mandal.name} mandal, ${district.name}`,
      href: mandalPath(district.slug, mandal.slug),
    });
  }
  const seen = new Set<string>();
  return hits
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .filter((hit) => {
      const key = `${hit.kind}:${hit.label}:${hit.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
