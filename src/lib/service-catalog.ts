import {
  catalogEntries,
  serviceCategories,
  type CatalogEntry,
  type ServiceCategory,
} from "@/data/service-catalog";
import { getServiceBySlug } from "@/lib/services";
import { servicePath } from "@/lib/paths";

export type CatalogSummary = {
  categories: number;
  entries: number;
  canonical: number;
  merged: number;
  unverified: number;
};

export function getCatalogCategories(): ServiceCategory[] {
  return serviceCategories;
}

export function getCatalogEntries(): CatalogEntry[] {
  return catalogEntries;
}

/** Entries shown to visitors: canonical and merged. Unverified work is not linked. */
export function getPublicCatalogEntries(categoryId?: string): CatalogEntry[] {
  return catalogEntries.filter(
    (item) => item.status !== "unverified" && (categoryId === undefined || item.categoryId === categoryId),
  );
}

/** Requests that are answered on the given page. */
export function getCatalogEntriesForPath(path: string): CatalogEntry[] {
  return getPublicCatalogEntries().filter((item) => item.canonicalPath === path);
}

/** Requests from the categories served by a service that lead to a different page. */
export function getCatalogLinksForService(serviceSlug: string): { href: string; label: string }[] {
  const own = servicePath(serviceSlug);
  const categoryIds = new Set(serviceCategories.filter((item) => item.serviceSlug === serviceSlug).map((item) => item.id));
  const seen = new Set<string>();
  const links: { href: string; label: string }[] = [];

  for (const item of getPublicCatalogEntries()) {
    if (!categoryIds.has(item.categoryId) || item.canonicalPath === own || seen.has(item.canonicalPath)) {
      continue;
    }

    seen.add(item.canonicalPath);
    links.push({ href: item.canonicalPath, label: item.name });
  }

  return links;
}

export function categoryPath(category: ServiceCategory): string {
  return servicePath(category.serviceSlug);
}

export function summarizeCatalog(): CatalogSummary {
  return {
    categories: serviceCategories.length,
    entries: catalogEntries.length,
    canonical: catalogEntries.filter((item) => item.status === "canonical").length,
    merged: catalogEntries.filter((item) => item.status === "merged").length,
    unverified: catalogEntries.filter((item) => item.status === "unverified").length,
  };
}

/** Throws when ids, slugs, or category links are inconsistent. */
export function validateCatalog(publishedPaths: ReadonlySet<string>): void {
  const categoryIds = new Set<string>();
  const categorySlugs = new Set<string>();

  for (const category of serviceCategories) {
    if (categoryIds.has(category.id) || categorySlugs.has(category.slug)) {
      throw new Error(`Duplicate service category "${category.id}".`);
    }

    if (!getServiceBySlug(category.serviceSlug)?.active) {
      throw new Error(`Category "${category.id}" points at an unknown service "${category.serviceSlug}".`);
    }

    categoryIds.add(category.id);
    categorySlugs.add(category.slug);
  }

  const ids = new Set<string>();
  const slugsByCategory = new Set<string>();

  for (const item of catalogEntries) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate catalog entry id "${item.id}".`);
    }

    const scoped = `${item.categoryId}/${item.slug}`;

    if (slugsByCategory.has(scoped)) {
      throw new Error(`Duplicate catalog slug "${scoped}".`);
    }

    if (!categoryIds.has(item.categoryId)) {
      throw new Error(`Catalog entry "${item.id}" has an unknown category.`);
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      throw new Error(`Catalog slug "${item.slug}" is not lowercase-hyphenated.`);
    }

    if (item.status !== "unverified" && !publishedPaths.has(item.canonicalPath)) {
      throw new Error(`Catalog entry "${item.id}" points at an unpublished path "${item.canonicalPath}".`);
    }

    if (item.status === "canonical" && item.canonicalPath !== servicePath(item.slug)) {
      throw new Error(`Canonical entry "${item.id}" must match its own service path.`);
    }

    ids.add(item.id);
    slugsByCategory.add(scoped);
  }
}
