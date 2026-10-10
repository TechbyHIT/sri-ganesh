import type { MetadataRoute } from "next";
import { serviceLocations } from "@/data/serviceLocations";
import { site } from "@/data/site";
import { getActiveCities, getActiveLocalities, getLocationBySlug } from "@/lib/locations";
import { locationCityPath, locationLocalityPath, servicePath } from "@/lib/paths";
import { generateCanonicalUrl, locationDocument, serviceDocument, serviceLocationDocument } from "@/lib/seo";
import { getAllServices } from "@/lib/services";
import { indexableStaticPaths } from "@/lib/content/static-pages";
import { getPublishedMatrixPaths } from "@/lib/url-matrix/published";

/** Google's sitemap limit is 50,000 URLs. Stay under that per file. */
export const SITEMAP_SEGMENT_SIZE = 45000;

type Entry = {
  path: string;
  priority: number;
};

export function getSitemapSegments(): MetadataRoute.Sitemap[] {
  const entries = indexableEntries();
  const segments: MetadataRoute.Sitemap[] = [];

  for (let index = 0; index < entries.length; index += SITEMAP_SEGMENT_SIZE) {
    segments.push(entries.slice(index, index + SITEMAP_SEGMENT_SIZE).map(toSitemapItem));
  }

  return segments;
}

function indexableEntries(): Entry[] {
  const paths = new Set<string>();
  const entries: Entry[] = [];

  const add = (path: string, priority: number) => {
    const canonical = generateCanonicalUrl(path);

    if (paths.has(canonical)) {
      throw new Error(`Duplicate sitemap URL ${canonical}.`);
    }

    paths.add(canonical);
    entries.push({ path, priority });
  };

  add("/", 1);
  add("/services", 0.8);
  add("/locations", 0.8);

  for (const service of getAllServices()) {
    const document = serviceDocument(service.slug);

    if (document?.indexable) {
      add(servicePath(service.slug), 0.8);
    }
  }

  for (const city of getActiveCities()) {
    const document = locationDocument(city.slug);

    if (document?.indexable) {
      add(locationCityPath(city.slug), 0.7);
    }
  }

  for (const locality of getActiveLocalities()) {
    const document = locationDocument(locality.slug);

    if (document?.indexable) {
      add(locationLocalityPath(locality.citySlug, locality.slug), 0.6);
    }
  }

  for (const relation of serviceLocations) {
    if (!relation.active) {
      continue;
    }

    const location = getLocationBySlug(relation.locationSlug);
    const document = serviceLocationDocument(relation.serviceSlug, relation.locationSlug);

    if (location && document?.indexable) {
      add(document.path, location.type === "locality" ? 0.55 : 0.65);
    }
  }

  // Matrix pages the business approved. Empty today; candidates are never listed.
  for (const path of getPublishedMatrixPaths()) {
    add(path, 0.5);
  }

  for (const entry of indexableStaticPaths()) {
    add(entry.path, entry.priority);
  }

  add("/html-sitemap", 0.3);

  return entries;
}

export function getIndexableEntries(): { path: string; priority: number }[] {
  return indexableEntries();
}

function toSitemapItem(entry: Entry): MetadataRoute.Sitemap[number] {
  return {
    url: generateCanonicalUrl(entry.path),
    lastModified: site.contentUpdated,
    changeFrequency: "monthly",
    priority: entry.priority,
  };
}
