import { faqs, type Faq, type FaqScope } from "@/data/faqs";
import { whyChooseUs } from "@/data/homepage";
import type { Location } from "@/data/locations";
import { serviceLocations, type ServiceLocation } from "@/data/serviceLocations";
import type { Service } from "@/data/services";
import { cta, site } from "@/data/site";
import {
  getActiveCities,
  getActiveLocalities,
  getAllLocations,
  getCities as getLocationCities,
  getCityBySlug,
  getLocalitiesByCity,
  getLocationBySlug,
  getLocationsByService,
  getServiceLocation,
} from "@/lib/locations";
import { getAllServices, getRelatedServices, getServiceBySlug } from "@/lib/services";

export type ServiceCityRef = {
  service: string;
  city: string;
};

export type ServiceLocalityRef = {
  service: string;
  city: string;
  locality: string;
};

export function getServices() {
  return getAllServices();
}

export function getService(slug: string) {
  return getServiceBySlug(slug);
}

export function getCities() {
  return getLocationCities();
}

export function getCity(slug: string) {
  return getCityBySlug(slug);
}

export function getPublishedCities() {
  return getActiveCities();
}

export function getLocality(citySlug: string, localitySlug: string) {
  const locality = getLocationBySlug(localitySlug);

  if (!locality || locality.type !== "locality" || locality.citySlug !== citySlug) {
    return undefined;
  }

  return locality;
}

export function getPublishedLocalities(citySlug: string) {
  return getLocalitiesByCity(citySlug).filter((locality) => locality.active);
}

export function isPublishedCity(citySlug: string): boolean {
  return Boolean(getCityBySlug(citySlug)?.active);
}

export function getServiceStaticParams(): { service: string }[] {
  return getAllServices().map((service) => ({ service: service.slug }));
}

export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

export function getFaqs(options: {
  scope: FaqScope;
  serviceSlug?: string;
  tokens?: Record<string, string>;
}): Faq[] {
  const tokens = {
    region: site.region,
    ...options.tokens,
  };

  return faqs
    .filter((faq) => faq.scopes.includes(options.scope))
    .filter((faq) => !faq.serviceSlug || faq.serviceSlug === options.serviceSlug)
    .map((faq) => ({
      ...faq,
      question: fillTemplate(faq.question, tokens),
      answer: fillTemplate(faq.answer, tokens),
    }));
}

export function otherServices(serviceSlug: string) {
  return getAllServices().filter((service) => service.slug !== serviceSlug);
}

export type ContentFaq = {
  question: string;
  answer: string;
};

export type ContentStep = {
  title: string;
  detail: string;
};

export type ContentCta = {
  title: string;
  text: string;
};

export type PageContentKind = "service" | "city" | "locality" | "service-city" | "service-locality";

export type PageContent = {
  kind: PageContentKind;
  id: string;
  h1: string;
  introduction: string;
  overview: string;
  benefits: string[];
  features: string[];
  applications: string[];
  installation: ContentStep[];
  whyChoose: string;
  localInformation: string;
  faqs: ContentFaq[];
  relatedServices: string[];
  relatedLocations: string[];
  cta: ContentCta;
  fingerprint: string;
};

export type ContentQuality = {
  score: number;
  indexable: boolean;
  reasons: string[];
};

export type ContentSimilarity = {
  local: number;
  full: number;
};

export type DuplicateContentMatch = {
  left: string;
  right: string;
  similarity: number;
};

const indexThreshold = 70;
const localSimilarityLimit = 0.72;
const fullSimilarityLimit = 0.9;

const serviceCtas: Record<string, ContentCta> = {
  "invisible-grills": {
    title: "Request an invisible grills quote",
    text: "Share the city and how many balcony or window openings need wires. The quote follows the measurement.",
  },
  "balcony-safety-nets": {
    title: "Get balcony safety net installation",
    text: "Tell us which openings need a close mesh. The net is cut after the frame is measured.",
  },
  "cloth-hangers": {
    title: "Plan a cloth hanger layout",
    text: "Describe the balcony ceiling and whether a grill or net is already fitted. The rod line is drawn around that.",
  },
  "sports-nets": {
    title: "Discuss your sports net requirement",
    text: "Share the terrace or yard and the game. Poles are planned only if that space can hold them.",
  },
  "safety-spikes": {
    title: "Ask about safety spikes for a ledge",
    text: "Name the ledge or parapet. Spikes are specified only for surfaces where people do not stand.",
  },
  "duct-area-nets": {
    title: "Arrange a duct area net measurement",
    text: "Tell us which shaft or AC opening needs mesh. Pipes that cross the opening are part of the measurement.",
  },
  "building-covering": {
    title: "Book building covering for a repair stage",
    text: "Say which construction stage the sheet is for. It is taken down when that stage ends.",
  },
};

export function generateBenefits(serviceSlug: string): string[] {
  return getServiceBySlug(serviceSlug)?.benefits ?? [];
}

export function generateApplications(serviceSlug: string, locationSlug?: string): string[] {
  const service = getServiceBySlug(serviceSlug);

  if (!service) {
    return [];
  }

  const location = locationSlug ? getLocationBySlug(locationSlug) : undefined;
  return orderApplications(service.applications, location);
}

export function generateInstallation(serviceSlug: string): ContentStep[] {
  return getServiceBySlug(serviceSlug)?.installationProcess ?? [];
}

export function generateFaqs(input: { serviceSlug?: string; locationSlug?: string }): ContentFaq[] {
  const service = input.serviceSlug ? getServiceBySlug(input.serviceSlug) : undefined;
  const location = input.locationSlug ? getLocationBySlug(input.locationSlug) : undefined;

  if (service?.active && location?.active && location.type !== "state") {
    const relation = getServiceLocation(service.slug, location.slug);

    if (!relation?.active) {
      return [];
    }

    return pairingFaqs(service, location, relation);
  }

  if (service?.active) {
    return service.faqs;
  }

  if (location?.active && location.type !== "state") {
    return locationFaqs(location);
  }

  return [];
}

export function getServiceContent(serviceSlug: string): PageContent | undefined {
  const service = getServiceBySlug(serviceSlug);

  if (!service?.active) {
    return undefined;
  }

  const relatedLocations = getLocationsByService(service.slug)
    .filter((location) => location.indexable)
    .map((location) => location.name);

  return seal({
    kind: "service",
    id: `service:${service.slug}`,
    h1: service.name,
    introduction: service.shortDescription,
    overview: service.description,
    benefits: generateBenefits(service.slug),
    features: service.features,
    applications: generateApplications(service.slug),
    installation: generateInstallation(service.slug),
    whyChoose: whyChooseLine(service),
    localInformation: serviceCoverage(service, relatedLocations),
    faqs: generateFaqs({ serviceSlug: service.slug }),
    relatedServices: relatedServiceNames(service.slug),
    relatedLocations,
    cta: ctaFor(service.slug),
  });
}

export function getCityContent(citySlug: string): PageContent | undefined {
  const city = getCityBySlug(citySlug);

  if (!city?.active) {
    return undefined;
  }

  return locationPageContent(city, "city");
}

export function getLocalityContent(citySlug: string, localitySlug: string): PageContent | undefined {
  const locality = getLocality(citySlug, localitySlug);

  if (!locality?.active) {
    return undefined;
  }

  return locationPageContent(locality, "locality");
}

export function getServiceCityContent(serviceSlug: string, citySlug: string): PageContent | undefined {
  const service = getServiceBySlug(serviceSlug);
  const city = getCityBySlug(citySlug);
  const relation = getServiceLocation(serviceSlug, citySlug);

  if (!service?.active || !city?.active || !relation?.active) {
    return undefined;
  }

  return serviceLocationPage(service, city, relation, "service-city");
}

export function getServiceLocalityContent(
  serviceSlug: string,
  citySlug: string,
  localitySlug: string,
): PageContent | undefined {
  const service = getServiceBySlug(serviceSlug);
  const locality = getLocality(citySlug, localitySlug);
  const relation = getServiceLocation(serviceSlug, localitySlug);

  if (!service?.active || !locality?.active || !relation?.active) {
    return undefined;
  }

  return serviceLocationPage(service, locality, relation, "service-locality");
}

export function getContentFaqs(page: PageContent | undefined): ContentFaq[] {
  return page?.faqs ?? [];
}

export function getContentBenefits(page: PageContent | undefined): string[] {
  return page?.benefits ?? [];
}

export function getContentApplications(page: PageContent | undefined): string[] {
  return page?.applications ?? [];
}

export function getContentInstallation(page: PageContent | undefined): ContentStep[] {
  return page?.installation ?? [];
}

export function calculateContentQuality(page: PageContent): ContentQuality {
  const parts = [
    lengthPart(page),
    uniquePart(page),
    servicePart(page),
    locationPart(page),
    sectionPart(page),
    faqPart(page),
    linkPart(page),
    localPart(page),
  ];
  const score = Math.min(
    100,
    parts.reduce((total, part) => total + part.points, 0),
  );
  const reasons = parts.map((part) => part.reason);
  const indexable = score >= indexThreshold && parts.every((part) => !part.block);

  reasons.push(
    indexable
      ? `Score ${score}. This page can be indexed.`
      : `Score ${score}. This page is noindex and is excluded from the sitemap.`,
  );

  return { score, indexable, reasons };
}

export function contentFingerprint(value: string): string {
  return hashText(wordShingles(normalizePlaces(value)).join("|"));
}

export function contentSimilarity(left: PageContent, right: PageContent): ContentSimilarity {
  return {
    local: similarity(localLayer(left), localLayer(right)),
    full: similarity(fullLayer(left), fullLayer(right)),
  };
}

export function detectDuplicateContent(pages: PageContent[]): DuplicateContentMatch[] {
  const matches: DuplicateContentMatch[] = [];

  for (let left = 0; left < pages.length; left += 1) {
    for (let right = left + 1; right < pages.length; right += 1) {
      const compared = contentSimilarity(pages[left], pages[right]);

      if (compared.local >= localSimilarityLimit || compared.full >= fullSimilarityLimit) {
        matches.push({
          left: pages[left].id,
          right: pages[right].id,
          similarity: Math.max(compared.local, compared.full),
        });
      }
    }
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

export function publishedContentPages(): PageContent[] {
  const pages: PageContent[] = [];

  for (const service of getAllServices()) {
    const page = getServiceContent(service.slug);

    if (page) {
      pages.push(page);
    }
  }

  for (const city of getActiveCities()) {
    const page = getCityContent(city.slug);

    if (page) {
      pages.push(page);
    }
  }

  for (const locality of getActiveLocalities()) {
    const page = getLocalityContent(locality.citySlug, locality.slug);

    if (page) {
      pages.push(page);
    }
  }

  for (const relation of serviceLocations) {
    if (!relation.active) {
      continue;
    }

    const location = getLocationBySlug(relation.locationSlug);

    if (!location?.active) {
      continue;
    }

    const page =
      location.type === "locality"
        ? getServiceLocalityContent(relation.serviceSlug, location.citySlug, location.slug)
        : getServiceCityContent(relation.serviceSlug, location.slug);

    if (page) {
      pages.push(page);
    }
  }

  return pages;
}

type QualityPart = {
  points: number;
  reason: string;
  block: boolean;
};

function serviceLocationPage(
  service: Service,
  location: Location,
  relation: ServiceLocation,
  kind: "service-city" | "service-locality",
): PageContent {
  const introduction = pairingIntroduction(service, location, relation);

  return seal({
    kind,
    id: `${kind}:${service.slug}:${location.slug}`,
    h1: `${service.name} in ${placeLabel(location)}`,
    introduction,
    overview: service.description,
    benefits: generateBenefits(service.slug),
    features: service.features,
    applications: generateApplications(service.slug, location.slug),
    installation: generateInstallation(service.slug),
    whyChoose: whyChooseLine(service, location.name),
    localInformation: localNotes(location, relation, introduction),
    faqs: generateFaqs({ serviceSlug: service.slug, locationSlug: location.slug }),
    relatedServices: relatedServiceNames(service.slug),
    relatedLocations: relatedLocationNames(service, location),
    cta: ctaFor(service.slug),
  });
}

function locationPageContent(location: Location, kind: "city" | "locality"): PageContent {
  const introduction = locationIntroduction(location);

  return seal({
    kind,
    id: `${kind}:${location.slug}`,
    h1: location.type === "locality" ? `Home safety in ${location.name}, ${location.city}` : `Home safety in ${location.name}`,
    introduction,
    overview: location.seo.description,
    benefits: [],
    features: [],
    applications: [],
    installation: [],
    whyChoose: "",
    localInformation: localNotes(location, undefined, introduction),
    faqs: generateFaqs({ locationSlug: location.slug }),
    relatedServices: serviceNames(location),
    relatedLocations: relatedPlaceNames(location),
    cta: locationCta(location),
  });
}

function pairingIntroduction(service: Service, location: Location, relation: ServiceLocation): string {
  const local = relation.localIntroduction.trim();
  const localSentences = sentences(local);
  const setting = sentences(location.description).find((sentence) => !overlaps(sentence, local));
  const constraint = sentences(relation.uniqueContent).find((sentence) => !overlaps(sentence, local));
  const options = [local];

  if (setting) {
    options.push(`${setting} ${local}`);
  }

  if (constraint) {
    options.push(`${local} ${constraint}`);
  }

  if (localSentences.length > 1) {
    options.push(`${localSentences.slice(1).join(" ")} ${localSentences[0]}`);
  }

  const unique = [...new Set(options.map(collapse))];
  return unique[stableIndex(`${service.slug}:${location.slug}:intro`, unique.length)] ?? local;
}

function locationIntroduction(location: Location): string {
  const description = location.description.trim();
  const parts = sentences(description);
  const options = [description];

  if (parts.length > 1 && parts[0]) {
    options.push(parts[0]);
  }

  if (location.type === "locality" && !description.includes(location.city)) {
    options.push(`${location.name} is in ${location.city}. ${description}`);
  }

  const unique = [...new Set(options.map(collapse))].filter((option) => option.length >= 80);
  const pool = unique.length > 0 ? unique : [collapse(description)];
  return pool[stableIndex(`${location.slug}:loc-intro`, pool.length)] ?? collapse(description);
}

function pairingFaqs(service: Service, location: Location, relation: ServiceLocation): ContentFaq[] {
  const place = placeLabel(location);
  const detail = sentences(relation.uniqueContent)[0] ?? "";
  const steps = service.installationProcess.map((step) => step.title);
  const firstStep = service.installationProcess[0];
  const variants: ContentFaq[] = [
    {
      question: `Do you provide ${service.name} in ${place}?`,
      answer: collapse(
        `Yes. ${service.name} is published for ${place}. ${detail} The opening is measured before a quote is given.`,
      ),
    },
    {
      question: `How is ${service.name} installation handled in ${place}?`,
      answer: collapse(
        `${detail} In ${place}, the sequence is ${joinList(steps)}. Nothing is fixed until the opening has been measured.`,
      ),
    },
    {
      question: `What is checked before ${service.name} installation in ${place}?`,
      answer: firstStep
        ? collapse(`${firstStep.detail} In ${place}, that check comes before any fitting. ${detail}`)
        : collapse(`${detail} The opening in ${place} is measured before installation.`),
    },
  ];
  const generated = variants[stableIndex(`${service.slug}:${location.slug}:ask`, variants.length)] ?? variants[0];
  const serviceFaqs = takeRotated(service.faqs, 2, `${service.slug}:${location.slug}:service-faq`);

  return dedupeFaqs([...relation.localFAQs, generated, ...serviceFaqs]);
}

function locationFaqs(location: Location): ContentFaq[] {
  const names = serviceNames(location);

  if (names.length === 0) {
    return [];
  }

  const list = joinList(names);
  const variants: ContentFaq[] = [
    {
      question: `Which services are published for ${location.name}?`,
      answer: `${location.name} has published service notes for ${list}. Each one is measured on the opening itself.`,
    },
    {
      question: `What home safety work can be booked in ${location.name}?`,
      answer: `The published list for ${location.name} is ${list}. A service that is not on that list is not part of this page.`,
    },
    {
      question:
        location.type === "locality"
          ? `Which fittings are published for ${location.name}, ${location.city}?`
          : `How do you choose a service in ${location.name}?`,
      answer:
        location.type === "locality"
          ? `${location.name} is in ${location.city}. The published services there are ${list}.`
          : `Match the opening to a published service. In ${location.name} those services are ${list}.`,
    },
  ];
  const chosen = variants[stableIndex(`${location.slug}:loc-faq`, variants.length)] ?? variants[0];
  const items = [chosen];
  const nearby = nearbyNames(location);

  if (nearby.length > 0) {
    items.push({
      question: `Which nearby areas are published with ${location.name}?`,
      answer: `Nearby published areas are ${joinList(nearby)}. If the opening is in one of those areas, that area has its own notes.`,
    });
  }

  return dedupeFaqs(items);
}

function localNotes(location: Location, relation: ServiceLocation | undefined, introduction: string): string {
  const parts: string[] = [];
  const unusedUnique = sentences(relation?.uniqueContent ?? "").filter((sentence) => !overlaps(sentence, introduction));
  const unusedPlace = sentences(location.description).filter(
    (sentence) => !overlaps(sentence, `${introduction} ${unusedUnique.join(" ")}`),
  );

  if (unusedUnique.length > 0) {
    parts.push(unusedUnique.join(" "));
  }

  if (unusedPlace.length > 0) {
    parts.push(unusedPlace.join(" "));
  }

  const written = `${introduction} ${parts.join(" ")}`;

  if (location.type === "locality" && !written.includes(location.city)) {
    parts.push(`${location.name} is in ${location.city}.`);
  }

  const nearby = nearbyNames(location).filter((name) => !written.includes(name));

  if (nearby.length > 0) {
    parts.push(`Nearby published areas: ${joinList(nearby)}.`);
  }

  const services = serviceNames(location);

  if (services.length > 0) {
    parts.push(`Services published for ${location.name}: ${joinList(services)}.`);
  }

  return collapse(parts.join(" "));
}

function serviceCoverage(service: Service, places: string[]): string {
  if (places.length === 0) {
    return `${service.name} is published for ${site.region}.`;
  }

  return `${service.name} is published for ${site.region}. The current place pages are ${joinList(places)}.`;
}

function whyChooseLine(service: Service, place = ""): string {
  const otherPlaces = getAllLocations()
    .map((location) => location.name)
    .filter((name) => name.length > 0 && name !== place);
  const points = whyChooseUs.points.filter((point) => {
    const text = `${point.title} ${point.text}`;
    return !otherPlaces.some((name) => text.includes(name));
  });
  const pool = points.length > 0 ? points : [...whyChooseUs.points];
  const point = pool[stableIndex(`${service.slug}:${place}:why`, pool.length)] ?? pool[0];
  const benefit =
    service.benefits[stableIndex(`${service.slug}:${place}:benefit`, Math.max(service.benefits.length, 1))] ?? "";

  if (!point) {
    return benefit;
  }

  return collapse(`${point.title}. ${point.text} ${benefit}`);
}

function locationCta(location: Location): ContentCta {
  const names = serviceNames(location);
  const lead = names[0];
  const variants: ContentCta[] = [
    {
      title: lead ? `Book a measurement for ${lead}` : "Book a measurement",
      text: `Tell us the opening in ${location.name}. The quote follows that measurement.`,
    },
    {
      title:
        location.type === "locality"
          ? `Arrange a visit in ${location.name}`
          : `Measure an opening in ${location.name}`,
      text: names.length
        ? `Published services here are ${joinList(names)}. Say which one matches the opening.`
        : cta.text,
    },
    {
      title: "Book a site measurement",
      text:
        names.length > 1
          ? `In ${location.name}, start with ${joinList(names)}. We measure before installation.`
          : `In ${location.name}, the visit measures the opening before any fitting is planned.`,
    },
  ];

  return variants[stableIndex(`${location.slug}:cta`, variants.length)] ?? variants[0];
}

function ctaFor(serviceSlug: string): ContentCta {
  return (
    serviceCtas[serviceSlug] ?? {
      title: "Book a measurement",
      text: cta.text,
    }
  );
}

function relatedServiceNames(serviceSlug: string): string[] {
  return getRelatedServices(serviceSlug).map((service) => service.name);
}

function relatedLocationNames(service: Service, location: Location): string[] {
  const names: string[] = [];
  const seen = new Set<string>([location.name]);
  const add = (name: string) => {
    if (!name || seen.has(name)) {
      return;
    }

    seen.add(name);
    names.push(name);
  };

  for (const other of getLocationsByService(service.slug)) {
    if (other.indexable && other.slug !== location.slug) {
      add(other.name);
    }
  }

  for (const name of relatedPlaceNames(location)) {
    add(name);
  }

  return names;
}

function relatedPlaceNames(location: Location): string[] {
  const names: string[] = [];
  const seen = new Set<string>([location.name]);
  const add = (name: string) => {
    if (!name || seen.has(name)) {
      return;
    }

    seen.add(name);
    names.push(name);
  };

  if (location.type === "locality") {
    const city = getCityBySlug(location.citySlug);

    if (city?.active && city.indexable) {
      add(city.name);
    }
  }

  for (const name of nearbyNames(location)) {
    add(name);
  }

  return names;
}

function serviceNames(location: Location): string[] {
  return location.serviceAvailability.flatMap((slug) => {
    const service = getServiceBySlug(slug);
    return service?.active ? [service.name] : [];
  });
}

function nearbyNames(location: Location): string[] {
  return location.nearbyAreas.flatMap((name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const match = getLocationBySlug(slug);
    return match?.active && match.indexable && match.slug !== location.slug ? [match.name] : [];
  });
}

function orderApplications(items: string[], location?: Location): string[] {
  if (!location) {
    return items;
  }

  const haystack = `${location.description} ${location.seo.description}`.toLowerCase();

  return items
    .map((item, index) => {
      const words = item
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 4);
      const hits = words.filter((word) => haystack.includes(word)).length;
      return { item, index, hits };
    })
    .sort((left, right) => right.hits - left.hits || left.index - right.index)
    .map((entry) => entry.item);
}

function placeLabel(location: Location): string {
  return location.type === "locality" ? `${location.name}, ${location.city}` : location.name;
}

function lengthPart(page: PageContent): QualityPart {
  const length = pageText(page).length;

  if (length >= 1000) {
    return { points: 20, reason: "The page has enough written content to be useful.", block: false };
  }

  if (length >= 600) {
    return { points: 14, reason: "The page has a moderate amount of written content.", block: false };
  }

  if (length >= 350) {
    return { points: 8, reason: "The page has a moderate amount of written content.", block: false };
  }

  return { points: 0, reason: "The written content is too short.", block: true };
}

function uniquePart(page: PageContent): QualityPart {
  const introduction = page.introduction.trim();
  const local = page.localInformation.trim();

  if (page.kind === "service-city" || page.kind === "service-locality") {
    if (introduction.length >= 100 && local.length >= 80 && introduction !== page.overview.trim()) {
      return {
        points: 15,
        reason: "The introduction and local notes belong to this service and place.",
        block: false,
      };
    }

    return {
      points: 0,
      reason: "The local pairing does not have enough of its own information.",
      block: true,
    };
  }

  if (page.kind === "service" && page.overview.trim().length >= 250) {
    return { points: 15, reason: "The service overview is specific to this service.", block: false };
  }

  if (introduction.length >= 80 && introduction !== page.overview.trim()) {
    return { points: 15, reason: "The introduction is specific to this page.", block: false };
  }

  return { points: 0, reason: "The introduction is too short.", block: true };
}

function servicePart(page: PageContent): QualityPart {
  if (page.kind === "city" || page.kind === "locality") {
    if (page.relatedServices.length > 0) {
      return { points: 10, reason: "Published services for this place are listed.", block: false };
    }

    return { points: 0, reason: "The copy does not clearly discuss a published service.", block: true };
  }

  const label = page.kind === "service" ? page.h1 : (page.h1.split(" in ")[0] ?? "");

  if (label && page.benefits.length > 0 && mentions(pageText(page), label) > 0) {
    return { points: 10, reason: "The copy stays on the service being described.", block: false };
  }

  return { points: 0, reason: "The copy does not clearly discuss this service.", block: true };
}

function locationPart(page: PageContent): QualityPart {
  const place = placeName(page);

  if (!place) {
    return { points: 10, reason: "This service page is written for Andhra Pradesh as a whole.", block: false };
  }

  const count = mentions(pageText(page), place);

  if (count >= 1 && count <= 8) {
    return {
      points: 10,
      reason: "The place is named without being repeated in every sentence.",
      block: false,
    };
  }

  if (count > 8) {
    return { points: 0, reason: "The place name is repeated too often.", block: true };
  }

  return { points: 0, reason: "The place is not mentioned in the local copy.", block: true };
}

function sectionPart(page: PageContent): QualityPart {
  const filled = filledSections(page);
  const pairing = page.kind === "service-city" || page.kind === "service-locality";

  if (pairing && filled >= 10) {
    return { points: 15, reason: `${filled} content sections are filled.`, block: false };
  }

  if (pairing && filled >= 8) {
    return { points: 12, reason: `${filled} content sections are filled.`, block: false };
  }

  if (pairing) {
    return { points: 0, reason: "Too few content sections are filled.", block: true };
  }

  if (filled >= 6) {
    return { points: 15, reason: `${filled} content sections are filled.`, block: false };
  }

  if (filled >= 4) {
    return { points: 10, reason: `${filled} content sections are filled.`, block: false };
  }

  return { points: 0, reason: "Too few content sections are filled.", block: true };
}

function faqPart(page: PageContent): QualityPart {
  const count = page.faqs.length;
  const pairing = page.kind === "service-city" || page.kind === "service-locality";

  if (pairing && count >= 3) {
    return { points: 15, reason: `${count} useful FAQs are available.`, block: false };
  }

  if (pairing && count >= 2) {
    return { points: 12, reason: `${count} useful FAQs are available.`, block: false };
  }

  if (pairing) {
    return { points: 0, reason: "A service and location page needs at least two FAQs.", block: true };
  }

  if (count >= 2) {
    return { points: 15, reason: `${count} useful FAQs are available.`, block: false };
  }

  if (count === 1) {
    return { points: 8, reason: "One FAQ is available.", block: false };
  }

  if (page.kind === "service") {
    return { points: 0, reason: "No FAQ is stored for this page.", block: true };
  }

  return { points: 0, reason: "No FAQ is stored for this page.", block: false };
}

function linkPart(page: PageContent): QualityPart {
  const links = page.relatedServices.length + page.relatedLocations.length;

  if (links >= 3) {
    return { points: 10, reason: "Related services or places are available to link.", block: false };
  }

  if (links >= 2) {
    return { points: 7, reason: "Related services or places are available to link.", block: false };
  }

  if (links === 1) {
    return { points: 4, reason: "One related link is available.", block: false };
  }

  return { points: 0, reason: "No related services or places are available.", block: false };
}

function localPart(page: PageContent): QualityPart {
  const length = page.localInformation.trim().length;

  if (length >= 80) {
    return { points: 5, reason: "Local information is present.", block: false };
  }

  if (page.kind === "service-city" || page.kind === "service-locality") {
    return {
      points: 0,
      reason: "The local pairing does not have enough of its own information.",
      block: true,
    };
  }

  if (length >= 40) {
    return { points: 3, reason: "Some local information is present.", block: false };
  }

  return { points: 0, reason: "Local information is thin.", block: false };
}

function seal(page: Omit<PageContent, "fingerprint">): PageContent {
  const sealed: PageContent = { ...page, fingerprint: "" };
  sealed.fingerprint = contentFingerprint(localLayer(sealed));
  return sealed;
}

function localLayer(page: Pick<PageContent, "introduction" | "localInformation" | "faqs">): string {
  return `${page.introduction} ${page.localInformation} ${page.faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" ")}`;
}

function fullLayer(page: PageContent): string {
  return [
    localLayer(page),
    page.overview,
    page.benefits.join(" "),
    page.features.join(" "),
    page.applications.join(" "),
    page.whyChoose,
    page.cta.title,
    page.cta.text,
  ].join(" ");
}

function pageText(page: PageContent): string {
  return [
    page.h1,
    page.introduction,
    page.overview,
    page.benefits.join(" "),
    page.features.join(" "),
    page.applications.join(" "),
    page.installation.map((step) => `${step.title} ${step.detail}`).join(" "),
    page.whyChoose,
    page.localInformation,
    page.faqs.map((faq) => `${faq.question} ${faq.answer}`).join(" "),
    page.cta.title,
    page.cta.text,
  ].join(" ");
}

function filledSections(page: PageContent): number {
  const sections: Array<string | readonly string[] | readonly ContentStep[] | readonly ContentFaq[]> = [
    page.h1,
    page.introduction,
    page.overview,
    page.benefits,
    page.features,
    page.applications,
    page.installation,
    page.whyChoose,
    page.localInformation,
    page.faqs,
    page.relatedServices,
    page.relatedLocations,
    page.cta.title,
  ];

  return sections.filter((section) => (typeof section === "string" ? section.trim().length > 0 : section.length > 0)).length;
}

function placeName(page: PageContent): string {
  if (page.kind === "service") {
    return "";
  }

  const named = page.h1.replace(/^Home safety in /, "").replace(/^.* in /, "");
  return named.split(",")[0]?.trim() ?? "";
}

function mentions(haystack: string, needle: string): number {
  if (!needle.trim()) {
    return 0;
  }

  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return haystack.match(new RegExp(escaped, "gi"))?.length ?? 0;
}

function overlaps(sentence: string, body: string): boolean {
  if (body.includes(sentence)) {
    return true;
  }

  const grams = phrases(sentence, 3);

  if (grams.length === 0) {
    return false;
  }

  const existing = new Set(phrases(body, 3));
  return grams.some((gram) => existing.has(gram));
}

function phrases(value: string, size: number): string[] {
  const words = value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const grams: string[] = [];

  for (let index = 0; index <= words.length - size; index += 1) {
    grams.push(words.slice(index, index + size).join(" "));
  }

  return grams;
}

function sentences(value: string): string[] {
  return value
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function collapse(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function joinList(items: string[]): string {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function dedupeFaqs(items: ContentFaq[]): ContentFaq[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.question.trim().toLowerCase();

    if (!item.question.trim() || !item.answer.trim() || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function takeRotated<T>(items: readonly T[], count: number, key: string): T[] {
  if (items.length === 0 || count <= 0) {
    return [];
  }

  const start = stableIndex(key, items.length);
  const limit = Math.min(count, items.length);
  const picked: T[] = [];

  for (let index = 0; index < limit; index += 1) {
    const item = items[(start + index) % items.length];

    if (item !== undefined) {
      picked.push(item);
    }
  }

  return picked;
}

function stableIndex(key: string, size: number): number {
  if (size <= 1) {
    return 0;
  }

  return hashNumber(key) % size;
}

function wordShingles(value: string): string[] {
  const words = value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const shingles: string[] = [];

  for (let index = 0; index <= words.length - 5; index += 1) {
    shingles.push(words.slice(index, index + 5).join(" "));
  }

  return [...new Set(shingles)];
}

function similarity(left: string, right: string): number {
  const leftShingles = wordShingles(normalizePlaces(left));
  const rightShingles = wordShingles(normalizePlaces(right));

  if (leftShingles.length < 5 || rightShingles.length < 5) {
    return collapse(normalizePlaces(left)).toLowerCase() === collapse(normalizePlaces(right)).toLowerCase() ? 1 : 0;
  }

  return jaccard(leftShingles, rightShingles);
}

function jaccard(left: string[], right: string[]): number {
  const rightSet = new Set(right);
  let shared = 0;

  for (const item of new Set(left)) {
    if (rightSet.has(item)) {
      shared += 1;
    }
  }

  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : shared / union;
}

let placeLabels: string[] | undefined;

function normalizePlaces(value: string): string {
  if (!placeLabels) {
    placeLabels = getAllLocations()
      .map((location) => location.name)
      .filter((name) => name.length > 2)
      .sort((left, right) => right.length - left.length);
  }

  let text = value;

  for (const name of placeLabels) {
    text = text.replace(new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi"), " place ");
  }

  return text;
}

function hashText(value: string): string {
  return hashNumber(value).toString(16);
}

function hashNumber(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

if (process.env.NODE_ENV !== "production") {
  const duplicates = detectDuplicateContent(publishedContentPages());

  if (duplicates.length > 0) {
    console.warn(
      `Similar page content: ${duplicates
        .map((match) => `${match.left} ~ ${match.right} (${match.similarity.toFixed(2)})`)
        .join("; ")}`,
    );
  }
}
