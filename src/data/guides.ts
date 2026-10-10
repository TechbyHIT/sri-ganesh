export type Guide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  indexable: boolean;
  sections: { heading: string; paragraphs: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: "invisible-grill-material-guide",
    title: "Invisible grill materials",
    description:
      "How stainless-steel wire, channels, and anchors are chosen for an invisible grill after the balcony is measured.",
    h1: "How invisible grill materials are chosen",
    indexable: true,
    sections: [
      {
        heading: "What is specified on site",
        paragraphs: [
          "An invisible grill is tensioned wire in slim channels, not a solid screen. The wire, the channel, and the anchors are chosen after someone measures the opening and looks at the wall or slab that will hold them.",
          "Coastal balconies in the published Visakhapatnam coverage use stainless-steel wire because salt air reaches exposed metal. That choice is about the material in the air, not a claim that every building in the city has the same balcony.",
        ],
      },
      {
        heading: "What this guide does not promise",
        paragraphs: [
          "This page does not list a grade, a warranty period, or a price. Those follow the measurement. A quote that names a fixed rate before the opening is measured is not how this work is sold.",
          "If a balcony is still being built, or the surface cannot hold anchors, the visit says so. The material is not chosen to hide a weak fixing.",
        ],
      },
    ],
  },
  {
    slug: "balcony-safety-net-or-grill",
    title: "Balcony net or invisible grill",
    description:
      "When a close mesh is the right cover, and when spaced wires leave the view open. The opening decides it.",
    h1: "Choosing a balcony net or an invisible grill",
    indexable: true,
    sections: [
      {
        heading: "Different jobs",
        paragraphs: [
          "A balcony safety net is a taut mesh across the opening. Families use it when children, pets, or stored items need the gap itself covered. An invisible grill uses spaced wires, so you still see through the balcony.",
          "The two products are not substitutes you pick from a slogan. A window above a shaft, a storage balcony, and a view balcony can need different covers in the same home.",
        ],
      },
      {
        heading: "What stays out of this decision",
        paragraphs: [
          "Building covering is a temporary sheet for a repair stage and comes down afterwards. It is not a balcony net. A cloth hanger is a separate fitting if drying is moving off the railing.",
          "Published city pages name the places currently served. A district or mandal in the location database is not, by itself, a promise of installation.",
        ],
      },
    ],
  },
  {
    slug: "how-a-site-measurement-works",
    title: "How a site measurement works",
    description:
      "What is checked before a home safety quote: opening size, fixing surface, height, and access.",
    h1: "What happens at a site measurement",
    indexable: true,
    sections: [
      {
        heading: "The visit",
        paragraphs: [
          "The measurement records the opening, the corners, and the surface that will hold the anchors. Apartment widths are not assumed from the city. Two flats in the same block can differ.",
          "Height, access to the balcony, and anything that crosses the opening, such as pipes on a duct, are part of the visit. They change the work. They are not added later as a surprise line.",
        ],
      },
      {
        heading: "After the visit",
        paragraphs: [
          "The quote follows that measurement. Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
          "Nothing on this page is a finished price, a review, or a count of jobs completed.",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}
