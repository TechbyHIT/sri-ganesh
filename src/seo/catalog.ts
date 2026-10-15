import { cities, citiesIn, getCity } from "@/data/cities";
import { priceGuides } from "@/data/materials";
import { getIntent, getService, services } from "@/data/services";
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
} from "./compose";
import { publishedRecords, recordAt, registryByPath } from "./indexable";
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

export function getCatalog() {
  if (!cache) cache = buildCatalog();
  return cache;
}

export function pagesOf(kind: PageDocument["kind"]) {
  return getCatalog().pages.filter((page) => page.kind === kind && page.status !== "exclude");
}

const rendered = new Map<string, PageDocument | undefined>();

let namesCache: string[] | null = null;

function placeNames() {
  if (namesCache) return namesCache;
  namesCache = [
    "Andhra Pradesh",
    "Uttarandhra",
    "Coastal Andhra",
    "Rayalaseema",
    ...cities.flatMap((city) => [city.name, city.district, city.slug, ...city.localities, ...city.areas.map((area) => area.name)]),
  ];
  return namesCache;
}

function draftFor(path: string): PageDocument | undefined {
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "locations" && parts[1] === "andhra-pradesh") {
    if (parts.length === 2) return composeState(cities);
    const city = getCity(parts[2] ?? "");
    if (!city) return undefined;
    if (parts.length === 3) return composeCity(city, citiesIn(city.region), services);
    const area = city.areas.find((item) => item.slug === parts[3]);
    if (!area || parts.length !== 4) return undefined;
    return composeArea(city, area, services);
  }
  if (parts[0] === "services" && parts.length >= 2 && parts.length <= 4) {
    const service = getService(parts[1] ?? "");
    if (!service) return undefined;
    if (parts.length === 2) return composeService(service, cities);
    const city = getCity(parts[2] ?? "");
    if (!city) return undefined;
    if (parts.length === 3) return composeServiceCity(service, city, citiesIn(city.region), relatedServices(service.slug));
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
    const service = guide ? getService(guide.service) : undefined;
    if (guide && service && parts.length === 2) return composePrice(guide, service);
  }
  return undefined;
}

let indexablePaths: Set<string> | null = null;

function indexablePathSet() {
  if (!indexablePaths) indexablePaths = new Set(publishedRecords().map((record) => record.path));
  return indexablePaths;
}

export function pageAt(path: string) {
  if (rendered.has(path)) return rendered.get(path);
  const draft = draftFor(path);
  if (!draft) {
    rendered.set(path, undefined);
    return undefined;
  }
  const page = assess(draft, placeNames(), new Map());
  const recorded = recordAt(page.path);
  if (recorded) {
    page.status = recorded.status;
    page.index = recorded.status === "publish" && recorded.index;
    page.reasons = [...page.reasons, "Index status taken from the quality registry."];
  } else if (registryByPath().size > 0) {
    page.status = "review";
    page.index = false;
    page.reasons = [...page.reasons, "Not in the current quality registry, so this URL stays out of the index until the next catalog review."];
  }
  const forced = readOverrides()[page.path];
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

function relatedServices(slug: string) {
  const service = getService(slug);
  if (!service) return services;
  return [...services.filter((item) => item.group === service.group), ...services.filter((item) => item.group !== service.group)];
}

function buildCatalog(): Catalog {
  const names = [
    "Andhra Pradesh",
    "Uttarandhra",
    "Coastal Andhra",
    "Rayalaseema",
    ...cities.flatMap((city) => [city.name, city.district, city.slug, ...city.localities, ...city.areas.map((area) => area.name)]),
  ];
  const drafts: PageDocument[] = [];
  const rejected: Catalog["rejected"] = [];

  drafts.push(composeState(cities));
  for (const service of services) drafts.push(composeService(service, cities));
  for (const city of cities) {
    drafts.push(composeCity(city, citiesIn(city.region), services));
    for (const area of city.areas) drafts.push(composeArea(city, area, services));
  }
  for (const service of services) {
    for (const city of cities) {
      drafts.push(composeServiceCity(service, city, citiesIn(city.region), relatedServices(service.slug)));
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
    const service = getService(guide.service);
    if (service) drafts.push(composePrice(guide, service));
  }

  const seen = new Map<string, string>();
  const scored = drafts.map((page) => assess(page, names, seen));
  const overrides = readOverrides();
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
  const byPath = new Map(pages.map((page) => [page.path, page]));
  return { pages, byPath, rejected };
}

export const paths = { servicePath, cityPath, areaPath, serviceCityPath, statePath };
