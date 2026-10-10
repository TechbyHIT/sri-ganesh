import { describe, expect, it } from "vitest";
import { catalogEntries, serviceCategories } from "@/data/service-catalog";
import { allRedirects, catalogAliasRedirects } from "@/lib/routing/redirects";
import {
  getCatalogEntriesForPath,
  getCatalogLinksForService,
  getPublicCatalogEntries,
  summarizeCatalog,
  validateCatalog,
} from "@/lib/service-catalog";
import { getIndexableEntries } from "@/lib/sitemap-data";
import { serviceMenuColumns } from "@/lib/site-menu";

const supplied: Record<string, string[]> = {
  "Invisible Grills": [
    "Invisible Grills",
    "Balcony Invisible Grills",
    "Window Invisible Grills",
    "Invisible Grills for Apartments",
    "Invisible Grills for Villas",
    "Invisible Grills for Child Safety",
    "Invisible Grills for Pets",
  ],
  "Safety Nets": ["Safety Nets", "Balcony Safety Nets", "Kids Safety Nets", "Child Safety Nets", "Pet Safety Nets", "Cat Safety Nets", "Dog Safety Nets"],
  "Balcony Nets": [
    "Balcony Nets",
    "Balcony Protection Nets",
    "Balcony Children Safety Nets",
    "Balcony Pet Safety Nets",
    "Balcony Cat Nets",
    "Apartment Balcony Nets",
    "High Rise Balcony Nets",
  ],
  "Bird Nets": ["Bird Nets", "Anti Bird Nets", "Bird Protection Nets", "Balcony Bird Nets", "Window Bird Nets", "Duct Area Bird Nets"],
  "Pigeon Nets": ["Pigeon Nets", "Anti Pigeon Nets", "Pigeon Safety Nets", "Balcony Pigeon Nets", "Window Pigeon Nets", "Duct Area Pigeon Nets"],
  "Sports Nets": ["Sports Nets", "Cricket Nets", "Cricket Practice Nets", "Football Nets", "Football Goal Nets", "Golf Nets", "Volleyball Nets"],
  "Cloth Hangers": [
    "Cloth Hangers",
    "Ceiling Cloth Hangers",
    "Balcony Cloth Hangers",
    "Wall Mounted Cloth Hangers",
    "Pulley Cloth Hangers",
    "Stainless Steel Cloth Hangers",
    "Clothes Drying Hangers",
  ],
  "Bird Spikes": [
    "Bird Spikes",
    "Pigeon Spikes",
    "Anti Bird Spikes",
    "Anti Pigeon Spikes",
    "Bird Control Spikes",
    "Pigeon Control Spikes",
    "Stainless Steel Bird Spikes",
  ],
};

describe("supplied service catalog", () => {
  const published = new Set(getIndexableEntries().map((entry) => entry.path));

  it("keeps every supplied category and entry under its category, with no extras", () => {
    expect(serviceCategories.map((category) => category.name)).toEqual(Object.keys(supplied));

    for (const category of serviceCategories) {
      const names = catalogEntries.filter((item) => item.categoryId === category.id).map((item) => item.name);
      expect(names).toEqual(supplied[category.name]);
    }

    // The brief said 56. The list it supplied has 54. Nothing was invented to close that gap.
    expect(catalogEntries).toHaveLength(54);
    expect(summarizeCatalog()).toEqual({ categories: 8, entries: 54, canonical: 4, merged: 47, unverified: 3 });
  });

  it("has unique ids and slugs, and every public entry resolves to a published page", () => {
    expect(() => validateCatalog(published)).not.toThrow();
    expect(new Set(catalogEntries.map((item) => item.id)).size).toBe(catalogEntries.length);

    for (const item of getPublicCatalogEntries()) {
      expect(published.has(item.canonicalPath)).toBe(true);
    }
  });

  it("keeps unconfirmed sports items out of public links and redirects", () => {
    const unverified = catalogEntries.filter((item) => item.status === "unverified").map((item) => item.name);
    expect(unverified).toEqual(["Football Goal Nets", "Golf Nets", "Volleyball Nets"]);

    const publicNames = new Set(getPublicCatalogEntries().map((item) => item.name));
    const menuLabels = new Set(serviceMenuColumns().flatMap((column) => column.links.map((link) => link.label)));
    const redirectSources = catalogAliasRedirects().map((redirect) => redirect.source);

    for (const name of unverified) {
      expect(publicNames.has(name)).toBe(false);
      expect(menuLabels.has(name)).toBe(false);
    }

    expect(redirectSources).not.toContain("/services/sports-nets/golf-nets");
    expect(redirectSources).toContain("/services/safety-nets/cat-safety-nets");
    expect(redirectSources).toContain("/services/bird-nets");
    expect(redirectSources).not.toContain("/services/invisible-grills");
  });

  it("collapses aliases onto canonical pages without duplicate sources", () => {
    const redirects = allRedirects();
    expect(new Set(redirects.map((redirect) => redirect.source)).size).toBe(redirects.length);

    const cat = catalogAliasRedirects().find((redirect) => redirect.source === "/services/safety-nets/cat-safety-nets");
    expect(cat?.destination).toBe("/solutions/pet-balcony-safety");
    for (const redirect of redirects) {
      expect(published.has(redirect.destination)).toBe(true);
    }
  });

  it("feeds service pages with covered and related requests", () => {
    const covered = getCatalogEntriesForPath("/services/cloth-hangers").map((item) => item.name);
    expect(covered).toContain("Pulley Cloth Hangers");

    const related = getCatalogLinksForService("balcony-safety-nets");
    expect(related.map((link) => link.href)).toEqual(
      expect.arrayContaining(["/solutions/child-balcony-safety", "/solutions/pet-balcony-safety", "/property-types"]),
    );
    expect(new Set(related.map((link) => link.href)).size).toBe(related.length);
  });

  it("menu links only point at published pages", () => {
    for (const column of serviceMenuColumns()) {
      expect(published.has(column.href)).toBe(true);
      for (const link of column.links) {
        expect(published.has(link.href)).toBe(true);
      }
    }
  });
});
