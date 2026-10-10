export type LocationType = "state" | "city" | "locality";

export type LocationSEO = {
  title: string;
  description: string;
};

/**
 * Unified location record.
 * serviceAvailability is attached in lib/locations.ts from data/serviceLocations.ts
 * so the two files cannot list different services.
 */
export type Location = {
  id: string;
  name: string;
  slug: string;
  state: string;
  stateSlug: string;
  city: string;
  citySlug: string;
  type: LocationType;
  description: string;
  nearbyAreas: string[];
  landmarks: string[];
  active: boolean;
  indexable: boolean;
  serviceAvailability: string[];
  seo: LocationSEO;
};

export type LocationRecord = Omit<Location, "serviceAvailability">;

export type State = Location & { type: "state" };
export type City = Location & { type: "city" };
export type Locality = Location & { type: "locality" };

const stateName = "Andhra Pradesh";
const stateSlug = "andhra-pradesh";

export const locationRecords: LocationRecord[] = [
  {
    id: "state-andhra-pradesh",
    name: stateName,
    slug: stateSlug,
    state: stateName,
    stateSlug,
    city: "",
    citySlug: "",
    type: "state",
    description:
      "Sri Ganesha Home Safety Solutions measures and installs home safety fittings for apartments and houses across Andhra Pradesh. City pages list the places currently published.",
    nearbyAreas: [],
    landmarks: [],
    active: true,
    indexable: false,
    seo: {
      title: "Home Safety Services in Andhra Pradesh",
      description:
        "Home safety fittings for apartments and houses across Andhra Pradesh, with published pages for the cities we currently cover.",
    },
  },
  {
    id: "city-visakhapatnam",
    name: "Visakhapatnam",
    slug: "visakhapatnam",
    state: stateName,
    stateSlug,
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    type: "city",
    description:
      "Coastal apartments, beach-road towers, and hillside houses. Salt air is part of the material choice, especially for wire rope and exposed fixings. Older blocks often have shafts and AC ledges as well as open balconies.",
    nearbyAreas: ["Kakinada", "Rajahmundry", "Madhurawada", "Gajuwaka"],
    landmarks: ["Ramakrishna Beach"],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Visakhapatnam",
      description:
        "Home safety fittings in Visakhapatnam for coastal apartments, hillside houses, balcony openings, shafts, and AC ledges.",
    },
  },
  {
    id: "city-vijayawada",
    name: "Vijayawada",
    slug: "vijayawada",
    state: stateName,
    stateSlug,
    city: "Vijayawada",
    citySlug: "vijayawada",
    type: "city",
    description:
      "Dense apartment blocks and busy residential colonies, where the balcony is often the only outdoor space and needs to stay usable. Many of those balconies are also used for drying and storage.",
    nearbyAreas: ["Guntur"],
    landmarks: ["Prakasam Barrage"],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Vijayawada",
      description:
        "Home safety fittings in Vijayawada for apartment balconies that are the main outdoor space, including drying and storage use.",
    },
  },
  {
    id: "city-guntur",
    name: "Guntur",
    slug: "guntur",
    state: stateName,
    stateSlug,
    city: "Guntur",
    citySlug: "guntur",
    type: "city",
    description:
      "Apartments and houses with open balconies that need grills, nets, and orderly drying space. Some buildings are under extension or repair.",
    nearbyAreas: ["Vijayawada"],
    landmarks: [],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Guntur",
      description:
        "Home safety fittings in Guntur for open balconies, drying space, and buildings that are being extended or repaired.",
    },
  },
  {
    id: "city-tirupati",
    name: "Tirupati",
    slug: "tirupati",
    state: stateName,
    stateSlug,
    city: "Tirupati",
    citySlug: "tirupati",
    type: "city",
    description:
      "Family houses and apartments that need secure balconies, clear drying space, and covered utility openings. Independent houses often have open terraces, and some compound walls need ledge treatment.",
    nearbyAreas: [],
    landmarks: ["Sri Venkateswara Temple"],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Tirupati",
      description:
        "Home safety fittings in Tirupati for house terraces, apartment balconies, drying space, and compound-wall ledges.",
    },
  },
  {
    id: "city-rajahmundry",
    name: "Rajahmundry",
    slug: "rajahmundry",
    state: stateName,
    stateSlug,
    city: "Rajahmundry",
    citySlug: "rajahmundry",
    type: "city",
    description:
      "River-city apartments and houses, including properties that overlook busy streets. Older blocks often include open utility shafts.",
    nearbyAreas: ["Kakinada", "Visakhapatnam"],
    landmarks: [],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Rajahmundry",
      description:
        "Home safety fittings in Rajahmundry for street-facing balconies and older blocks with open utility shafts.",
    },
  },
  {
    id: "city-kakinada",
    name: "Kakinada",
    slug: "kakinada",
    state: stateName,
    stateSlug,
    city: "Kakinada",
    citySlug: "kakinada",
    type: "city",
    description:
      "Port-city homes that need corrosion-aware fittings and practical balcony protection. Multi-storey buildings commonly include utility ducts.",
    nearbyAreas: ["Rajahmundry", "Visakhapatnam"],
    landmarks: [],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Kakinada",
      description:
        "Home safety fittings in Kakinada for coastal homes, balcony openings, and utility ducts on multi-storey buildings.",
    },
  },
  {
    id: "locality-madhurawada",
    name: "Madhurawada",
    slug: "madhurawada",
    state: stateName,
    stateSlug,
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    type: "locality",
    description:
      "A residential part of Visakhapatnam made up of apartments and houses. Balcony widths differ from one building to the next, so each opening is measured on site rather than copied from a neighbouring block.",
    nearbyAreas: ["Gajuwaka", "Visakhapatnam"],
    landmarks: [],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Madhurawada, Visakhapatnam",
      description:
        "Home safety fittings in Madhurawada, Visakhapatnam, for apartments and houses whose balcony sizes are measured one opening at a time.",
    },
  },
  {
    id: "locality-gajuwaka",
    name: "Gajuwaka",
    slug: "gajuwaka",
    state: stateName,
    stateSlug,
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    type: "locality",
    description:
      "A dense residential and industrial-side locality. Balcony and duct protection here is usually about busy surroundings, children, and keeping ledges clear.",
    nearbyAreas: ["Madhurawada", "Visakhapatnam"],
    landmarks: [],
    active: true,
    indexable: true,
    seo: {
      title: "Home Safety in Gajuwaka, Visakhapatnam",
      description:
        "Home safety fittings in Gajuwaka, Visakhapatnam, for dense residential blocks, busy surroundings, children, and ledges.",
    },
  },
  {
    id: "locality-mvp-colony",
    name: "MVP Colony",
    slug: "mvp-colony",
    state: stateName,
    stateSlug,
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    type: "locality",
    description:
      "A residential colony of apartments and houses where balconies face other blocks, internal roads, or open corners. Measurements have to follow each balcony rather than a repeated floor plate.",
    nearbyAreas: ["Visakhapatnam"],
    landmarks: [],
    active: false,
    indexable: false,
    seo: {
      title: "Home Safety in MVP Colony, Visakhapatnam",
      description:
        "Home safety notes for MVP Colony, Visakhapatnam. This locality page is kept in the catalogue and is not published.",
    },
  },
  {
    id: "locality-benz-circle",
    name: "Benz Circle",
    slug: "benz-circle",
    state: stateName,
    stateSlug,
    city: "Vijayawada",
    citySlug: "vijayawada",
    type: "locality",
    description:
      "Apartments around a busy junction. Openings often face the road, so the work has to keep the balcony usable without adding a heavy screen.",
    nearbyAreas: ["Vijayawada"],
    landmarks: [],
    active: false,
    indexable: false,
    seo: {
      title: "Home Safety in Benz Circle, Vijayawada",
      description:
        "Home safety notes for Benz Circle, Vijayawada. This locality page is kept in the catalogue and is not published.",
    },
  },
  {
    id: "locality-governorpet",
    name: "Governorpet",
    slug: "governorpet",
    state: stateName,
    stateSlug,
    city: "Vijayawada",
    citySlug: "vijayawada",
    type: "locality",
    description:
      "An established neighbourhood of houses and smaller apartment buildings, with mixed balcony sizes and older railing lines.",
    nearbyAreas: ["Vijayawada"],
    landmarks: [],
    active: false,
    indexable: false,
    seo: {
      title: "Home Safety in Governorpet, Vijayawada",
      description:
        "Home safety notes for Governorpet, Vijayawada. This locality page is kept in the catalogue and is not published.",
    },
  },
  {
    id: "locality-korlagunta",
    name: "Korlagunta",
    slug: "korlagunta",
    state: stateName,
    stateSlug,
    city: "Tirupati",
    citySlug: "tirupati",
    type: "locality",
    description:
      "A residential area of houses and apartments. Terraces, drying space, and open balconies are the usual places we measure.",
    nearbyAreas: ["Tirupati"],
    landmarks: [],
    active: false,
    indexable: false,
    seo: {
      title: "Home Safety in Korlagunta, Tirupati",
      description:
        "Home safety notes for Korlagunta, Tirupati. This locality page is kept in the catalogue and is not published.",
    },
  },
];
