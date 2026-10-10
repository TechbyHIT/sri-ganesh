export type ProblemPage = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  indexable: boolean;
  serviceSlug: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const problems: ProblemPage[] = [
  {
    slug: "child-balcony-safety",
    title: "Child balcony safety",
    description:
      "How families close a balcony gap for children, and why the opening is measured before a grill or net is chosen.",
    h1: "Child safety on a balcony opening",
    indexable: true,
    serviceSlug: "balcony-safety-nets",
    sections: [
      {
        heading: "The opening, not the city",
        paragraphs: [
          "A child-safety job starts with the gap at the balcony, window, or ventilator. A close mesh covers that gap. Spaced wires leave the view open and are a different product.",
          "The fixing has to suit the frame or wall that is actually there. A page cannot know the height of the railing or how a child uses that balcony.",
        ],
      },
      {
        heading: "What we will not claim",
        paragraphs: [
          "This page does not say a product makes a balcony safe for every child, and it does not quote a price. The visit checks the opening and says which cover fits.",
          "Published service pages explain invisible grills and balcony safety nets separately so the two jobs stay distinct.",
        ],
      },
    ],
  },
  {
    slug: "pet-balcony-safety",
    title: "Pet balcony safety",
    description:
      "Mesh and wire options when a pet uses a balcony, chosen after the opening and the railing are measured.",
    h1: "Keeping a pet off an open balcony edge",
    indexable: true,
    serviceSlug: "balcony-safety-nets",
    sections: [
      {
        heading: "Why pets change the cover",
        paragraphs: [
          "A pet can push through a gap that looks small from inside. A mesh is often the cover when the gap itself has to close. Wires are the clearer option when the view matters and the spacing still suits that balcony.",
          "The measurement includes the railing height and anything already fixed on the balcony, including a drying rod.",
        ],
      },
    ],
  },
  {
    slug: "ledge-bird-deterrent",
    title: "Ledge bird deterrent",
    description:
      "Safety spikes are specified only for ledges where people do not stand. The surface is checked first.",
    h1: "Spikes for a ledge, not for a place people use",
    indexable: true,
    serviceSlug: "safety-spikes",
    sections: [
      {
        heading: "Where spikes belong",
        paragraphs: [
          "Safety spikes are for a ledge or parapet where people do not stand. They are not a balcony grill and they are not a net. The visit confirms the surface before anything is specified.",
          "This page does not claim a bird count, a success rate, or a price. If the ledge is a place someone walks, spikes are the wrong product.",
        ],
      },
    ],
  },
  {
    slug: "shaft-and-duct-safety",
    title: "Shaft and duct safety",
    description:
      "Duct area nets cover a shaft or AC opening. Pipes that cross the opening are part of the measurement.",
    h1: "Covering a shaft or duct opening",
    indexable: true,
    serviceSlug: "duct-area-nets",
    sections: [
      {
        heading: "A different opening from the balcony",
        paragraphs: [
          "A duct area net is mesh for a shaft or AC opening. It is not the balcony grill. Pipes that cross the opening are measured with it, because they change how the mesh is cut.",
          "Older blocks in the published Visakhapatnam notes often have shafts as well as balconies. The shaft is still its own job.",
        ],
      },
    ],
  },
];

export function getProblem(slug: string): ProblemPage | undefined {
  return problems.find((problem) => problem.slug === slug);
}
