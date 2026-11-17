import { site } from "@/config/site";
import type { Service } from "@/data/services";
import type { FaqItem } from "./types";

/** Phrases that stay on the commercial page. They do not get their own URL. */
export const blockedModifierPages = ["best", "cheap", "cheapest", "affordable", "near-me"] as const;

export function keywordBrief(service: Service, place: string) {
  return {
    primary: `${service.name} in ${place}`,
    secondary: [
      `${service.name} installation in ${place}`,
      `${service.name} quotation in ${place}`,
      `${service.name} for apartments`,
      `${service.name} for houses`,
    ],
    keptOnThisPage: ["installation", "quotation", "apartments", "houses"],
    notSeparatePages: blockedModifierPages,
  };
}

export function enquiryNote(place: string) {
  return `Request a quotation on ${site.phoneDisplay} or WhatsApp. Say you are in ${place}, name the opening, and send a photograph if you have one. Measurement is arranged before a figure is written. This page does not publish a rupee rate, a warranty period, or a promise of same-day fitting.`;
}

export function materialCaveat(service: Service, localHint?: string) {
  return `Named for ${service.name}: ${service.materials.join("; ")}. ${localHint ?? ""} A brand, a thickness, a lifespan, or a warranty term that is not in that list is not confirmed, and it is not quoted until the opening is seen.`;
}

export function fittingSteps(visit?: string) {
  return [
    { title: "Enquiry", text: `Call or WhatsApp ${site.phoneDisplay}. Share the town, the opening, and whether the worry is a fall, birds, drying, or sport.` },
    { title: "Requirement", text: "The conversation names who uses the space and which category fits. A balcony net, a cable grill, and a pigeon net are not interchangeable." },
    { title: "Measurement", text: visit ?? "Size, substrate, access, and the people or birds using the space are checked before a system is recommended." },
    { title: "Quotation", text: "Materials, grades, and labour are listed. No statewide rate is treated as the price of this opening." },
    { title: "Material named in the quote", text: "The grade or mesh is the one written down. A package name is not a specification." },
    { title: "Installation", text: "The team fits to the measured line, including corners, pipes, and the finish you were shown." },
    { title: "Handover", text: "You see how tension, a removable edge, or a pulley should look, and what to check after monsoon. That is not a warranty period." },
  ];
}

export function commercialFaqs(service: Service, place: string, visit: string, hint: string): FaqItem[] {
  return [
    {
      q: `How do I request a quotation for ${service.name} in ${place}?`,
      a: enquiryNote(place),
    },
    {
      q: `Which material is discussed for ${place}?`,
      a: hint,
    },
    {
      q: `Is ${service.name} suitable for an apartment in ${place}?`,
      a: `Apartment work needs the opening measured and, where the facade or duct is common, the association's permission. ${visit}`,
    },
    {
      q: `How much does ${service.name} cost in ${place}?`,
      a: `No price is published for ${place}. ${service.priceFactors[0] ?? "The opening"} is usually the first line of the quote. The figure is written after measurement.`,
    },
    {
      q: `How long does installation take in ${place}?`,
      a: `The quote states the visit plan. A single straight opening is often one visit after materials are ready. Several openings, high floors, or awkward access take longer. No duration is guaranteed for every building in ${place}.`,
    },
    {
      q: `What maintenance should I expect?`,
      a: "After monsoon, check tension, hooks, or mesh edges. The handover explains what to look at. A care interval is not printed as a warranty.",
    },
  ];
}

export function mergeFaqs(primary: FaqItem[], extra: FaqItem[], max = 8) {
  const seen = new Set<string>();
  const items: FaqItem[] = [];
  for (const item of [...primary, ...extra]) {
    const key = item.q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(item);
    if (items.length >= max) break;
  }
  return items;
}
