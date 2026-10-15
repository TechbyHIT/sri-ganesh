import { cities, citiesIn, regions } from "@/data/cities";
import { libraryGroups } from "@/data/library";
import { searchOptions } from "@/data/search-options";
import { services } from "@/data/services";
import { coverage } from "@/data/stats";
import { popularLinks } from "@/lib/pages";
import { FloatActions, Header } from "./Header";

const hubSlugs = ["visakhapatnam", "vijayawada", "guntur", "tirupati", "kakinada", "kurnool"];

function serviceLink(slug: string) {
  const service = services.find((item) => item.slug === slug);
  return service ? [{ href: `/services/${service.slug}`, label: service.name }] : [];
}

function libraryLinks(id: string, count: number) {
  return (libraryGroups.find((group) => group.id === id)?.items ?? []).slice(0, count).map((item) => ({
    href: `/services/library/${item.slug}`,
    label: item.title,
  }));
}

export function SiteChrome() {
  const groups = [
    { name: "Invisible Grills", items: [...serviceLink("invisible-grills"), ...libraryLinks("grills", 6)] },
    {
      name: "Safety Nets",
      items: [
        ...serviceLink("safety-nets"),
        ...serviceLink("balcony-safety-nets"),
        ...serviceLink("children-safety-nets"),
        ...serviceLink("pet-safety-nets"),
        ...serviceLink("cat-safety-nets"),
        ...serviceLink("monkey-safety-nets"),
        ...serviceLink("transparent-balcony-nets"),
        ...serviceLink("terrace-safety-nets"),
        ...serviceLink("staircase-safety-nets"),
      ],
    },
    { name: "Pigeon Nets", items: [...serviceLink("pigeon-nets"), ...libraryLinks("pigeon", 6)] },
    {
      name: "Bird Nets",
      items: [...serviceLink("bird-nets"), ...serviceLink("anti-bird-spikes"), ...serviceLink("duct-area-nets"), ...serviceLink("mosquito-nets")],
    },
    { name: "Cloth Hangers", items: serviceLink("cloth-hangers") },
    { name: "Sports Nets", items: [...serviceLink("sports-nets"), ...serviceLink("cricket-nets"), ...libraryLinks("sports", 6)] },
  ];
  const regionNav = regions.map((region) => ({
    name: region,
    cities: citiesIn(region)
      .slice(0, 12)
      .map((city) => ({ href: `/locations/andhra-pradesh/${city.slug}`, label: city.name })),
  }));
  const hubs = hubSlugs.flatMap((slug) => {
    const city = cities.find((item) => item.slug === slug);
    if (!city) return [];
    return [
      {
        href: `/locations/andhra-pradesh/${city.slug}`,
        label: city.name,
        areas: city.areas.slice(0, 4).map((area) => ({
          href: `/locations/andhra-pradesh/${city.slug}/${area.slug}`,
          label: area.name,
        })),
      },
    ];
  });

  return (
    <>
      <Header
        topLine={`${coverage.services} services · ${coverage.cities} cities · ${coverage.areas} areas · ${coverage.photos} HD photos · ${coverage.districts} districts`}
        groups={groups}
        regions={regionNav}
        hubs={hubs}
        popular={popularLinks.slice(0, 8)}
        search={searchOptions()}
      />
      <FloatActions />
    </>
  );
}
