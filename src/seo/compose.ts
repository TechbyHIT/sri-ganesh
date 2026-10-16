import { createHash } from "crypto";
import { site } from "@/config/site";
import { featuredPhoto, viewSrc } from "@/data/gallery";
import type { Area, City } from "@/data/cities";
import { districts } from "@/data/cities";
import {
  popularSearchPhrases,
  wikiAreaModules,
  wikiCityModules,
  wikiCompareList,
  wikiServiceModules,
} from "@/data/encyclopedia";
import { steps } from "@/data/materials";
import type { Intent, Service } from "@/data/services";
import { serviceFamily, topicOverlap } from "./topics";
import { STATE, TEMPLATE_VERSION, type LinkItem, type PageDocument, type PageModule } from "./types";
import {
  absoluteUrl,
  areaPath,
  cityPath,
  guideCityPath,
  guidePath,
  serviceAreaPath,
  serviceCityPath,
  servicePath,
  statePath,
} from "./urls";

const frames: Record<City["region"], Record<ReturnType<typeof serviceFamily>, string>> = {
  Uttarandhra: {
    cable: "On this part of the Bay, salt air reaches open balconies. SS316 is a real discussion for sea-facing and ridge flats. Sheltered walls in the same town are often specified in SS304. The visit is what decides, not a package name.",
    mesh: "Coastal wind and monsoon wetting are the mesh problems here. A net that is only hooked at the corners sags after the first wet spell. Edge rope, UV stabiliser and stainless hooks are the specification, written down before fitting.",
    bird: "Humid coastal ledges stay attractive to pigeons. A net is for a volume they enter, such as a balcony or a duct. Spikes are for a narrow perch. Many buildings need one, not both, and we say which after seeing the roost.",
    utility: "Humidity along this coast stains mild-steel drying rods onto clothes. Cloth hangers are specified in aluminium or stainless. Sports nets are a separate impact specification, not a balcony mesh sold under another name.",
  },
  "Coastal Andhra": {
    cable: "Krishna and Godavari humidity is not the same as open-sea salt, but painted iron still marks walls. Cable grade and the condition of the plaster are both part of the quote. Apartment associations usually want the anchor size described before anyone drills a common facade.",
    mesh: "Delta towns often need a fall net and a mosquito screen, and they are different products. Fall mesh is too open for insects. Insect mesh is not a fall barrier. If both are required they are two lines on the quote.",
    bird: "Pigeons use the gap between close-built blocks and the open face of service ducts. We clear birds before the last edge is closed, and a duct net keeps a labelled way in for the plumber.",
    utility: "Balconies here double as the laundry. A ceiling hanger is measured against fan sweep and door height, then against whatever net or cable is sharing the same corner.",
  },
  Rayalaseema: {
    cable: "Dry heat, not salt, is the usual stress inland. SS304 is the normal cable. SS316 is not added for show. Dust on the wall is cleaned before an anchor is set, because a dirty substrate fails before the steel does.",
    mesh: "Terrace mesh in this region fails from ultraviolet light, not from sea air. A net that is not UV-stabilised goes brittle on an open roof in Kurnool, Anantapur or Kadapa weather. Wind is checked. The net is not described as cyclone-proof.",
    bird: "Birds sit on hot parapets and signboards. Stainless spikes hold up better here than plastic pins, which chalk in the sun. A balcony that birds enter still needs a net. Spikes do not close a volume.",
    utility: "Summer sun and dust matter more than corrosion for hangers and sports nets. UV grade is named for any overhead mesh. Rod metal is still stainless or aluminium where the balcony stays damp after a wash.",
  },
};

function hash(value: unknown) {
  return createHash("sha1").update(`${TEMPLATE_VERSION}:${JSON.stringify(value)}`).digest("hex").slice(0, 16);
}

function shot(seed: string, service?: string) {
  const photo = featuredPhoto(seed, service);
  return { image: viewSrc(photo.src), imageAlt: photo.alt };
}

function crumb(...items: LinkItem[]): LinkItem[] {
  return [{ href: "/", label: "Home" }, ...items];
}

function base(partial: Omit<PageDocument, "status" | "index" | "score" | "reasons" | "skeleton" | "keywordHits" | "canonical" | "ogTitle" | "ogDescription" | "jsonLd"> & { jsonLd?: PageDocument["jsonLd"] }): PageDocument {
  const canonical = absoluteUrl(partial.path);
  const document: PageDocument = {
    ...partial,
    canonical,
    ogTitle: partial.title,
    ogDescription: partial.description,
    jsonLd: partial.jsonLd ?? [],
    reasons: [],
    status: "publish",
    index: true,
    score: 0,
    skeleton: "",
    keywordHits: [],
  };
  document.jsonLd = structuredData(document);
  return document;
}

function structuredData(page: Pick<PageDocument, "path" | "title" | "description" | "breadcrumb" | "kind" | "h1">) {
  const canonical = absoluteUrl(page.path);
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: page.breadcrumb.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href ?? page.path),
    })),
  };
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.h1,
    description: page.description,
    url: canonical,
    provider: { "@type": "Organization", name: site.name },
    areaServed: page.kind === "service" || page.kind === "state" || page.kind === "guide"
      ? { "@type": "State", name: "Andhra Pradesh" }
      : { "@type": "AdministrativeArea", name: "Andhra Pradesh" },
  };
  return [crumbs, service];
}

function neighbors(city: City, regionCities: City[]) {
  const index = Math.max(0, regionCities.findIndex((item) => item.slug === city.slug));
  const links: LinkItem[] = [];
  for (let step = 1; links.length < 5 && step < regionCities.length; step += 1) {
    const next = regionCities[(index + step) % regionCities.length];
    links.push({ href: cityPath(next.slug), label: next.name });
  }
  return links;
}

export function composeService(service: Service, allCities: City[]): PageDocument {
  return base({
    id: `service:${service.slug}`,
    kind: "service",
    path: servicePath(service.slug),
    title: `${service.name} in Andhra Pradesh`,
    description: `${service.summary} Measured across Andhra Pradesh, with cable or mesh grade named in a written quote. Book a free site visit.`,
    h1: `${service.name} in Andhra Pradesh`,
    eyebrow: service.group,
    hero: service.lede,
    ...shot(`service:${service.slug}`, service.slug),
    breadcrumb: crumb({ href: "/services", label: "Services" }, { label: service.name }),
    params: { service: service.slug },
    quote: { service: service.name },
    inputHash: hash({ kind: "service", service: service.slug, lede: service.lede, v: 2 }),
    modules: [
      { type: "prose", paragraphs: [service.lede, "Uttarandhra, Coastal Andhra and Rayalaseema do not share one specification. Salt air, delta humidity and inland sun change the metal or the mesh. The page for your city carries that local note. This page explains the system itself."] },
      ...wikiServiceModules(service),
      { type: "list", title: "What a proper fit changes", items: service.benefits },
      { type: "list", title: "Where it is used", items: service.where },
      { type: "list", title: "Materials we will name", items: service.materials },
      wikiCompareList(service),
      { type: "list", title: "What changes the quote", items: service.priceFactors },
      { type: "steps", title: "How the work runs", steps },
      { type: "list", title: "People also look for", items: popularSearchPhrases(service) },
      { type: "faqs", title: "Questions", items: service.faqs },
      {
        type: "links",
        title: `${service.name} in Andhra Pradesh cities`,
        links: allCities.map((city) => ({ href: serviceCityPath(service.slug, city.slug), label: `${service.name} in ${city.name}` })),
      },
      {
        type: "links",
        title: "Related briefs",
        links: service.intents.map((intent) => ({ href: guidePath(intent.slug), label: intent.title })),
      },
    ],
  });
}

export function composeState(cities: City[]): PageDocument {
  return base({
    id: "state:andhra-pradesh",
    kind: "state",
    path: statePath(),
    title: "Invisible Grills and Safety Nets in Andhra Pradesh",
    description: "Measurement-led invisible grills, safety nets, pigeon protection, cloth hangers and sports nets in all 26 districts of Andhra Pradesh. Book a free visit.",
    h1: "Invisible grills and safety nets in Andhra Pradesh",
    eyebrow: "Entire state",
    hero: "Sri Ganesha measures and fits balcony, window, duct and ground systems across Andhra Pradesh. Coverage is the state. A city page is published only where we hold verified local notes on climate, housing and how the visit is scheduled.",
    ...shot("state:andhra-pradesh", "invisible-grills"),
    breadcrumb: crumb({ href: "/locations", label: "Locations" }, { label: STATE.name }),
    params: { state: STATE.slug },
    quote: {},
    inputHash: hash({ kind: "state", cities: cities.map((city) => city.slug) }),
    modules: [
      {
        type: "prose",
        title: "The state as a service map",
        paragraphs: [
          "Andhra Pradesh is one coverage promise and several fitting climates. The Bay edge from Srikakulam and Visakhapatnam through Kakinada, Machilipatnam, Chirala and Nellore puts humidity and, in places, salt on metal. Rayalaseema — Kurnool, Nandyal, Anantapur, Kadapa, Chittoor and the Tirupati foothills — puts ultraviolet light and dust on mesh. The Godavari and Krishna deltas sit between those stories: close-built towns, pigeon roosts, and mosquito evenings that must not be sold as fall safety.",
          "There is no branch office claimed for every mandal. Each of the 26 districts has a hub. Smaller towns — Samalkot, Tanuku, Palakollu, Bobbili, Palasa, Kavali, Adoni, Paderu and the rest of the city list — are measured when the drive and a useful slot are confirmed.",
          "Categories on this site follow use, not a single net sold under every name. Protection covers cable grills, balcony and children nets, pet and cat panels, stairs, terraces, monkey-prone openings and building-cover project mesh. Bird control covers pigeon nets, bird nets, spikes and ducts. Utility covers hangers, sports, cricket and insect screens.",
        ],
      },
      {
        type: "list",
        title: "Districts and the hub we schedule from",
        items: districts.map((district) => `${district.name} — via ${district.hub}`),
      },
      {
        type: "links",
        title: "City pages",
        links: cities.map((city) => ({ href: cityPath(city.slug), label: `${city.name}, ${city.region}` })),
      },
    ],
  });
}

export function composeCity(city: City, regionCities: City[], services: Service[]): PageDocument {
  return base({
    id: `city:${city.slug}`,
    kind: "city",
    path: cityPath(city.slug),
    title: `Invisible Grills and Safety Nets in ${city.name}`,
    description: `${city.climate} Free measurement in ${city.name}, ${city.district} district, with the material grade written in the quote.`,
    h1: `Invisible grills and safety nets in ${city.name}`,
    eyebrow: `${city.region} · ${city.district}`,
    hero: city.intro,
    ...shot(`city:${city.slug}`, "balcony-safety-nets"),
    breadcrumb: crumb(
      { href: "/locations", label: "Locations" },
      { href: statePath(), label: STATE.name },
      { label: city.name },
    ),
    params: { state: STATE.slug, city: city.slug },
    quote: { city: city.name },
    inputHash: hash({ kind: "city", city: city.slug, intro: city.intro, climate: city.climate }),
    modules: [
      { type: "prose", paragraphs: [city.intro, city.climate, `Most of the work is on ${city.housing}. ${city.visitNote}`] },
      ...wikiCityModules(city),
      { type: "note", title: "What the quote should name here", text: city.materialHint },
      {
        type: "links",
        title: `Services in ${city.name}`,
        links: services.map((service) => ({ href: serviceCityPath(service.slug, city.slug), label: `${service.name} in ${city.name}` })),
      },
      city.areas.length
        ? { type: "links", title: `Neighbourhoods in ${city.name}`, links: city.areas.map((area) => ({ href: areaPath(city.slug, area.slug), label: area.name })) }
        : { type: "list", title: "Localities people ask about", items: city.localities },
      { type: "links", title: `Other towns in ${city.region}`, links: neighbors(city, regionCities) },
      {
        type: "faqs",
        title: "Local questions",
        items: [
          { q: `Do you visit ${city.name}?`, a: city.visitNote },
          { q: `Which specification is discussed in ${city.name}?`, a: city.materialHint },
          { q: `Do you cover the rest of ${city.district} district?`, a: `${city.district} district is in scope. Towns beyond ${city.name} are confirmed against travel time before a day is locked.` },
        ],
      },
    ],
  });
}

export function composeArea(city: City, area: Area, linked: Service[]): PageDocument {
  return base({
    id: `area:${area.slug}`,
    kind: "area",
    path: areaPath(city.slug, area.slug),
    title: `Balcony Safety in ${area.name}, ${city.name}`,
    description: `${area.detail} Measurement for homes in ${area.name} is scheduled with ${city.name}.`,
    h1: `Balcony and window safety in ${area.name}`,
    eyebrow: city.name,
    hero: area.detail,
    ...shot(`area:${city.slug}:${area.slug}`, "invisible-grills"),
    breadcrumb: crumb(
      { href: statePath(), label: STATE.name },
      { href: cityPath(city.slug), label: city.name },
      { label: area.name },
    ),
    params: { state: STATE.slug, city: city.slug, area: area.slug },
    quote: { city: `${area.name}, ${city.name}` },
    inputHash: hash({ kind: "area", area: area.slug, detail: area.detail }),
    modules: [
      { type: "prose", paragraphs: [area.detail, city.climate, city.materialHint] },
      ...wikiAreaModules(city, area),
      { type: "note", title: "How this sits in the city visit", text: city.visitNote },
      {
        type: "links",
        title: `Services that fit ${area.name}`,
        links: linked
          .filter((service) => topicOverlap(service, `${area.detail} ${area.name}`))
          .slice(0, 6)
          .map((service) => ({ href: serviceAreaPath(service.slug, city.slug, area.slug), label: `${service.name} in ${area.name}` })),
      },
      {
        type: "links",
        title: `Other neighbourhoods in ${city.name}`,
        links: city.areas.filter((item) => item.slug !== area.slug).map((item) => ({ href: areaPath(city.slug, item.slug), label: item.name })),
      },
    ],
  });
}

export function composeServiceCity(service: Service, city: City, regionCities: City[], related: Service[]): PageDocument {
  const family = serviceFamily(service);
  const localLead = frames[city.region][family];
  return base({
    id: `service-city:${service.slug}:${city.slug}`,
    kind: "service-city",
    path: serviceCityPath(service.slug, city.slug),
    title: `${service.name} in ${city.name}`,
    description: `${service.summary} In ${city.name}, ${city.climate.charAt(0).toLowerCase()}${city.climate.slice(1)} Book a free measurement.`,
    h1: `${service.name} in ${city.name}`,
    eyebrow: `${city.region} · ${city.district}`,
    hero: `${city.intro} ${service.summary}`,
    ...shot(`service-city:${service.slug}:${city.slug}`, service.slug),
    breadcrumb: crumb(
      { href: servicePath(service.slug), label: service.name },
      { href: cityPath(city.slug), label: city.name },
      { label: `${service.name} in ${city.name}` },
    ),
    params: { service: service.slug, state: STATE.slug, city: city.slug },
    quote: { service: service.name, city: city.name },
    inputHash: hash({ kind: "service-city", service: service.slug, city: city.slug, intro: city.intro, family }),
    modules: [
      { type: "prose", title: "The opening, in this city", paragraphs: [service.lede, localLead, `Housing we are asked to fit here: ${city.housing}. ${city.materialHint}`] },
      ...wikiServiceModules(service),
      { type: "prose", title: `Local housing in ${city.name}`, paragraphs: [city.intro, city.climate] },
      { type: "list", title: "Why people book this", items: service.problems },
      { type: "list", title: "What the installation is for", items: service.benefits },
      { type: "list", title: "Options named in the quote", items: [...service.materials, city.materialHint] },
      { type: "list", title: "Applications", items: service.where },
      {
        type: "steps",
        title: "Installation in practice",
        steps: steps.map((step, index) => index === 1 ? { ...step, text: city.visitNote } : step),
      },
      { type: "list", title: `Cost factors in ${city.name}`, items: service.priceFactors },
      { type: "note", title: "No statewide rate", text: `A single price for ${service.name} would ignore this opening. ${service.priceFactors[0]} is the usual first line. The figure is written after measurement.` },
      { type: "list", title: `Localities in and around ${city.name}`, items: city.localities },
      { type: "list", title: "Related searches", items: popularSearchPhrases(service, city) },
      {
        type: "faqs",
        title: "Questions",
        items: [
          { q: `Do you measure ${service.name.toLowerCase()} in ${city.name}?`, a: `${city.visitNote} ${service.name} is quoted only after that opening is seen.` },
          { q: `What should the specification say in ${city.name}?`, a: city.materialHint },
          ...service.faqs,
        ],
      },
      {
        type: "links",
        title: "Related services here",
        links: related.filter((item) => item.slug !== service.slug).slice(0, 12).map((item) => ({
          href: serviceCityPath(item.slug, city.slug),
          label: `${item.name} in ${city.name}`,
        })),
      },
      { type: "links", title: "Nearby city pages", links: neighbors(city, regionCities) },
      city.areas.length
        ? {
            type: "links",
            title: `${city.name} neighbourhoods`,
            links: city.areas.map((area) => ({ href: serviceAreaPath(service.slug, city.slug, area.slug), label: `${service.name} in ${area.name}` })),
          }
        : { type: "links", title: "City overview", links: [{ href: cityPath(city.slug), label: city.name }] },
    ],
  });
}

export function composeServiceArea(service: Service, city: City, area: Area): PageDocument {
  const family = serviceFamily(service);
  return base({
    id: `service-area:${service.slug}:${area.slug}`,
    kind: "service-area",
    path: serviceAreaPath(service.slug, city.slug, area.slug),
    title: `${service.name} in ${area.name}, ${city.name}`,
    description: `${area.detail} ${service.name} in ${area.name} is measured with the ${city.name} visit, not priced from a statewide chart.`,
    h1: `${service.name} in ${area.name}`,
    eyebrow: `${area.name} · ${city.name}`,
    hero: area.detail,
    ...shot(`service-area:${service.slug}:${city.slug}:${area.slug}`, service.slug),
    breadcrumb: crumb(
      { href: serviceCityPath(service.slug, city.slug), label: `${service.name} in ${city.name}` },
      { href: areaPath(city.slug, area.slug), label: area.name },
      { label: service.name },
    ),
    params: { service: service.slug, state: STATE.slug, city: city.slug, area: area.slug },
    quote: { service: service.name, city: `${area.name}, ${city.name}` },
    inputHash: hash({ kind: "service-area", service: service.slug, area: area.slug, detail: area.detail }),
    modules: [
      { type: "prose", paragraphs: [area.detail, frames[city.region][family], `${service.lede} In ${area.name} the city-level note still applies: ${city.materialHint}`] },
      ...wikiAreaModules(city, area, service),
      { type: "list", title: "Specification", items: service.materials },
      { type: "list", title: "Quote factors", items: service.priceFactors.slice(0, 4) },
      {
        type: "faqs",
        title: "Questions",
        items: [
          { q: `Can ${service.name.toLowerCase()} be fitted in ${area.name}?`, a: `${area.detail} ${city.visitNote}` },
          ...service.faqs.slice(0, 2),
        ],
      },
      {
        type: "links",
        title: "Parent pages",
        links: [
          { href: serviceCityPath(service.slug, city.slug), label: `${service.name} in ${city.name}` },
          { href: areaPath(city.slug, area.slug), label: area.name },
          { href: servicePath(service.slug), label: service.name },
        ],
      },
    ],
  });
}

export function composeIntent(service: Service, intent: Intent): PageDocument {
  return base({
    id: `guide:${intent.slug}`,
    kind: "guide",
    path: guidePath(intent.slug),
    title: intent.title,
    description: `${intent.angle} Part of ${service.name.toLowerCase()} work across Andhra Pradesh. The city page carries the local material note.`,
    h1: intent.title,
    eyebrow: service.name,
    hero: intent.angle,
    ...shot(`guide:${intent.slug}`, service.slug),
    breadcrumb: crumb({ href: servicePath(service.slug), label: service.name }, { label: intent.title }),
    params: { service: service.slug, guide: intent.slug },
    quote: { service: service.name },
    inputHash: hash({ kind: "guide", slug: intent.slug, angle: intent.angle }),
    modules: [
      { type: "prose", paragraphs: [intent.angle, service.lede] },
      ...wikiServiceModules(service),
      { type: "list", title: "What changes for this brief", items: service.benefits },
      { type: "list", title: "Typical openings", items: service.where },
      { type: "faqs", title: "Questions", items: service.faqs },
      { type: "links", title: "The full service", links: [{ href: servicePath(service.slug), label: `${service.name} in Andhra Pradesh` }] },
    ],
  });
}

export function composeIntentCity(service: Service, intent: Intent, city: City): PageDocument {
  const family = serviceFamily(service);
  return base({
    id: `guide-city:${intent.slug}:${city.slug}`,
    kind: "guide-city",
    path: guideCityPath(intent.slug, city.slug),
    title: `${intent.title} in ${city.name}`,
    description: `${intent.angle} In ${city.name}, ${city.climate.charAt(0).toLowerCase()}${city.climate.slice(1)} Book a free measurement.`,
    h1: `${intent.title} in ${city.name}`,
    eyebrow: `${service.name} · ${city.name}`,
    hero: `${intent.angle} ${city.intro}`,
    ...shot(`guide-city:${intent.slug}:${city.slug}`, service.slug),
    breadcrumb: crumb(
      { href: servicePath(service.slug), label: service.name },
      { href: guidePath(intent.slug), label: intent.title },
      { href: cityPath(city.slug), label: city.name },
      { label: `${intent.title} in ${city.name}` },
    ),
    params: { service: service.slug, city: city.slug, guide: intent.slug },
    quote: { service: service.name, city: city.name },
    inputHash: hash({ kind: "guide-city", slug: intent.slug, city: city.slug, angle: intent.angle, climate: city.climate }),
    modules: [
      { type: "prose", title: `This brief in ${city.name}`, paragraphs: [intent.angle, frames[city.region][family], `Housing we are asked to fit: ${city.housing}. ${city.materialHint}`] },
      { type: "prose", paragraphs: [city.intro, city.climate] },
      ...wikiServiceModules(service),
      { type: "list", title: "What this use-case changes", items: service.benefits },
      { type: "list", title: "Typical openings", items: service.where },
      { type: "note", title: "How the visit is scheduled", text: city.visitNote },
      {
        type: "faqs",
        title: "Questions",
        items: [
          { q: `Do you fit ${intent.title.toLowerCase()} in ${city.name}?`, a: `${city.visitNote} The brief is confirmed on site against the opening, not against a statewide package.` },
          { q: `What should the specification say here?`, a: city.materialHint },
          ...service.faqs.slice(0, 2),
        ],
      },
      {
        type: "links",
        title: "Related pages",
        links: [
          { href: serviceCityPath(service.slug, city.slug), label: `${service.name} in ${city.name}` },
          { href: guidePath(intent.slug), label: intent.title },
          { href: cityPath(city.slug), label: city.name },
        ],
      },
    ],
  });
}

export function composePrice(guide: { slug: string; title: string; intro: string }, service: Service): PageDocument {
  return base({
    id: `guide:${guide.slug}`,
    kind: "guide",
    path: guidePath(guide.slug),
    title: guide.title,
    description: guide.intro.slice(0, 155),
    h1: guide.title,
    eyebrow: "Pricing",
    hero: guide.intro,
    ...shot(`price:${guide.slug}`, service.slug),
    breadcrumb: crumb({ href: servicePath(service.slug), label: service.name }, { label: "Price" }),
    params: { service: service.slug, guide: guide.slug },
    quote: { service: service.name },
    inputHash: hash({ kind: "price", slug: guide.slug, intro: guide.intro }),
    modules: [
      { type: "prose", paragraphs: [guide.intro, "We do not print a rupee rate for the state. Height, substrate, grade and access move the number. After the visit you get a written figure for material, fittings and labour."] },
      { type: "list", title: "Factors that move the price", items: service.priceFactors },
      { type: "links", title: "Service details", links: [{ href: servicePath(service.slug), label: service.name }] },
    ],
  });
}
