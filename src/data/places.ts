import { readStore, type PlaceContent } from "@/lib/store";
import { cities, type City } from "./cities";
import { getMandal, hubCityOf, mandalPath } from "./geo";

export const minimumPlaceWords = { intro: 45, visitNote: 12, housing: 4 };

function words(value: string) {
  return value.trim() ? value.trim().split(/\s+/).length : 0;
}

export function placeProblems(place: PlaceContent) {
  const problems: string[] = [];
  if (!getMandal(place.district, place.mandal)) problems.push("Mandal is not in the verified location database");
  if (words(place.intro) < minimumPlaceWords.intro) problems.push(`Local introduction needs at least ${minimumPlaceWords.intro} words`);
  if (words(place.visitNote) < minimumPlaceWords.visitNote) problems.push(`Visit note needs at least ${minimumPlaceWords.visitNote} words`);
  if (words(place.housing) < minimumPlaceWords.housing) problems.push("Describe the housing in this mandal");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(place.slug)) problems.push("URL slug must be lowercase words joined by hyphens");
  if (cities.some((city) => city.slug === place.slug)) problems.push(`Slug ${place.slug} is already used by a city page`);
  return problems;
}

export function resolvePhotos(ids: string[]) {
  const uploads = new Map(readStore("uploads").map((upload) => [upload.id, upload]));
  return ids.flatMap((id) => {
    const upload = uploads.get(id);
    return upload ? [{ src: `/media/${upload.file}`, alt: upload.alt }] : [];
  });
}

function toCity(place: PlaceContent): City | undefined {
  const found = getMandal(place.district, place.mandal);
  if (!found) return undefined;
  const hub = hubCityOf(found.district);
  return {
    slug: place.slug,
    name: place.name || found.mandal.name,
    region: found.district.region,
    district: found.district.name,
    intro: place.intro.trim(),
    climate: place.climate.trim() || hub?.climate || "",
    housing: place.housing.trim(),
    materialHint: place.materialHint.trim() || hub?.materialHint || "",
    visitNote: place.visitNote.trim(),
    localities: place.localities.filter(Boolean),
    areas: [],
    pagePath: mandalPath(found.district.slug, found.mandal.slug),
    photos: resolvePhotos(place.photos),
  };
}

export function promotedPlaces(): City[] {
  const taken = new Set(cities.map((city) => city.slug));
  const out: City[] = [];
  for (const place of Object.values(readStore("places"))) {
    if (!place.enabled || placeProblems(place).length || taken.has(place.slug)) continue;
    const city = toCity(place);
    if (!city) continue;
    taken.add(city.slug);
    out.push(city);
  }
  return out;
}

export function allPlaces(): City[] {
  return [...cities, ...promotedPlaces()];
}

export function getPlace(slug: string) {
  return cities.find((city) => city.slug === slug) ?? promotedPlaces().find((city) => city.slug === slug);
}

export function placesIn(region: City["region"]) {
  return allPlaces().filter((city) => city.region === region);
}

export function placeContentFor(district: string, mandal: string) {
  return readStore("places")[`mandal:${district}:${mandal}`];
}

export function servicesForPlace(city: City) {
  if (!city.pagePath) return undefined;
  const place = Object.values(readStore("places")).find((item) => item.slug === city.slug);
  return place?.services.length ? new Set(place.services) : undefined;
}
