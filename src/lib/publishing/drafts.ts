import { guides } from "@/data/guides";
import { problems } from "@/data/problems";
import { serviceLocations } from "@/data/serviceLocations";
import { PUBLISHING } from "@/config/publishing";
import { staticPages } from "@/lib/content/static-pages";
import {
  calculateContentQuality,
  getCityContent,
  getLocalityContent,
  getServiceCityContent,
  getServiceContent,
  getServiceLocalityContent,
  type PageContent,
} from "@/lib/content";
import { getActiveCities, getActiveLocalities, getLocationBySlug } from "@/lib/locations";
import { locationCityPath, locationLocalityPath, serviceCityPath, serviceLocalityPath, servicePath } from "@/lib/paths";
import { hasPlaceholder } from "@/lib/content/placeholders";
import { wordCount } from "@/lib/seo/similarity";
import { getAllServices } from "@/lib/services";

export type DraftRecord = {
  path: string;
  slug: string;
  pageType: string;
  title: string;
  metaDescription: string;
  h1: string;
  body: string;
  serviceSlug: string;
  locationSlug: string;
  minimumWordCount: number;
  qualityScore: number;
  localDataVerified: boolean;
};

export const PAGE_RECORD_TARGET = 50000;

export function buildDraftRecords(): DraftRecord[] {
  const records: DraftRecord[] = [];

  for (const page of staticPages) {
    records.push({
      path: page.path,
      slug: page.path === "/" ? "home" : page.path.slice(1),
      pageType: "core",
      title: page.title,
      metaDescription: page.description,
      h1: page.h1,
      body: page.sections.map((section) => `${section.heading} ${section.paragraphs.join(" ")}`).join(" "),
      serviceSlug: "",
      locationSlug: "",
      minimumWordCount: 700,
      qualityScore: page.indexable ? 75 : 40,
      localDataVerified: false,
    });
  }

  for (const service of getAllServices()) {
    const content = getServiceContent(service.slug);
    records.push(
      fromContent({
        path: servicePath(service.slug),
        slug: service.slug,
        pageType: "service",
        title: service.seoTitle,
        metaDescription: service.seoDescription,
        content,
        serviceSlug: service.slug,
        locationSlug: "",
        minimumWordCount: PUBLISHING.wordTargets.service,
        localDataVerified: true,
      }),
    );
  }

  for (const city of getActiveCities()) {
    records.push(
      fromContent({
        path: locationCityPath(city.slug),
        slug: city.slug,
        pageType: "location",
        title: city.seo.title,
        metaDescription: city.seo.description,
        content: getCityContent(city.slug),
        serviceSlug: "",
        locationSlug: city.slug,
        minimumWordCount: PUBLISHING.wordTargets.location,
        localDataVerified: city.indexable,
      }),
    );
  }

  for (const locality of getActiveLocalities()) {
    records.push(
      fromContent({
        path: locationLocalityPath(locality.citySlug, locality.slug),
        slug: locality.slug,
        pageType: "area",
        title: locality.seo.title,
        metaDescription: locality.seo.description,
        content: getLocalityContent(locality.citySlug, locality.slug),
        serviceSlug: "",
        locationSlug: locality.slug,
        minimumWordCount: PUBLISHING.wordTargets.location,
        localDataVerified: locality.indexable,
      }),
    );
  }

  for (const relation of serviceLocations) {
    if (!relation.active) {
      continue;
    }

    const location = getLocationBySlug(relation.locationSlug);

    if (!location || location.type === "state") {
      continue;
    }

    const locality = location.type === "locality";
    const content = locality
      ? getServiceLocalityContent(relation.serviceSlug, location.citySlug, location.slug)
      : getServiceCityContent(relation.serviceSlug, location.slug);

    records.push(
      fromContent({
        path: locality
          ? serviceLocalityPath(relation.serviceSlug, location.citySlug, location.slug)
          : serviceCityPath(relation.serviceSlug, location.slug),
        slug: `${location.slug}-${relation.serviceSlug}`,
        pageType: locality ? "service-area" : "service-location",
        title: content?.h1 ?? `${relation.serviceSlug} in ${location.name}`,
        metaDescription: relation.localIntroduction,
        content,
        serviceSlug: relation.serviceSlug,
        locationSlug: location.slug,
        minimumWordCount: locality
          ? PUBLISHING.wordTargets["service-area"]
          : PUBLISHING.wordTargets["service-location"],
        localDataVerified: Boolean(relation.localIntroduction && relation.uniqueContent),
      }),
    );
  }

  for (const guide of guides) {
    records.push({
      path: `/guides/${guide.slug}`,
      slug: guide.slug,
      pageType: "guide",
      title: guide.title,
      metaDescription: guide.description,
      h1: guide.h1,
      body: guide.sections.map((section) => section.paragraphs.join(" ")).join(" "),
      serviceSlug: "",
      locationSlug: "",
      minimumWordCount: PUBLISHING.wordTargets.guide,
      qualityScore: 75,
      localDataVerified: false,
    });
  }

  for (const problem of problems) {
    records.push({
      path: `/solutions/${problem.slug}`,
      slug: problem.slug,
      pageType: "solution",
      title: problem.title,
      metaDescription: problem.description,
      h1: problem.h1,
      body: problem.sections.map((section) => section.paragraphs.join(" ")).join(" "),
      serviceSlug: problem.serviceSlug,
      locationSlug: "",
      minimumWordCount: 900,
      qualityScore: 75,
      localDataVerified: false,
    });
  }

  return records.filter((record) => record.path && !hasPlaceholder(record.title));
}

function fromContent(input: {
  path: string;
  slug: string;
  pageType: string;
  title: string;
  metaDescription: string;
  content: PageContent | undefined;
  serviceSlug: string;
  locationSlug: string;
  minimumWordCount: number;
  localDataVerified: boolean;
}): DraftRecord {
  const body = input.content
    ? [input.content.introduction, input.content.overview, input.content.localInformation].join(" ")
    : "";
  const quality = input.content ? calculateContentQuality(input.content).score : 0;

  return {
    path: input.path,
    slug: input.slug,
    pageType: input.pageType,
    title: input.title,
    metaDescription: input.metaDescription,
    h1: input.content?.h1 ?? input.title,
    body,
    serviceSlug: input.serviceSlug,
    locationSlug: input.locationSlug,
    minimumWordCount: input.minimumWordCount,
    qualityScore: quality,
    localDataVerified: input.localDataVerified,
  };
}

export function countDraftsByType(records: DraftRecord[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const record of records) {
    counts[record.pageType] = (counts[record.pageType] ?? 0) + 1;
  }

  return counts;
}

export { wordCount };
