import { priceGuides } from "@/data/materials";
import { cities, getCity } from "@/data/cities";
import { getIntent, getService, services } from "@/data/services";

export function comboSlug(serviceSlug: string, citySlug: string) {
  return `${serviceSlug}-in-${citySlug}`;
}

export function parseCombo(slug: string) {
  const ordered = [...cities].sort((a, b) => b.slug.length - a.slug.length);
  const city = ordered.find((item) => slug.endsWith(`-in-${item.slug}`));
  if (!city) return undefined;
  const serviceSlug = slug.slice(0, -(city.slug.length + 4));
  const service = getService(serviceSlug);
  if (!service) return undefined;
  return { service, city };
}

export function allFlatSlugs() {
  const slugs = [
    ...services.map((service) => service.slug),
    ...services.flatMap((service) => service.intents.map((intent) => intent.slug)),
    ...priceGuides.map((guide) => guide.slug),
    ...services.flatMap((service) => cities.map((city) => comboSlug(service.slug, city.slug))),
  ];
  return slugs;
}

export function resolveFlat(slug: string) {
  const service = getService(slug);
  if (service) return { kind: "service" as const, service };
  const intent = getIntent(slug);
  if (intent) return { kind: "intent" as const, ...intent };
  const guide = priceGuides.find((item) => item.slug === slug);
  if (guide) return { kind: "price" as const, guide, service: getService(guide.service)! };
  const combo = parseCombo(slug);
  if (combo) return { kind: "combo" as const, ...combo };
  return undefined;
}

export function cityHref(slug: string) {
  return `/locations/andhra-pradesh/${slug}`;
}

export function serviceHref(slug: string) {
  return `/services/${slug}`;
}

export const popularLinks = [
  { href: "/services/invisible-grills/visakhapatnam", label: "Invisible grills in Visakhapatnam" },
  { href: "/services/balcony-safety-nets/vijayawada", label: "Balcony safety nets in Vijayawada" },
  { href: "/services/pigeon-nets/kakinada", label: "Pigeon nets in Kakinada" },
  { href: "/services/children-safety-nets/tirupati", label: "Children safety nets in Tirupati" },
  { href: "/services/cloth-hangers/eluru", label: "Cloth hangers in Eluru" },
  { href: "/services/cricket-nets/guntur", label: "Cricket nets in Guntur" },
  { href: "/services/anti-bird-spikes/kurnool", label: "Anti bird spikes in Kurnool" },
  { href: "/services/safety-nets/nellore", label: "Safety nets in Nellore" },
  { href: "/services/invisible-grills/rajahmundry", label: "Invisible grills in Rajamahendravaram" },
  { href: "/services/terrace-safety-nets/anantapur", label: "Terrace safety nets in Anantapur" },
  { href: "/services/duct-area-nets/visakhapatnam", label: "Duct nets in Visakhapatnam" },
  { href: "/services/mosquito-nets/amalapuram", label: "Mosquito nets in Amalapuram" },
  { href: "/services/cat-safety-nets/vijayawada", label: "Cat safety nets in Vijayawada" },
  { href: "/services/monkey-safety-nets/paderu", label: "Monkey safety nets in Paderu" },
  { href: "/services/transparent-balcony-nets/visakhapatnam", label: "Transparent balcony nets in Visakhapatnam" },
  { href: "/services/building-covering-nets/guntur", label: "Building covering nets in Guntur" },
  { href: "/services/invisible-grills/mangalagiri", label: "Invisible grills in Mangalagiri" },
  { href: "/services/pigeon-nets/tanuku", label: "Pigeon nets in Tanuku" },
  { href: "/services/balcony-safety-nets/bapatla", label: "Balcony safety nets in Bapatla" },
];

export function relatedCombos(serviceSlug: string, take = 8) {
  return cities.slice(0, take).map((city) => ({
    href: `/services/${serviceSlug}/${city.slug}`,
    label: `${getService(serviceSlug)?.name ?? "Service"} in ${city.name}`,
  }));
}

export function hubCities() {
  return ["visakhapatnam", "vijayawada", "kakinada", "rajahmundry", "guntur", "nellore", "tirupati", "kurnool"]
    .map((slug) => getCity(slug)!)
    .filter(Boolean);
}
