export type PropertyTypeRecord = {
  slug: string;
  name: string;
  description: string;
};

export const propertyTypes: PropertyTypeRecord[] = [
  {
    slug: "apartments",
    name: "Apartments",
    description:
      "Most measured work is on apartment balconies. Flat widths still vary, so the opening is measured rather than taken from a standard plan.",
  },
  {
    slug: "independent-houses",
    name: "Independent houses",
    description:
      "Independent houses and duplex terraces are measured the same way: the opening and the surface that will hold the anchors decide the fitting.",
  },
  {
    slug: "high-rise-buildings",
    name: "High-rise buildings",
    description:
      "Building height and site access change the installation. They are recorded at the visit. They are not guessed from the city name.",
  },
];

export function getPropertyType(slug: string): PropertyTypeRecord | undefined {
  return propertyTypes.find((item) => item.slug === slug);
}
