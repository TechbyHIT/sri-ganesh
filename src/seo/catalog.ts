import { cities, getCity } from "@/data/cities";
import { allServices, findService } from "@/data/all-services";
import { citiesInDistrict, geoDistricts, getDistrict, getMandal } from "@/data/geo";
import { priceGuides } from "@/data/materials";
import { allPlaces, getPlace, placeContentFor, placesIn, promotedPlaces, servicesForPlace } from "@/data/places";
import { getIntent, type Service } from "@/data/services";
import { allLocalities, readStore, storeRevision, type PageEdit } from "@/lib/store";
import type { City } from "@/data/cities";
import {
  composeArea,
  composeCity,
  composeIntent,
  composeIntentCity,
  composePrice,
  composeService,
  composeServiceArea,
  composeServiceCity,
  composeState,
  hash,
} from "./compose";
import { composeDistrict, composeMandal } from "./compose-geo";
import { publishedRecords, recordAt, registryByPath, resetRegistryCache } from "./indexable";
import { assess, dropUnpublishedLinks } from "./quality";
import { readOverrides } from "./registry";
import { topicOverlap } from "./topics";
import type { PageDocument } from "./types";
import { areaPath, cityPath, serviceAreaPath, serviceCityPath, servicePath, statePath } from "./urls";

export type Catalog = {
  pages: PageDocument[];
  byPath: Map<string, PageDocument>;
  rejected: { path: string; reason: string }[];
};

let cache: Catalog | null = null;
const rendered = new Map<string, PageDocument | undefined>();
let namesCache: string[] | null = null;
let indexablePaths: Set<string> | null = null;
let seenRevision = -1;

function syncCaches() {
  const revision = storeRevision();
  if (revision === seenRevision) return;
  seenRevision = revision;
  resetSeoCaches();
}

export function resetSeoCaches() {
  cache = null;
  rendered.clear();
  namesCache = null;
  indexablePaths = null;
  resetRegistryCache();
}

export function getCatalog() {
  syncCaches();
  if (!cache) cache = buildCatalog();
  return cache;
}

export function pagesOf(kind: PageDocument["kind"]) {
  return getCatalog().pages.filter((page) => page.kind === kind && page.status !== "exclude");
}

function placeNames() {
  if (namesCache) return namesCache;
  namesCache = [
    "Andhra Pradesh",
    "Uttarandhra",
    "Coastal Andhra",
    "Rayalaseema",
    ...allPlaces().flatMap((city) => [city.name, city.district, city.slug, ...city.localities, ...city.areas.map((area) => area.name)]),
    ...geoDistricts.flatMap((district) => [
      district.name,
      district.headquarters,
      ...district.divisions.map((division) => division.name),
      ...district.mandals.map((mandal) => mandal.name),
      ...district.ulbs.map((ulb) => ulb.name),
    ]),
  ];
  return namesCache;
}

function relatedServices(slug: string, pool: Service[]) {
  const service = pool.find((item) => item.slug === slug);
  if (!service) return pool;
  return [...pool.filter((item) => item.group === service.group), ...pool.filter((item) => item.group !== service.group)];
}

function regionOf(city: City) {
  return placesIn(city.region);
}

function offersService(city: City, service: Service) {
  const limited = servicesForPlace(city);
  return !limited || limited.has(service.slug);
}

function mandalDraft(districtSlug: string, mandalSlug: string, pool: Service[]) {
  const found = getMandal(districtSlug, mandalSlug);
  if (!found) return undefined;
  const content = placeContentFor(districtSlug, mandalSlug);
  const place = content ? promotedPlaces().find((item) => item.slug === content.slug) : undefined;
  const offered = place ? pool.filter((service) => offersService(place, service)) : pool;
  const localities = allLocalities().filter((row) => row.district === districtSlug && row.mandal === mandalSlug);
  return composeMandal(found.district, found.mandal, offered, place, content, localities);
}

function districtDraft(slug: string, pool: Service[]) {
  const district = getDistrict(slug);
  if (!district) return undefined;
  const places = [
    ...citiesInDistrict(district),
    ...promotedPlaces().filter((place) => place.district === district.name),
  ];
  return composeDistrict(district, places, pool);
}

function draftFor(path: string): PageDocument | undefined {
  const parts = path.split("/").filter(Boolean);
  const pool = allServices();
  if (parts[0] === "locations" && parts[1] === "andhra-pradesh") {
    if (parts.length === 2) return composeState(cities);
    if (parts[2] === "districts") {
      if (parts.length === 4) return districtDraft(parts[3], pool);
      if (parts.length === 5) return mandalDraft(parts[3], parts[4], pool);
      return undefined;
    }
    const city = getCity(parts[2] ?? "");
    if (!city) return undefined;
    if (parts.length === 3) return composeCity(city, regionOf(city), pool);
    const area = city.areas.find((item) => item.slug === parts[3]);
    if (!area || parts.length !== 4) return undefined;
    return composeArea(city, area, pool);
  }
  if (parts[0] === "services" && parts.length >= 2 && parts.length <= 4) {
    const service = findService(parts[1] ?? "");
    if (!service) return undefined;
    if (parts.length === 2) return composeService(service, allPlaces());
    const city = getPlace(parts[2] ?? "");
    if (!city || !offersService(city, service)) return undefined;
    if (parts.length === 3) return composeServiceCity(service, city, regionOf(city), relatedServices(service.slug, pool));
    const area = city.areas.find((item) => item.slug === parts[3]);
    if (!area || !topicOverlap(service, `${area.detail} ${area.name}`)) return undefined;
    return composeServiceArea(service, city, area);
  }
  if (parts[0] === "guides" && parts[1]) {
    const found = getIntent(parts[1]);
    if (found) {
      if (parts.length === 2) return composeIntent(found.service, found.intent);
      const city = getCity(parts[2] ?? "");
      if (!city || parts.length !== 3) return undefined;
      return composeIntentCity(found.service, found.intent, city);
    }
    const guide = priceGuides.find((item) => item.slug === parts[1]);
    const service = guide ? findService(guide.service) : undefined;
    if (guide && service && parts.length === 2) return composePrice(guide, service);
  }
  return undefined;
}

export function applyEdit(page: PageDocument, edit: PageEdit | undefined) {
  if (!edit) return page;
  if (edit.title?.trim()) page.title = page.ogTitle = edit.title.trim();
  if (edit.description?.trim()) page.description = page.ogDescription = edit.description.trim();
  if (edit.h1?.trim()) page.h1 = edit.h1.trim();
  if (edit.image?.trim()) {
    page.image = edit.image.trim();
    page.imageAlt = edit.imageAlt?.trim() || page.imageAlt;
  }
  if (edit.intro?.trim()) {
    page.modules = [{ type: "prose", title: "Local note", paragraphs: edit.intro.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean) }, ...page.modules];
  }
  if (edit.faqs?.length) {
    const faqs = page.modules.find((module) => module.type === "faqs");
    if (faqs && faqs.type === "faqs") faqs.items = [...edit.faqs, ...faqs.items];
    else page.modules.push({ type: "faqs", title: "Questions", items: edit.faqs });
  }
  page.inputHash = hash({ base: page.inputHash, edit: { ...edit, updatedAt: undefined } });
  return page;
}

function policy(page: PageDocument) {
  if (page.kind === "mandal" && !page.params.city) {
    page.status = "review";
    page.index = false;
    page.reasons = [...page.reasons, "Directory page: no local note has been written for this mandal yet"];
  }
  if (page.kind === "district" || page.kind === "mandal") {
    const district = getDistrict(page.params.district ?? "");
    if (district && !district.verified && page.status === "publish") {
      page.status = "review";
      page.index = false;
      page.reasons = [...page.reasons, "District data not yet fully verified against the December 2025 notifications"];
    }
  }
  return page;
}

export function allOverrides() {
  return { ...readOverrides(), ...readStore("overrides") };
}

function indexablePathSet() {
  if (!indexablePaths) indexablePaths = new Set(publishedRecords().map((record) => record.path));
  return indexablePaths;
}

export function pageAt(path: string) {
  syncCaches();
  if (rendered.has(path)) return rendered.get(path);
  const draft = draftFor(path);
  if (!draft) {
    rendered.set(path, undefined);
    return undefined;
  }
  applyEdit(draft, readStore("pageEdits")[draft.path]);
  const page = policy(assess(draft, placeNames(), new Map()));
  const recorded = recordAt(page.path);
  if (recorded && (recorded.inputHash === page.inputHash || recorded.status !== "publish")) {
    page.status = recorded.status;
    page.index = recorded.status === "publish" && recorded.index;
    page.reasons = [...page.reasons, "Index status taken from the quality registry."];
  } else if (recorded) {
    page.index = page.status === "publish";
    page.reasons = [...page.reasons, "Content changed since the last catalog review and was re-checked on request."];
  } else if (registryByPath().size > 0) {
    page.status = "review";
    page.index = false;
    page.reasons = [...page.reasons, "Not in the current quality registry, so this URL stays out of the index until the next catalog review."];
  }
  const forced = allOverrides()[page.path];
  if (forced) {
    page.status = forced;
    page.index = forced === "publish";
    page.reasons = [...page.reasons, `Manual override: ${forced}`];
  }
  dropUnpublishedLinks(page, indexablePathSet());
  rendered.set(path, page);
  return page;
}

export const hubCitySlugs = ["visakhapatnam", "vijayawada", "guntur", "tirupati", "nellore", "kakinada", "rajahmundry", "kurnool"];

function buildCatalog(): Catalog {
  const names = placeNames();
  const pool = allServices();
  const places = allPlaces();
  const drafts: PageDocument[] = [];
  const rejected: Catalog["rejected"] = [];

  drafts.push(composeState(cities));
  for (const service of pool) drafts.push(composeService(service, places));
  for (const city of cities) {
    drafts.push(composeCity(city, regionOf(city), pool));
    for (const area of city.areas) drafts.push(composeArea(city, area, pool));
  }
  for (const district of geoDistricts) {
    drafts.push(districtDraft(district.slug, pool)!);
    for (const mandal of district.mandals) drafts.push(mandalDraft(district.slug, mandal.slug, pool)!);
  }
  for (const service of pool) {
    for (const city of places) {
      if (!offersService(city, service)) continue;
      drafts.push(composeServiceCity(service, city, regionOf(city), relatedServices(service.slug, pool)));
      for (const area of city.areas) {
        const path = serviceAreaPath(service.slug, city.slug, area.slug);
        if (!topicOverlap(service, `${area.detail} ${area.name}`)) {
          rejected.push({ path, reason: "No verified local overlap between this service and this neighbourhood" });
          continue;
        }
        drafts.push(composeServiceArea(service, city, area));
      }
    }
    for (const intent of service.intents) {
      drafts.push(composeIntent(service, intent));
      for (const city of cities) drafts.push(composeIntentCity(service, intent, city));
    }
  }
  for (const guide of priceGuides) {
    const service = pool.find((item) => item.slug === guide.service);
    if (service) drafts.push(composePrice(guide, service));
  }

  const edits = readStore("pageEdits");
  const seen = new Map<string, string>();
  const scored = drafts.map((page) => policy(assess(applyEdit(page, edits[page.path]), names, seen)));
  const overrides = allOverrides();
  for (const page of scored) {
    const forced = overrides[page.path];
    if (!forced) continue;
    page.status = forced;
    page.index = forced === "publish";
    page.reasons = [...page.reasons, `Manual override: ${forced}`];
  }
  const indexable = new Set(scored.filter((page) => page.status === "publish").map((page) => page.path));
  for (const page of scored) {
    if (page.status === "exclude") continue;
    dropUnpublishedLinks(page, indexable);
  }

  const pages = scored.filter((page) => page.status !== "exclude");
  for (const page of scored) if (page.status === "exclude") rejected.push({ path: page.path, reason: page.reasons.join("; ") });
  const byPath = new Map(pages.map((page) => [page.path, page]));
  return { pages, byPath, rejected };
}

export const paths = { servicePath, cityPath, areaPath, serviceCityPath, statePath };
