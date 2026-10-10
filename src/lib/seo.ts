import type { Metadata } from "next";
import { business } from "@/data/business";
import { seo } from "@/data/seo";
import { site } from "@/data/site";
import type { Location } from "@/data/locations";
import {
  calculateContentQuality,
  getCityContent,
  getLocalityContent,
  getServiceCityContent,
  getServiceContent,
  getServiceLocalityContent,
} from "@/lib/content";
import { getLocationBySlug, getServiceLocation } from "@/lib/locations";
import {
  locationCityPath,
  locationLocalityPath,
  serviceCityPath,
  serviceLocalityPath,
} from "@/lib/paths";
import { getServiceBySlug, getServiceSEO } from "@/lib/services";

export type RobotsDirective = {
  index: boolean;
  follow: true;
};

type ShareImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

type SeoDocument = {
  title: string;
  description: string;
  path: string;
  indexable: boolean;
  absoluteTitle?: boolean;
  image?: ShareImage;
};

const defaultImage: ShareImage = {
  url: "/brand/hero.svg",
  alt: "Sri Ganesha Home Safety Solutions",
  width: 800,
  height: 640,
};

export function generateCanonicalUrl(path: string): string {
  const origin = canonicalOrigin();
  const pathname = normalizePath(path);

  if (pathname === "/") {
    return origin;
  }

  return `${origin}${pathname}`;
}

export function robotsFor(indexable: boolean): RobotsDirective {
  return { index: indexable, follow: true };
}

export function generateServiceMetadata(serviceSlug: string): Metadata {
  const document = serviceDocument(serviceSlug);
  return document ? toMetadata(document) : getNotFoundMetadata();
}

export function generateLocationMetadata(locationSlug: string): Metadata {
  const document = locationDocument(locationSlug);
  return document ? toMetadata(document) : getNotFoundMetadata();
}

/**
 * Metadata for a published service + location pairing.
 * Returns noindex metadata when the service, location, or relationship is missing.
 * Those combinations are not sitemap entries and must 404 at the route layer.
 */
export function generateServiceLocationMetadata(
  serviceSlug: string,
  locationSlug: string,
): Metadata {
  const document = serviceLocationDocument(serviceSlug, locationSlug);
  return document ? toMetadata(document) : getNotFoundMetadata();
}

export function getHomeMetadata(): Metadata {
  return toMetadata({
    title: seo.home.title,
    description: seo.home.description,
    path: "/",
    indexable: true,
    absoluteTitle: true,
    image: {
      url: "/home/hero-invisible-grills.webp",
      alt: "Apartment balcony with slim stainless-steel safety cables and an open view",
      width: 1600,
      height: 900,
    },
  });
}

export function getServicesIndexMetadata(): Metadata {
  return toMetadata({
    title: seo.servicesIndex.title,
    description: seo.servicesIndex.description,
    path: "/services",
    indexable: true,
  });
}

export function getLocationsIndexMetadata(): Metadata {
  return toMetadata({
    title: seo.locationsIndex.title,
    description: seo.locationsIndex.description,
    path: "/locations",
    indexable: true,
  });
}

export function generatePathMetadata(document: {
  title: string;
  description: string;
  path: string;
  indexable: boolean;
}): Metadata {
  return toMetadata(document);
}

export function getNotFoundMetadata(): Metadata {
  return {
    title: seo.notFound.title,
    description: seo.notFound.description,
    robots: { index: false, follow: true },
  };
}

export function serviceDocument(serviceSlug: string): SeoDocument | undefined {
  const record = getServiceSEO(serviceSlug);

  if (!record) {
    return undefined;
  }

  return {
    title: record.title,
    description: record.description,
    path: record.path,
    indexable: record.indexable && contentIsIndexable(getServiceContent(serviceSlug)),
    image: {
      url: record.image.src,
      alt: record.image.alt,
      width: record.image.width,
      height: record.image.height,
    },
  };
}

export function locationDocument(locationSlug: string): SeoDocument | undefined {
  const location = publishedLocation(locationSlug);

  if (!location || location.type === "state") {
    return undefined;
  }

  return {
    title: location.seo.title,
    description: location.seo.description,
    path: locationPath(location),
    indexable:
      location.indexable &&
      contentIsIndexable(
        location.type === "locality"
          ? getLocalityContent(location.citySlug, location.slug)
          : getCityContent(location.slug),
      ),
  };
}

export function serviceLocationDocument(
  serviceSlug: string,
  locationSlug: string,
): SeoDocument | undefined {
  const service = getServiceBySlug(serviceSlug);
  const location = publishedLocation(locationSlug);
  const relation = getServiceLocation(serviceSlug, locationSlug);

  if (!service?.active || !location || location.type === "state" || !relation) {
    return undefined;
  }

  const place =
    location.type === "locality" ? `${location.name}, ${location.city}` : location.name;
  const image = service.heroImage;

  return {
    title: `${service.name} in ${place}`,
    description: trimDescription(relation.localIntroduction),
    path: serviceLocationPath(service.slug, location),
    indexable:
      Boolean(service.indexable && location.indexable && relation.indexable) &&
      contentIsIndexable(
        location.type === "locality"
          ? getServiceLocalityContent(service.slug, location.citySlug, location.slug)
          : getServiceCityContent(service.slug, location.slug),
      ),
    image: {
      url: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    },
  };
}

function toMetadata(document: SeoDocument): Metadata {
  const description = trimDescription(document.description);
  const canonical = generateCanonicalUrl(document.path);
  const shareTitle = document.absoluteTitle
    ? document.title
    : `${document.title} | ${site.name}`;
  const image = document.image ?? defaultImage;

  return {
    title: document.absoluteTitle ? { absolute: document.title } : document.title,
    description,
    alternates: { canonical },
    robots: robotsFor(document.indexable),
    openGraph: {
      title: shareTitle,
      description,
      url: canonical,
      type: "website",
      locale: site.locale,
      siteName: site.name,
      images: [
        {
          url: image.url,
          alt: image.alt,
          width: image.width,
          height: image.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [image.url],
    },
  };
}

function publishedLocation(slug: string): Location | undefined {
  const location = getLocationBySlug(slug);
  return location?.active ? location : undefined;
}

function locationPath(location: Location): string {
  if (location.type === "locality") {
    return locationLocalityPath(location.citySlug, location.slug);
  }

  return locationCityPath(location.slug);
}

function serviceLocationPath(serviceSlug: string, location: Location): string {
  if (location.type === "locality") {
    return serviceLocalityPath(serviceSlug, location.citySlug, location.slug);
  }

  return serviceCityPath(serviceSlug, location.slug);
}

function canonicalOrigin(): string {
  const url = new URL(business.website);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (!local) {
    url.protocol = "https:";
  }

  return url.origin;
}

function normalizePath(path: string): string {
  const trimmed = path.trim();
  let pathname = trimmed;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    pathname = new URL(trimmed).pathname;
  }

  pathname = pathname.split("?")[0]?.split("#")[0] ?? "/";
  pathname = pathname.toLowerCase();

  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return pathname || "/";
}

function contentIsIndexable(page: Parameters<typeof calculateContentQuality>[0] | undefined): boolean {
  return Boolean(page && calculateContentQuality(page).indexable);
}

function trimDescription(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= 160) {
    return normalized;
  }

  const firstSentence = normalized.split(/(?<=\.)\s/)[0]?.trim() ?? normalized;

  if (firstSentence.length >= 50 && firstSentence.length <= 160) {
    return firstSentence;
  }

  const cut = normalized.slice(0, 157);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 80 ? lastSpace : 157).trimEnd().replace(/[.,;:]$/, "");
}
