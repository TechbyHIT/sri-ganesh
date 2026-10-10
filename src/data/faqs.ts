export type FaqScope = "home" | "service" | "location";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  scopes: FaqScope[];
  /** When set, the FAQ is shown only for this service. */
  serviceSlug?: string;
};

export const faqs: Faq[] = [
  {
    id: "which-cities",
    question: "Which cities do you cover?",
    answer:
      "Installation pages are published for the cities listed on our locations page, all within Andhra Pradesh. If your city is listed, choose the service you need and book a measurement.",
    scopes: ["home"],
  },
  {
    id: "apartments-and-houses",
    question: "Do you install in apartments and independent houses?",
    answer:
      "Yes. Most of the work is on apartment balconies, and we also measure independent houses, duplex terraces, and buildings that are being repaired. The fixing method follows the surface we find on site.",
    scopes: ["home", "service"],
  },
  {
    id: "view",
    question: "Will invisible grills block the view?",
    answer:
      "The grill is a run of slim wire ropes, not a solid screen. You still see through the balcony. A safety net is more visible than a wire grill because it is a mesh. We will say which option suits the opening before you approve the work.",
    scopes: ["home"],
  },
  {
    id: "nets-not-only-children",
    question: "Are balcony nets only for children?",
    answer:
      "No. Families also use them for pets, for stopping objects falling from a storage balcony, and for closing a window or ventilator above a shaft. Invisible grills are the clearer option when the view matters most.",
    scopes: ["home"],
  },
  {
    id: "how-price",
    question: "How is the price decided?",
    answer:
      "There is no single rate that fits every opening. The quote follows the measured width and height, the material, and how the channels, net, or poles have to be fixed. You see that breakdown before installation starts.",
    scopes: ["home", "service", "location"],
  },
  {
    id: "together",
    question: "Can more than one service be done together?",
    answer:
      "Yes. Grills, nets, cloth hangers, and duct nets are often planned in one visit so the fixing points do not clash. Sports nets and building covering are usually separate jobs because the site is different.",
    scopes: ["home", "service"],
  },
  {
    id: "under-construction",
    question: "Do you cover buildings that are still being worked on?",
    answer:
      "Building covering is meant for construction, plaster, painting, and repair. It is fixed for that stage of work and removed when the stage ends. It is not a permanent balcony product.",
    scopes: ["home"],
  },
  {
    id: "how-long",
    question: "How long does installation take?",
    answer:
      "A single balcony grill or net is often finished in a site visit after measurement. Longer runs, sports bays, and full building covers take longer because there are more fixing points. The quote includes the expected visit, not a vague window.",
    scopes: ["service", "location"],
  },
  {
    id: "existing",
    question: "Can you work around fittings that are already there?",
    answer:
      "Often, yes. We look at the existing railing, channel, or damaged net during the visit. If an old fixing is loose or the slab edge is not sound, we will say so before adding anything new.",
    scopes: ["service", "location"],
  },
  {
    id: "grill-spacing",
    question: "How are invisible grill wires spaced?",
    answer:
      "Spacing is set to the opening and to who uses the balcony. A home with small children needs a tighter gap than a balcony that only needs a barrier against leaning too far. We confirm the spacing at measurement.",
    scopes: ["service"],
    serviceSlug: "invisible-grills",
  },
  {
    id: "net-vs-grill",
    question: "When is a balcony net a better fit than a grill?",
    answer:
      "Choose a net when you want a close mesh for pets, small objects, or a window above a shaft. Choose an invisible grill when you want the clearer view and a tensioned wire barrier. Some balconies use both, on different openings.",
    scopes: ["service"],
    serviceSlug: "balcony-safety-nets",
  },
  {
    id: "hanger-slab",
    question: "Will a cloth hanger fit a balcony that already has a fan or a light?",
    answer:
      "The rod layout is drawn around the slab, the fan, and the light points. If the ceiling cannot take the brackets safely, we will not force a standard kit onto it.",
    scopes: ["service"],
    serviceSlug: "cloth-hangers",
  },
  {
    id: "sports-home",
    question: "Can a sports net fit a home terrace?",
    answer:
      "Yes, if there is room for the poles and a safe way to anchor them. A terrace bay is shorter than a school net. We will tell you if the space is too tight for the game you have in mind.",
    scopes: ["service"],
    serviceSlug: "sports-nets",
  },
  {
    id: "spikes-where",
    question: "Where should safety spikes not be used?",
    answer:
      "Spikes belong on ledges where people do not stand or grip: parapets, AC platforms, and climbable wall tops. They are not a balcony handrail and they are not fitted on a walking surface.",
    scopes: ["service"],
    serviceSlug: "safety-spikes",
  },
  {
    id: "duct-shape",
    question: "Can a duct net fit an uneven shaft?",
    answer:
      "Yes. Duct openings are rarely a clean rectangle. The net is cut to the opening we measure, including pipes that cross the gap, as long as the surrounding wall can hold the anchors.",
    scopes: ["service"],
    serviceSlug: "duct-area-nets",
  },
  {
    id: "covering-temporary",
    question: "Is building covering permanent?",
    answer:
      "No. It stays up for the construction or repair stage it was hung for, then it is taken down. Permanent balcony protection is a grill, a net, or both.",
    scopes: ["service"],
    serviceSlug: "building-covering",
  },
  {
    id: "city-service",
    question: "Do you install {service} in {city}?",
    answer:
      "Yes. {service} is published for {city}, {region}. The visit covers the openings in your building, not a generic city rate. If you are in a listed locality, start there. If you are elsewhere in {city}, say so when you book and we will confirm the visit.",
    scopes: ["location"],
  },
  {
    id: "beyond-localities",
    question: "Do you only visit the localities listed on the site?",
    answer:
      "The locality pages are the areas we have published in detail. The city page covers {city} as a whole. Ask about your area when you book the measurement.",
    scopes: ["location"],
  },
];
