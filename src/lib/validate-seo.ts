import "@/lib/internal-links";
import { business } from "@/data/business";
import { seo } from "@/data/seo";
import { serviceLocations } from "@/data/serviceLocations";
import {
  calculateContentQuality,
  getFaqs,
  getServiceCityContent,
  getServiceLocalityContent,
} from "@/lib/content";
import { getActiveCities, getActiveLocalities, getLocationBySlug } from "@/lib/locations";
import { locationCityPath, locationLocalityPath, servicePath } from "@/lib/paths";
import {
  faqSchema,
  locationPageSchema,
  organizationSchema,
  serviceLocationSchema,
  serviceSchema,
  websiteSchema,
} from "@/lib/schema";
import {
  generateCanonicalUrl,
  locationDocument,
  serviceDocument,
  serviceLocationDocument,
} from "@/lib/seo";
import { getAllServices, getServiceBySlug, getServiceFAQs } from "@/lib/services";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const blockedSchema = ["aggregateRating", "review", "price", "priceRange"];

type IndexablePage = {
  label: string;
  title: string;
  description: string;
  path: string;
  body: string;
};

export function validateSeo(): void {
  const pages: IndexablePage[] = [
    {
      label: "home",
      title: seo.home.title,
      description: seo.home.description,
      path: "/",
      body: seo.home.description,
    },
    {
      label: "services index",
      title: seo.servicesIndex.title,
      description: seo.servicesIndex.description,
      path: "/services",
      body: seo.servicesIndex.description,
    },
    {
      label: "locations index",
      title: seo.locationsIndex.title,
      description: seo.locationsIndex.description,
      path: "/locations",
      body: seo.locationsIndex.description,
    },
    {
      label: "html sitemap",
      title: "HTML sitemap",
      description: "Published Sri Ganesha pages: services, cities, and the service-and-place pairs that are already live.",
      path: "/html-sitemap",
      body: "Published pages for services, cities, and confirmed service and place pairs. Unpublished towns are not listed.",
    },
  ];

  for (const service of getAllServices()) {
    assertSlug(service.slug, `service ${service.id}`);

    if (!service.indexable) {
      continue;
    }

    const document = serviceDocument(service.slug);

    if (!document) {
      throw new Error(`Indexable service "${service.slug}" did not produce metadata.`);
    }

    pages.push({
      label: `service ${service.slug}`,
      title: document.title,
      description: document.description,
      path: document.path,
      body: `${service.description} ${service.benefits.join(" ")}`,
    });

    if (getServiceFAQs(service.slug).length === 0) {
      throw new Error(`Indexable service "${service.slug}" has no visible FAQs.`);
    }

    assertSchema(serviceSchema(service), `service ${service.slug}`);
  }

  for (const location of [...getActiveCities(), ...getActiveLocalities()]) {
    assertSlug(location.slug, `location ${location.id}`);

    if (!location.indexable) {
      continue;
    }

    const document = locationDocument(location.slug);

    if (!document) {
      throw new Error(`Indexable location "${location.slug}" did not produce metadata.`);
    }

    pages.push({
      label: `location ${location.slug}`,
      title: document.title,
      description: document.description,
      path: document.path,
      body: location.description,
    });

    assertSchema(locationPageSchema(location), `location ${location.slug}`);
  }

  for (const relation of serviceLocations) {
    const service = getServiceBySlug(relation.serviceSlug);
    const location = getLocationBySlug(relation.locationSlug);

    if (!service || !location) {
      throw new Error(
        `Invalid service location relationship ${relation.serviceSlug} + ${relation.locationSlug}.`,
      );
    }

    if (!relation.active || !relation.indexable) {
      continue;
    }

    const document = serviceLocationDocument(service.slug, location.slug);
    const page =
      location.type === "locality"
        ? getServiceLocalityContent(service.slug, location.citySlug, location.slug)
        : getServiceCityContent(service.slug, location.slug);
    const quality = page ? calculateContentQuality(page) : undefined;

    if (!page || !quality) {
      throw new Error(`No content generated for ${service.slug} + ${location.slug}.`);
    }

    if (quality.indexable !== Boolean(document?.indexable)) {
      throw new Error(
        `Content quality for ${service.slug} + ${location.slug} is ${quality.score} (${quality.indexable ? "indexable" : "noindex"}) but metadata does not match. ${quality.reasons.join(" ")}`,
      );
    }

    if (relation.localIntroduction.trim().length < 80 || relation.uniqueContent.trim().length < 80) {
      throw new Error(
        `Indexable relationship ${service.slug} + ${location.slug} does not have enough unique content.`,
      );
    }

    assertSchema(
      serviceLocationSchema(service, location, relation),
      `${service.slug} + ${location.slug}`,
    );

    if (relation.localFAQs.length > 0) {
      const faq = faqSchema(relation.localFAQs);

      if (!faq) {
        throw new Error(`FAQ schema missing for ${service.slug} + ${location.slug}.`);
      }

      assertSchema(faq, `${service.slug} + ${location.slug} FAQ`);
    }
  }

  const canonicals = new Set<string>();

  for (const page of pages) {
    assertPage(page);

    const canonical = generateCanonicalUrl(page.path);

    if (canonicals.has(canonical)) {
      throw new Error(`Duplicate canonical URL ${canonical}.`);
    }

    canonicals.add(canonical);

    if (canonical !== generateCanonicalUrl(`${page.path}/`)) {
      throw new Error(`Trailing slash changed the canonical for ${page.path}.`);
    }

    if (canonical !== generateCanonicalUrl(`${page.path}?utm=1`)) {
      throw new Error(`Query string changed the canonical for ${page.path}.`);
    }
  }

  if (getFaqs({ scope: "home" }).length === 0) {
    throw new Error("Homepage FAQs are missing.");
  }

  const organization = organizationSchema();
  const website = websiteSchema();
  assertSchema(organization, "organization");
  assertSchema(website, "website");

  if (!business.address && "address" in organization) {
    throw new Error("Organization schema includes an address that is not in business data.");
  }

  const serialized = JSON.stringify({ organization, website });

  for (const key of blockedSchema) {
    if (serialized.includes(`"${key}"`)) {
      throw new Error(`Schema includes unsupported field "${key}".`);
    }
  }

  for (const path of [servicePath("invisible-grills"), locationCityPath("visakhapatnam"), locationLocalityPath("visakhapatnam", "madhurawada")]) {
    if (!canonicals.has(generateCanonicalUrl(path))) {
      throw new Error(`Expected indexable canonical missing for ${path}.`);
    }
  }
}

function assertPage(page: IndexablePage): void {
  if (!page.title.trim()) {
    throw new Error(`${page.label} is missing a title.`);
  }

  if (!page.description.trim()) {
    throw new Error(`${page.label} is missing a description.`);
  }

  if (page.description.length > 160) {
    throw new Error(`${page.label} description is longer than 160 characters.`);
  }

  if (!page.path.startsWith("/")) {
    throw new Error(`${page.label} is missing a canonical path.`);
  }

  if (page.body.trim().length < 40) {
    throw new Error(`${page.label} is indexable without enough content.`);
  }
}

function assertSlug(slug: string, label: string): void {
  if (!slugPattern.test(slug)) {
    throw new Error(`${label} slug "${slug}" must be lowercase and hyphenated.`);
  }
}

function assertSchema(data: Record<string, unknown>, label: string): void {
  if (data["@context"] !== "https://schema.org" || typeof data["@type"] !== "string") {
    throw new Error(`Invalid schema for ${label}.`);
  }

  const serialized = JSON.stringify(data);

  for (const key of blockedSchema) {
    if (serialized.includes(`"${key}"`)) {
      throw new Error(`${label} schema includes unsupported field "${key}".`);
    }
  }
}

validateSeo();
