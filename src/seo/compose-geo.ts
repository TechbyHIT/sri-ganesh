import type { City } from "@/data/cities";
import {
  cityForMandal,
  divisionOf,
  districtPath,
  hubCityOf,
  mandalPath,
  mandalsOf,
  ulbLabel,
  ulbsForMandal,
} from "@/data/geo";
import type { GeoDistrict, GeoMandal, Locality } from "@/data/geo-types";
import type { Service } from "@/data/services";
import type { PlaceContent } from "@/lib/store";
import { base, crumb, hash, placeHref, shot } from "./compose";
import { STATE, type FaqItem, type LinkItem, type PageModule } from "./types";
import { serviceCityPath, statePath } from "./urls";

export const districtsIndexPath = "/locations/andhra-pradesh/districts";

function joinNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function sourceLinks(district: GeoDistrict): PageModule {
  return {
    type: "links",
    title: `Official sources (last checked ${district.verifiedAt || "pending"})`,
    keep: true,
    links: district.sources.map((source) => ({ href: source.url, label: source.title })),
  };
}

export function composeDistrict(district: GeoDistrict, places: City[], services: Service[]) {
  const hub = hubCityOf(district);
  const divisionNames = district.divisions.map((division) => division.name);
  const corporations = district.ulbs.filter((ulb) => ulb.type === "municipal-corporation").map((ulb) => ulb.name);
  const municipalities = district.ulbs.filter((ulb) => ulb.type === "municipality").map((ulb) => ulb.name);
  const panchayats = district.ulbs.filter((ulb) => ulb.type === "nagar-panchayat").map((ulb) => ulb.name);
  const urban = [
    corporations.length ? `${corporations.length} municipal corporation${corporations.length > 1 ? "s" : ""} (${joinNames(corporations)})` : "",
    municipalities.length ? `${municipalities.length} municipalit${municipalities.length > 1 ? "ies" : "y"}` : "",
    panchayats.length ? `${panchayats.length} nagar panchayat${panchayats.length > 1 ? "s" : ""}` : "",
  ].filter(Boolean);
  const facts = `${district.name} district, ${district.region}, has its headquarters at ${district.headquarters}. The current administrative list has ${district.divisions.length} revenue division${district.divisions.length === 1 ? "" : "s"} (${joinNames(divisionNames)}) and ${district.mandals.length} mandals${urban.length ? `, with ${joinNames(urban)}` : ""}.`;
  const faqs: FaqItem[] = [
    {
      q: `Do you install in every mandal of ${district.name} district?`,
      a: `The whole district is in scope. Visits are planned from ${hub?.name ?? district.headquarters}, and a remote village is confirmed against travel time before a day is fixed. No branch office is claimed in each mandal.`,
    },
    ...(hub ? [
      { q: `How are visits in ${district.name} scheduled?`, a: hub.visitNote },
      { q: `Which material is usually discussed in this district?`, a: hub.materialHint },
    ] : []),
    {
      q: `Is the mandal list current after the 2025 district reorganisation?`,
      a: `The list on this page follows the official sources linked below, last checked ${district.verifiedAt || "recently"}. ${district.verified ? "It matches the notified structure that came into force on 31 December 2025." : "Some details are still being cross-checked against the December 2025 notifications, so tell us your mandal and village when you book."}`,
    },
  ];
  const modules: PageModule[] = [
    {
      type: "prose",
      title: `${district.name} as a service area`,
      paragraphs: [
        facts,
        hub
          ? `Measurement visits across the district are scheduled from ${hub.name}. ${hub.visitNote} Housing we are most often asked to fit around the hub: ${hub.housing}.`
          : `Measurement visits are scheduled from ${district.headquarters}.`,
        hub ? `${hub.climate} ${hub.materialHint}` : "",
      ].filter(Boolean),
    },
    {
      type: "list",
      title: "Revenue divisions and their mandals",
      items: district.divisions.map((division) => {
        const names = mandalsOf(district, division).map((mandal) => mandal.name);
        return `${division.name} division (${names.length} mandals): ${names.join(", ")}`;
      }),
    },
  ];
  if (district.ulbs.length) {
    modules.push({
      type: "list",
      title: "Towns with an urban local body",
      items: (["municipal-corporation", "municipality", "nagar-panchayat"] as const)
        .map((type) => [type, district.ulbs.filter((ulb) => ulb.type === type).map((ulb) => ulb.name)] as const)
        .filter(([, names]) => names.length)
        .map(([type, names]) => `${ulbLabel[type]}${names.length > 1 ? "s" : ""}: ${names.join(", ")}`),
    });
  }
  modules.push(
    {
      type: "note",
      title: "No office claimed in every town",
      text: `Sri Ganesha does not claim a branch in each mandal of ${district.name}. The district is covered from ${hub?.name ?? district.headquarters}. A written quote follows a measurement of the actual opening.`,
    },
    {
      type: "links",
      title: `Town pages in ${district.name}`,
      links: places.map((place) => ({ href: placeHref(place), label: place.name })),
    },
    {
      type: "links",
      title: `Mandal directory for ${district.name}`,
      keep: true,
      links: district.mandals.map((mandal) => ({ href: mandalPath(district.slug, mandal.slug), label: mandal.name })),
    },
    ...(hub
      ? [{
          type: "links" as const,
          title: `Services booked from ${hub.name}`,
          links: services.map((service) => ({ href: serviceCityPath(service.slug, hub.slug), label: `${service.name} in ${hub.name}` })),
        }]
      : []),
    { type: "faqs", title: "Questions about this district", items: faqs },
    sourceLinks(district),
  );
  return base({
    id: `district:${district.slug}`,
    kind: "district",
    path: districtPath(district.slug),
    title: `Invisible Grills & Safety Nets in ${district.name} District`,
    description: `${district.name} district: ${district.divisions.length} revenue divisions and ${district.mandals.length} mandals. Free measurement booked from ${hub?.name ?? district.headquarters}, with the material grade written into the quote.`,
    h1: `Invisible grills and safety nets in ${district.name} district`,
    eyebrow: `${district.region} · ${district.mandals.length} mandals`,
    hero: `${facts} Invisible grills, safety nets, pigeon nets, bird spikes, cloth hangers and sports nets are measured across the district from ${hub?.name ?? district.headquarters}.`,
    ...shot(`district:${district.slug}`, "invisible-grills", hub?.photos),
    breadcrumb: crumb(
      { href: "/locations", label: "Locations" },
      { href: statePath(), label: STATE.name },
      { href: districtsIndexPath, label: "Districts" },
      { label: district.name },
    ),
    params: { state: STATE.slug, district: district.slug },
    quote: { city: `${district.name} district` },
    inputHash: hash({ kind: "district", district, hub: hub?.slug, places: places.map((place) => place.slug) }),
    modules,
  });
}

export function composeMandal(
  district: GeoDistrict,
  mandal: GeoMandal,
  services: Service[],
  place: City | undefined,
  content: PlaceContent | undefined,
  localities: Locality[],
) {
  const division = divisionOf(district, mandal);
  const hub = hubCityOf(district);
  const town = cityForMandal(district, mandal);
  const ulbs = ulbsForMandal(district, mandal);
  const siblings = division ? mandalsOf(district, division).filter((item) => item.slug !== mandal.slug) : [];
  const where = `${mandal.name} is a mandal in ${division ? `the ${division.name} revenue division of ` : ""}${district.name} district, ${district.region}.`;
  const visitFrom = town ?? hub;
  const villages = localities.filter((row) => row.kind === "village").map((row) => row.name);
  const colonies = localities.filter((row) => row.kind !== "village").map((row) => row.name);
  const serviceLinks: LinkItem[] = place
    ? services.map((service) => ({ href: serviceCityPath(service.slug, place.slug), label: `${service.name} in ${place.name}` }))
    : visitFrom
      ? services.map((service) => ({ href: serviceCityPath(service.slug, visitFrom.slug), label: `${service.name} in ${visitFrom.name}` }))
      : [];
  const modules: PageModule[] = [];
  if (place) {
    modules.push(
      { type: "prose", title: `Homes in ${place.name}`, paragraphs: [place.intro, `Housing we are asked to fit here: ${place.housing}.`, place.climate] },
      { type: "note", title: "What the quote should name here", text: place.materialHint },
      { type: "note", title: "How visits are scheduled", text: place.visitNote },
    );
  } else {
    modules.push({
      type: "prose",
      title: `${mandal.name} on the service map`,
      paragraphs: [
        where,
        visitFrom
          ? `Measurement visits for ${mandal.name} are planned with ${visitFrom.name}. ${visitFrom.visitNote}`
          : `Measurement visits are planned from ${district.headquarters}.`,
        "We have not yet written a local note for this mandal, so this page lists the administrative facts and the nearest page with a full local specification.",
      ],
    });
  }
  modules.push({
    type: "list",
    title: "Administrative details",
    items: [
      `District: ${district.name}`,
      division ? `Revenue division: ${division.name}` : "Revenue division: being confirmed against the latest notification",
      `Region: ${district.region}`,
      ...ulbs.map((ulb) => `Urban local body: ${ulb.name} (${ulbLabel[ulb.type].toLowerCase()})`),
      `District headquarters: ${district.headquarters}`,
    ],
  });
  if (villages.length) {
    const shown = villages.slice(0, 150);
    modules.push({
      type: "list",
      title: `Villages in ${mandal.name} mandal on our records`,
      items: [shown.join(", ") + (villages.length > shown.length ? ` and ${villages.length - shown.length} more` : "")],
    });
  }
  if (colonies.length || content?.localities.length) {
    modules.push({ type: "list", title: "Colonies and localities", items: [...new Set([...(content?.localities ?? []), ...colonies])] });
  }
  if (serviceLinks.length) {
    modules.push({ type: "links", title: place ? `Services in ${place.name}` : `Services, booked with ${visitFrom?.name}`, keep: true, links: serviceLinks });
  }
  const parents: LinkItem[] = [{ href: districtPath(district.slug), label: `${district.name} district` }];
  if (town) parents.push({ href: placeHref(town), label: `${town.name} town page` });
  else if (hub) parents.push({ href: placeHref(hub), label: `${hub.name} (district hub)` });
  modules.push(
    { type: "links", title: "Nearest full pages", keep: true, links: parents },
    ...(siblings.length
      ? [{ type: "links" as const, title: `Other mandals in ${division?.name} division`, keep: true, links: siblings.map((item) => ({ href: mandalPath(district.slug, item.slug), label: item.name })) }]
      : []),
    {
      type: "faqs",
      title: "Questions",
      items: [
        { q: `Do you install invisible grills and safety nets in ${mandal.name}?`, a: `Yes. ${mandal.name} is inside ${district.name} district, which is in scope. ${visitFrom ? visitFrom.visitNote : ""}`.trim() },
        ...(visitFrom ? [{ q: `Which material is usually discussed here?`, a: place?.materialHint ?? visitFrom.materialHint }] : []),
        { q: "Do you have an office in this mandal?", a: `No office is claimed in ${mandal.name}. Visits are scheduled from ${visitFrom?.name ?? district.headquarters}, and the date is confirmed after we know the village and the opening.` },
      ],
    },
    sourceLinks(district),
  );
  const name = place?.name ?? mandal.name;
  return base({
    id: `mandal:${district.slug}:${mandal.slug}`,
    kind: "mandal",
    path: mandalPath(district.slug, mandal.slug),
    title: `Invisible Grills & Safety Nets in ${name} Mandal, ${district.name}`,
    description: place
      ? `${place.intro.split(/(?<=\.)\s/)[0]} Free measurement in ${name}, ${district.name} district.`
      : `${where} Visits are booked with ${visitFrom?.name ?? district.headquarters}. Free measurement and a written quote.`,
    h1: `Invisible grills and safety nets in ${name} mandal`,
    eyebrow: `${district.name}${division ? ` · ${division.name} division` : ""}`,
    hero: place ? place.intro : `${where} Invisible grills, safety nets, pigeon nets and cloth hangers are measured here with the ${visitFrom?.name ?? district.headquarters} visit.`,
    ...shot(`mandal:${district.slug}:${mandal.slug}`, "balcony-safety-nets", place?.photos),
    breadcrumb: crumb(
      { href: statePath(), label: STATE.name },
      { href: districtPath(district.slug), label: district.name },
      { label: `${mandal.name} mandal` },
    ),
    params: { state: STATE.slug, district: district.slug, mandal: mandal.slug, ...(place ? { city: place.slug } : {}) },
    quote: { city: `${name}, ${district.name}` },
    inputHash: hash({ kind: "mandal", district: district.slug, mandal, content: content ?? null, localities: localities.length, town: town?.slug }),
    modules,
  });
}
