export type ServiceLocationFaq = {
  question: string;
  answer: string;
};

/**
 * A published pairing of one service and one location slug.
 * locationSlug is a city slug or a locality slug from data/locations.ts.
 * Absence of a row means that combination is not published.
 * A place can sit in the administrative database without a row here.
 * District or mandal membership is not service coverage.
 */
export type ServiceLocation = {
  serviceSlug: string;
  locationSlug: string;
  active: boolean;
  indexable: boolean;
  uniqueContent: string;
  localIntroduction: string;
  localFAQs: ServiceLocationFaq[];
};

export const serviceLocations: ServiceLocation[] = [
  {
    serviceSlug: "invisible-grills",
    locationSlug: "visakhapatnam",
    active: true,
    indexable: true,
    localIntroduction:
      "Visakhapatnam balconies include coastal towers and hillside houses, and salt air reaches exposed metal. An invisible grill here uses tensioned stainless-steel wire in slim channels so the opening stays visually open while the wide gaps are closed. The channel line still has to follow the actual balcony, including corners that are not square.",
    uniqueContent:
      "Older blocks in the city also have shafts and AC ledges, which are a different job from the balcony wires. The grill visit covers the balcony or window opening only. Spacing is set for who uses that balcony, not from a single city-wide gap.",
    localFAQs: [
      {
        question: "Does salt air change the invisible grill specification in Visakhapatnam?",
        answer:
          "The wire is stainless steel because the coast reaches these balconies. The visit still checks the wall or slab that will hold the channels. Stainless wire does not remove the need to measure the opening.",
      },
    ],
  },
  {
    serviceSlug: "invisible-grills",
    locationSlug: "vijayawada",
    active: true,
    indexable: true,
    localIntroduction:
      "In Vijayawada the balcony is often the only outdoor space, and it is also used for drying and storage. Invisible grills use tensioned wire ropes rather than a solid screen, so the balcony can stay usable and the view through the opening remains. The wires are cut to that opening, including French windows above the street.",
    uniqueContent:
      "A cloth hanger is a separate fitting if drying is moving off the railing. The grill measurement does not assume a standard apartment width, because dense blocks still vary from one flat to the next.",
    localFAQs: [
      {
        question: "Will an invisible grill stop the balcony being used for drying in Vijayawada?",
        answer:
          "The wires close the gap at the edge. Drying can stay on a ceiling hanger rather than on the railing. Those are planned as two jobs when both are needed, so the rod does not clash with the top channel.",
      },
    ],
  },
  {
    serviceSlug: "balcony-safety-nets",
    locationSlug: "guntur",
    active: true,
    indexable: true,
    localIntroduction:
      "Guntur homes in this catalogue have open balconies that sometimes need a close cover rather than only spaced wires. A balcony safety net is a taut UV-stable mesh across the opening, used when children, pets, or stored items need the gap itself covered. It is fixed to the frame or wall that can hold the anchors.",
    uniqueContent:
      "Some buildings here are under extension or repair. A temporary building cover is not this net. The balcony net stays on the finished opening and is measured after that opening can be worked on.",
    localFAQs: [
      {
        question: "Is a balcony net the same as covering a Guntur building during repair?",
        answer:
          "No. Building covering is a temporary sheet for a construction stage and comes down afterwards. A balcony safety net is fitted to a balcony, window, or ventilator that will stay in daily use.",
      },
    ],
  },
  {
    serviceSlug: "sports-nets",
    locationSlug: "tirupati",
    active: true,
    indexable: true,
    localIntroduction:
      "Tirupati houses in this catalogue often include open terraces. A sports net is a practice enclosure for cricket or similar play, with poles and mesh sized to that terrace or yard. It is not the lighter mesh used on a balcony railing.",
    uniqueContent:
      "The bay only goes ahead if the terrace has room for the poles and a base that can hold them. A short home bay is not a school-length net, and the visit will say if the space is too tight.",
    localFAQs: [
      {
        question: "Can a Tirupati terrace take a full sports net?",
        answer:
          "Only when the measured length, width, and anchors are enough for the game. If the terrace cannot hold the poles safely, the visit stops at that finding instead of forcing a bay onto it.",
      },
    ],
  },
  {
    serviceSlug: "duct-area-nets",
    locationSlug: "visakhapatnam",
    active: true,
    indexable: true,
    localIntroduction:
      "Visakhapatnam’s older apartment blocks include shafts and AC ledges that the balcony railing does not cover. A duct area net is cut to the plumbing or AC shaft, including around pipes, and anchored to the surrounding wall. It is not a balcony mesh stretched over the shaft.",
    uniqueContent:
      "Salt air is a reason to use UV-stable mesh and sound anchors. Spikes on an outer ledge are a separate strip, used only where people do not stand.",
    localFAQs: [
      {
        question: "Does one duct net pattern repeat on every Visakhapatnam floor?",
        answer:
          "Only when the openings match. Pipes shift between floors, so each shaft we are asked to cover is measured, including the services that already cross it.",
      },
    ],
  },
  {
    serviceSlug: "duct-area-nets",
    locationSlug: "kakinada",
    active: true,
    indexable: true,
    localIntroduction:
      "Kakinada’s multi-storey buildings commonly include utility ducts, and the coast reaches exposed fittings. Duct area nets close those shaft openings with mesh cut around the pipes, anchored to the wall or frame. This is separate from a balcony grill facing the weather.",
    uniqueContent:
      "The balcony can still need its own fitting. A duct net does not become a railing, and a railing does not close the shaft.",
    localFAQs: [
      {
        question: "Will a balcony grill also close a Kakinada utility duct?",
        answer:
          "No. Invisible grills run across a balcony or window. A duct net is shaped for the shaft. If both openings need work, they are measured as two openings.",
      },
    ],
  },
  {
    serviceSlug: "duct-area-nets",
    locationSlug: "rajahmundry",
    active: true,
    indexable: true,
    localIntroduction:
      "Older blocks in Rajahmundry include open utility shafts, and some balconies face the street. The duct net is for the shaft: mesh cut to that recess and held so it does not hang into the duct. Street-facing balconies are a different opening and are not covered by the shaft net.",
    uniqueContent:
      "The quote names which openings are in the visit. A shaft on one landing is not assumed to match the next landing.",
    localFAQs: [
      {
        question: "Are street-facing balconies in Rajahmundry part of the duct net?",
        answer:
          "No. The duct net closes the utility opening. A balcony that faces the street needs its own measurement if a grill or balcony net is required.",
      },
    ],
  },
  {
    serviceSlug: "cloth-hangers",
    locationSlug: "vijayawada",
    active: true,
    indexable: true,
    localIntroduction:
      "Vijayawada balconies are often used for drying because they are the main outdoor space. A cloth hanger moves that load to ceiling rods fixed to the slab, clear of the fan and the light, so the railing can stay clear. The rod length follows the ceiling that is actually there.",
    uniqueContent:
      "If an invisible grill is also fitted, the rod has to clear the top channel. That is why the two layouts are marked in one visit when both are requested.",
    localFAQs: [
      {
        question: "Can the hanger use the railing in a Vijayawada apartment?",
        answer:
          "The rods are fixed to the slab, not hung on the railing. If the ceiling cannot take the brackets safely, the layout changes or the job does not proceed.",
      },
    ],
  },
  {
    serviceSlug: "cloth-hangers",
    locationSlug: "guntur",
    active: true,
    indexable: true,
    localIntroduction:
      "Guntur apartments and houses in this catalogue need orderly drying space as well as balcony protection. Cloth hangers are ceiling-mounted rods sized to the slab, so clothes are not left on the railing. The bracket line is drawn around fans, lights, and conduit.",
    uniqueContent:
      "A building that is still being extended may not have a ceiling ready for brackets. The hanger is measured on the finished slab, not on a temporary work deck.",
    localFAQs: [
      {
        question: "Can a cloth hanger be fitted while a Guntur building is still under repair?",
        answer:
          "Only when the ceiling that will carry the brackets is the finished slab. Temporary building covering for the repair stage is a different product and comes down when that stage ends.",
      },
    ],
  },
  {
    serviceSlug: "safety-spikes",
    locationSlug: "tirupati",
    active: true,
    indexable: true,
    localIntroduction:
      "Tirupati houses in this catalogue include compound walls and parapets. Safety spikes are polycarbonate or stainless strips on those ledges, where birds settle or the wall is easy to climb. They are not fitted on a balcony people use, and they are not a handrail.",
    uniqueContent:
      "Open terraces on the same houses are not a spike job. A terrace used for play is assessed for a sports net instead, with poles and anchors, if the space allows it.",
    localFAQs: [
      {
        question: "Can spikes be used on a Tirupati balcony railing?",
        answer:
          "No. Spikes belong on ledges where people do not stand or grip. A balcony needs a grill, a safety net, or a proper railing, not a spike strip.",
      },
    ],
  },
  {
    serviceSlug: "safety-spikes",
    locationSlug: "visakhapatnam",
    active: true,
    indexable: true,
    localIntroduction:
      "Older Visakhapatnam blocks have AC ledges and parapets where birds settle. Safety spikes are strips fixed only on those ledges, not on walking surfaces or balcony handrails. The coast is a reason to choose a strip and a fixing that suit exposed concrete, decided on site.",
    uniqueContent:
      "Where birds are using the shaft rather than only the outer ledge, a duct net is the cover for the opening. Spikes do not replace that net.",
    localFAQs: [
      {
        question: "Will spikes alone keep pigeons out of a Visakhapatnam shaft?",
        answer:
          "Not when the nest is inside the shaft. The shaft needs a duct net cut to the opening. Spikes address the outer ledge only.",
      },
    ],
  },
  {
    serviceSlug: "building-covering",
    locationSlug: "guntur",
    active: true,
    indexable: true,
    localIntroduction:
      "Some Guntur buildings in this catalogue are under extension or repair. Building covering is a debris or shade net hung for that stage and taken down when the stage ends. It is tied to scaffold or a structural anchor, not left as a permanent balcony screen.",
    uniqueContent:
      "Open balconies on occupied homes are outside this temporary sheet. Those openings use a grill or a balcony net after the edge is ready to measure.",
    localFAQs: [
      {
        question: "Does building covering stay up after the Guntur repair is finished?",
        answer:
          "No. It is removed when the stage it was hung for is over. Lasting protection at a railing is a separate balcony fitting.",
      },
    ],
  },
  {
    serviceSlug: "invisible-grills",
    locationSlug: "madhurawada",
    active: true,
    indexable: true,
    localIntroduction:
      "Madhurawada is a residential part of Visakhapatnam with apartments and houses whose balcony widths do not match from one building to the next. Invisible grills here are tensioned stainless-steel wires in channels cut to the opening in front of us, including corners and sliding tracks. The coastal material note for Visakhapatnam still applies: exposed wire is stainless, and the fixing surface is checked before drilling.",
    uniqueContent:
      "A repeated floor plate is not assumed. Two flats in the same colony can need different channel lines. The visit measures the balcony that will actually receive the grill.",
    localFAQs: [
      {
        question: "Can one Madhurawada balcony size be used for the whole building?",
        answer:
          "No. Width, height, and breaks in the line are measured on that opening. Neighbouring balconies are not used as the template.",
      },
    ],
  },
  {
    serviceSlug: "invisible-grills",
    locationSlug: "gajuwaka",
    active: true,
    indexable: true,
    localIntroduction:
      "Gajuwaka is a dense residential and industrial-side part of Visakhapatnam, with busy surroundings and balconies used by children. An invisible grill closes the wide gaps with tensioned wires while leaving the view open. It does not by itself clear a ledge or cover a shaft beside the flat.",
    uniqueContent:
      "Ledges that need to stay clear of roosting are a spike job, and shafts need a duct net. Those are separate from the balcony wire run and are only included when that opening is part of the visit.",
    localFAQs: [
      {
        question: "Does an invisible grill cover a Gajuwaka duct next to the balcony?",
        answer:
          "No. The grill follows the balcony or window opening. A duct beside it is measured for a duct net if that is the opening that needs closing.",
      },
    ],
  },
];
