import { readStore } from "@/lib/store";
import { services, type Service } from "./services";

export const serviceFields = ["summary", "lede", "problems", "benefits", "where", "materials", "priceFactors", "faqs"] as const;

export function customServiceProblems(service: Service) {
  const problems: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)) problems.push("Slug must be lowercase words joined by hyphens");
  if (services.some((item) => item.slug === service.slug)) problems.push("Slug already used by a built-in service");
  if (service.name.trim().length < 4) problems.push("Name is too short");
  if (service.summary.trim().split(/\s+/).length < 10) problems.push("Summary needs at least 10 words");
  if (service.lede.trim().split(/\s+/).length < 40) problems.push("Introduction needs at least 40 words");
  for (const key of ["problems", "benefits", "where", "materials", "priceFactors"] as const) {
    if (service[key].filter(Boolean).length < 2) problems.push(`Add at least two items to ${key}`);
  }
  if (service.faqs.length < 1) problems.push("Add at least one FAQ");
  return problems;
}

export function allServices(): Service[] {
  const custom = readStore("services").filter((service) => !customServiceProblems(service).length);
  return [...services, ...custom];
}

export function findService(slug: string) {
  return allServices().find((service) => service.slug === slug);
}
