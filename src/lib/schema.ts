import { business, type BusinessAddress } from "@/data/business";
import type { Location } from "@/data/locations";
import type { Service } from "@/data/services";
import type { ServiceLocation } from "@/data/serviceLocations";
import { site } from "@/data/site";
import type { BreadcrumbItem } from "@/lib/breadcrumbs";
import { serviceCityPath, serviceLocalityPath } from "@/lib/paths";
import { generateCanonicalUrl } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/services";

type JsonObject = Record<string, unknown>;

export function websiteSchema(): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: business.name,
    url: generateCanonicalUrl("/"),
    publisher: { "@id": organizationId() },
    inLanguage: site.language,
  };
}

export function organizationSchema(): JsonObject {
  const sameAs = business.socialProfiles.filter(Boolean);
  const address = postalAddress(business.address);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: business.name,
    url: generateCanonicalUrl("/"),
    logo: generateCanonicalUrl(business.logo),
    areaServed: business.serviceArea,
    ...(business.email ? { email: business.email } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(address ? { address } : {}),
  };
}

export function serviceSchema(service: Service): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.shortDescription,
    url: generateCanonicalUrl(`/services/${service.slug}`),
    serviceType: service.name,
    areaServed: business.serviceArea,
    provider: { "@id": organizationId() },
  };
}

export function serviceLocationSchema(
  service: Service,
  location: Location,
  relation: ServiceLocation,
): JsonObject {
  const place = location.type === "locality" ? `${location.name}, ${location.city}` : location.name;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} in ${place}`,
    description: relation.localIntroduction,
    url: generateCanonicalUrl(
      location.type === "locality"
        ? serviceLocalityPath(service.slug, location.citySlug, location.slug)
        : serviceCityPath(service.slug, location.slug),
    ),
    serviceType: service.name,
    areaServed: {
      "@type": "Place",
      name: location.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.state,
      },
    },
    provider: { "@id": organizationId() },
  };
}

export function locationPageSchema(location: Location): JsonObject {
  const services = location.serviceAvailability
    .map((slug) => getServiceBySlug(slug))
    .filter((service): service is Service => Boolean(service?.active))
    .map((service) => ({
      "@type": "Service",
      name: service.name,
      url: generateCanonicalUrl(`/services/${service.slug}`),
    }));

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: location.seo.title,
    description: location.seo.description,
    url: generateCanonicalUrl(locationUrl(location)),
    about: {
      "@type": "Place",
      name: location.name,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.state,
      },
    },
    ...(services.length > 0 ? { mentions: services } : {}),
  };
}

export function homeLocalBusinessSchema(): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${generateCanonicalUrl("/")}#local`,
    name: business.name,
    url: generateCanonicalUrl("/"),
    image: generateCanonicalUrl("/home/hero-invisible-grills.webp"),
    description: site.description,
    areaServed: business.serviceArea,
    parentOrganization: { "@id": organizationId() },
    ...(business.email ? { email: business.email } : {}),
    ...(business.phone ? { telephone: business.phone } : {}),
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: generateCanonicalUrl(item.href),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonObject | undefined {
  const visible = items.filter((item) => item.question.trim() && item.answer.trim());

  if (visible.length === 0) {
    return undefined;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visible.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function organizationId(): string {
  return `${generateCanonicalUrl("/")}#organization`;
}

function locationUrl(location: Location): string {
  if (location.type === "locality") {
    return `/locations/${location.citySlug}/${location.slug}`;
  }

  return `/locations/${location.slug}`;
}

function postalAddress(address: BusinessAddress | undefined): JsonObject | undefined {
  if (!address) {
    return undefined;
  }

  const complete = [
    address.streetAddress,
    address.addressLocality,
    address.addressRegion,
    address.postalCode,
    address.addressCountry,
  ].every((part) => part.trim().length > 0);

  if (!complete) {
    return undefined;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: address.addressCountry,
  };
}
