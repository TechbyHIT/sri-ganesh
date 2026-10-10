import { locationRecords } from "../../data/locations";
import { catalogEntries, serviceCategories } from "../../data/service-catalog";
import { services } from "../../data/services";
import { serviceLocations } from "../../data/serviceLocations";

type Redirect = { source: string; destination: string; permanent: true };

/**
 * Catalog aliases collapse onto the page that already answers them.
 * `/services/bird-nets` -> duct area nets; `/services/safety-nets/cat-safety-nets` -> pet solution.
 * Unverified entries get no alias and stay 404.
 */
export function catalogAliasRedirects(): Redirect[] {
  const serviceSlugs = new Set(services.map((service) => service.slug));
  const redirects: Redirect[] = [];

  for (const category of serviceCategories) {
    if (!serviceSlugs.has(category.slug)) {
      redirects.push({
        source: `/services/${category.slug}`,
        destination: `/services/${category.serviceSlug}`,
        permanent: true,
      });
    }
  }

  for (const item of catalogEntries) {
    const category = serviceCategories.find((entry) => entry.id === item.categoryId);

    if (item.status === "unverified" || !category) {
      continue;
    }

    redirects.push({
      source: `/services/${category.slug}/${item.slug}`,
      destination: item.canonicalPath,
      permanent: true,
    });
  }

  return redirects;
}

export function allRedirects(): Redirect[] {
  const seen = new Set<string>();
  const combined = [...legacyCombinationRedirects(), ...catalogAliasRedirects()];

  for (const redirect of combined) {
    if (seen.has(redirect.source)) {
      throw new Error(`Duplicate redirect source "${redirect.source}".`);
    }

    seen.add(redirect.source);
  }

  return combined;
}

export function legacyCombinationRedirects(): {
  source: string;
  destination: string;
  permanent: true;
}[] {
  return serviceLocations.flatMap((relation) => {
    if (!relation.active) {
      return [];
    }

    const location = locationRecords.find((item) => item.slug === relation.locationSlug);

    if (!location || location.type === "state") {
      return [];
    }

    if (location.type === "locality") {
      return [
        {
          source: `/services/${relation.serviceSlug}/${location.citySlug}/${location.slug}`,
          destination: `/${location.citySlug}/${location.slug}/${relation.serviceSlug}`,
          permanent: true as const,
        },
      ];
    }

    return [
      {
        source: `/services/${relation.serviceSlug}/${location.slug}`,
        destination: `/${location.slug}/${relation.serviceSlug}`,
        permanent: true as const,
      },
    ];
  });
}
