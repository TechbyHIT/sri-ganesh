export type ServiceImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type InstallationStep = {
  title: string;
  detail: string;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  features: string[];
  applications: string[];
  installationProcess: InstallationStep[];
  faqs: ServiceFaq[];
  seoTitle: string;
  seoDescription: string;
  heroImage: ServiceImage;
  galleryImages: ServiceImage[];
  relatedServices: string[];
  active: boolean;
  indexable: boolean;
};

function pictures(
  slug: string,
  heroAlt: string,
  openingAlt: string,
  fixingAlt: string,
): { heroImage: ServiceImage; galleryImages: ServiceImage[] } {
  const image = (kind: string, alt: string): ServiceImage => ({
    src: `/services/${slug}-${kind}.svg`,
    alt,
    width: 800,
    height: 560,
  });

  return {
    heroImage: image("hero", heroAlt),
    galleryImages: [image("opening", openingAlt), image("fixing", fixingAlt)],
  };
}

export const services: Service[] = [
  {
    id: "invisible-grills",
    name: "Invisible Grills",
    slug: "invisible-grills",
    shortDescription:
      "Tensioned stainless-steel wire ropes in slim channels, so a balcony stays open while the wide gaps are closed.",
    description:
      "An invisible grill is not a mesh and it is not a row of thick bars. Stainless-steel wire rope is fixed between a top channel and a bottom channel, then tensioned so the lines stay straight. Light and air still pass. What changes is the gap a child, a pet, or a person leaning out can slip through. The channel line has to follow the real opening, including columns, sliding-door tracks, and corners that are not square. Spacing is chosen for who uses that balcony, not copied from the flat next door.",
    benefits: [
      "The view stays open because the barrier is wire, not a solid screen",
      "Wide balcony gaps are reduced without rebuilding the railing",
      "Each opening is cut to its own width, including odd corners",
      "Stainless wire is a practical choice where salt air reaches the balcony",
    ],
    features: [
      "Stainless-steel wire rope, tensioned between top and bottom channels",
      "Aluminium or stainless channels, fixed to the wall, slab, or frame that can hold them",
      "Wire spacing set at measurement, tighter where small children use the balcony",
      "End caps and corner turns so the run does not stop short of the opening",
      "Wires that can be wiped, and a slack line that is re-tensioned at the end fittings",
    ],
    applications: [
      "Apartment balconies where the railing has a climbable gap",
      "French windows and large ventilators above a drop",
      "Stair voids and internal courtyards",
      "Duplex terraces that should stay visually open",
    ],
    installationProcess: [
      {
        title: "Measure the clear opening",
        detail:
          "Width, height, and every break in the line are measured on site. A photo cannot show whether the slab edge is sound.",
      },
      {
        title: "Agree the wire spacing",
        detail:
          "Spacing is confirmed before channels are cut. A balcony used by toddlers is not spaced like a balcony used only by adults.",
      },
      {
        title: "Fix the channels",
        detail:
          "Top and bottom channels are drilled into the surface that can take the load. Brick, concrete, and aluminium frames are not fastened the same way.",
      },
      {
        title: "Thread, tension, and finish",
        detail:
          "Wires are run through, tensioned so they do not sag, and closed with end fittings. The balcony is checked with you before the visit ends.",
      },
    ],
    faqs: [
      {
        question: "Will the wires block the view?",
        answer:
          "You still see through the balcony. The wires are slim and spaced, so the opening does not become a solid wall. A safety net is the more visible option if you want a close mesh instead.",
      },
      {
        question: "How is the gap between wires decided?",
        answer:
          "It is decided at measurement from the opening and from who uses it. Homes with small children need a tighter gap than a balcony that only needs a barrier against leaning too far.",
      },
      {
        question: "Can an invisible grill be fixed to an old railing?",
        answer:
          "Sometimes the channels can share the opening with the railing, and sometimes the railing is too weak to carry them. The visit is where that is decided, before any drilling.",
      },
      {
        question: "How is an invisible grill looked after?",
        answer:
          "Wipe the wires when dust or salt settles on them. If a line sags, the end fittings need a tension check. That maintains the run already installed. It is not a claim that the balcony will never need another visit.",
      },
    ],
    seoTitle: "Invisible Grills for Balconies in Andhra Pradesh",
    seoDescription:
      "Stainless-steel invisible grills measured to each balcony in Andhra Pradesh. Wire spacing, channels, and fixings are agreed before installation.",
    ...pictures(
      "invisible-grills",
      "Balcony opening crossed by slim vertical invisible-grill wires",
      "Diagram of an opening with evenly spaced invisible-grill wires",
      "Top and bottom channels with tensioned grill wires between them",
    ),
    relatedServices: ["balcony-safety-nets", "cloth-hangers", "duct-area-nets"],
    active: true,
    indexable: true,
  },
  {
    id: "balcony-safety-nets",
    name: "Balcony Safety Nets",
    slug: "balcony-safety-nets",
    shortDescription:
      "A taut UV-stable mesh across a balcony, window, or ventilator when a close cover matters more than a clear wire line.",
    description:
      "A balcony safety net closes the opening with mesh rather than wire rope. Families choose it when they want to stop small hands, pets, toys, and stored items from going through, or when a window sits above a shaft. The mesh is pulled tight and held at the frame, the wall, or the slab edge. A loose net that sags into a pocket is not a finished job. Invisible grills leave a clearer view. Nets are the better fit when the gap itself has to be covered, not only divided.",
    benefits: [
      "Closes the opening more fully than spaced wires",
      "Helps keep children, pets, and loose objects on the balcony side",
      "Can be planned around an existing railing instead of replacing it",
      "Useful on windows and ventilators, not only on full-width balconies",
    ],
    features: [
      "HDPE or nylon mesh, UV stabilised for sun-facing balconies",
      "Mesh grade chosen for the use: children and pets, or a lighter object barrier",
      "Rope, hooks, or clamps fixed into a frame or wall that can hold them",
      "Cut to irregular openings, including around pipes and column projections",
    ],
    applications: [
      "Balconies used by young children or pets",
      "Storage balconies where tools and pots sit near the edge",
      "Windows and ventilators above a shaft or a street",
      "Openings where a wire grill would leave too wide a gap for the household",
    ],
    installationProcess: [
      {
        title: "Measure the opening and the frame",
        detail:
          "The net follows the frame that is already there. We check what can take an anchor and what is only paint or a loose cover strip.",
      },
      {
        title: "Choose the mesh",
        detail:
          "A closer mesh suits pets and small objects. A balcony that only needs a fall barrier may use a different grade. That choice is made before the net is cut.",
      },
      {
        title: "Anchor and tension",
        detail:
          "Fixings are set around the opening, then the net is pulled taut so it does not belly out. Extra support is added where the span is long.",
      },
      {
        title: "Trim and check the edges",
        detail:
          "Edges are closed so there is no leftover gap at the column or the floor. You can see the finished line before we leave.",
      },
    ],
    faqs: [
      {
        question: "When is a net a better fit than an invisible grill?",
        answer:
          "Choose a net when you want mesh across the whole gap, for pets, small children, or objects. Choose an invisible grill when the clearer view matters more and spaced wires are enough.",
      },
      {
        question: "Will the net sag after a few months?",
        answer:
          "A net that is only tied at the corners will sag. The installation spreads the anchors and tensions the mesh. Sun still ages plastic, which is why the mesh is UV stabilised, but the fixing pattern is what keeps it flat.",
      },
      {
        question: "Can the net be taken down later?",
        answer:
          "Yes. It is a fitted cover, not a rebuilt wall. Removal means releasing the anchors. The visit will say whether those anchors are in the frame or in the wall.",
      },
    ],
    seoTitle: "Balcony Safety Nets for Homes in Andhra Pradesh",
    seoDescription:
      "Balcony safety nets for children, pets, and falling objects in Andhra Pradesh. Mesh and anchors are chosen after the opening is measured.",
    ...pictures(
      "balcony-safety-nets",
      "Balcony covered by a taut safety-net mesh",
      "Diagram of a rectangular opening filled with safety-net mesh",
      "Corner anchors holding a balcony safety net in tension",
    ),
    relatedServices: ["invisible-grills", "duct-area-nets", "building-covering"],
    active: true,
    indexable: true,
  },
  {
    id: "cloth-hangers",
    name: "Cloth Hangers",
    slug: "cloth-hangers",
    shortDescription:
      "Ceiling-mounted drying rods that lift clothes off the railing and use the height an apartment already has.",
    description:
      "Most apartments dry clothes on the balcony railing or on a stand that blocks the floor. A cloth hanger moves that load to the ceiling. Rods or a pulley run are fixed to the slab, clear of the fan and the light, so the railing can stay free for a grill or a net. The layout is drawn from the slab you have. A standard rod kit that crosses a fan or lands on a weak plaster patch is not installed just because it is the size in the brochure.",
    benefits: [
      "Frees the balcony railing for safety fittings or for simply walking past",
      "Uses ceiling height instead of floor space in a narrow balcony",
      "Keeps wet clothes off the parapet, where they stain and drip on the floor below",
      "Can be planned in the same visit as a grill or a net so the fixings do not clash",
    ],
    features: [
      "Stainless or aluminium rods sized to the clear ceiling run, so daily wet clothes are not hung on a light indoor rail",
      "Ceiling brackets placed away from fans, lights, and conduit",
      "Pulley hardware where the ceiling is too high to reach a fixed rod comfortably",
      "Load carried by the slab, not by the railing",
    ],
    applications: [
      "Apartments with no separate utility yard",
      "Balconies too narrow for a floor-standing dryer",
      "Homes that want the railing kept clear",
      "Covered terraces used for daily drying",
    ],
    installationProcess: [
      {
        title: "Read the ceiling",
        detail:
          "The slab, fan, light points, and any boxed conduit are marked before a bracket position is chosen.",
      },
      {
        title: "Set the rod length",
        detail:
          "The run stops short of walls and sliding tracks. A rod that looks longer on paper often cannot pass the fan.",
      },
      {
        title: "Fix the brackets",
        detail:
          "Brackets go into the slab where it can take them. If the ceiling build-up is only a weak false layer, the fixing method changes or the job stops.",
      },
      {
        title: "Hang and test the travel",
        detail:
          "Rods or the pulley line are fitted and moved through their range so clothes will not hit the grill, the light, or the neighbour’s line.",
      },
    ],
    faqs: [
      {
        question: "Can a cloth hanger share a balcony with an invisible grill?",
        answer:
          "Yes, and it is better to plan both together. The rod height has to clear the top channel, and the brackets should not land on the same line as the grill fixings.",
      },
      {
        question: "What if the balcony already has a ceiling fan?",
        answer:
          "The rod layout is drawn around the fan. If there is no safe run left, we will say so instead of forcing a full-width kit under the blades.",
      },
      {
        question: "How much weight can it take?",
        answer:
          "That depends on the slab and the bracket spacing, not on a single number for every balcony. The quote names the layout we measured. We do not publish a universal load that ignores the ceiling.",
      },
    ],
    seoTitle: "Ceiling Cloth Hangers for Apartments in Andhra Pradesh",
    seoDescription:
      "Ceiling cloth hangers for Andhra Pradesh apartments. The rod layout is planned around the slab, fan, and lights before brackets are drilled.",
    ...pictures(
      "cloth-hangers",
      "Ceiling-mounted cloth hanger rods above a balcony",
      "Diagram of hanger rods suspended from a ceiling slab",
      "Ceiling brackets carrying a drying rod",
    ),
    relatedServices: ["invisible-grills", "balcony-safety-nets"],
    active: true,
    indexable: true,
  },
  {
    id: "sports-nets",
    name: "Sports Nets",
    slug: "sports-nets",
    shortDescription:
      "Practice enclosures for cricket and other games, sized to a terrace, a yard, or a small residential court.",
    description:
      "A sports net is a different product from a balcony safety net. The mesh, the poles, and the height are there to keep balls inside a playing bay. At a home this is often a short cricket net on a terrace or in a backyard. Football and badminton practice use the same enclosure when the measured bay has the width and height for that game. At a school or an apartment club it may be a longer bay with side and roof mesh. The ground under the bay, the way poles are anchored, and what sits beyond the net, including glass and neighbouring homes, decide whether the space is actually usable.",
    benefits: [
      "Keeps practice balls off glass, parked vehicles, and the next house",
      "Sized to the bay you have, including short terrace runs",
      "Side mesh and roof mesh can be planned as one enclosure",
      "Separated from balcony nets so the mesh grade matches the sport",
    ],
    features: [
      "Sports-grade net, not the lighter mesh used on a balcony window",
      "Poles or wall fixings set out from the measured bay",
      "Roof mesh where balls would otherwise leave over the top",
      "Height and length agreed before poles are planted",
    ],
    applications: [
      "Cricket practice on a terrace, backyard, or short home bay",
      "Football and badminton practice where the measured bay is wide enough",
      "School corners used for practice",
      "Residential courts and apartment clubhouses",
      "Open lawns that sit too close to glass, a road, or the next house",
    ],
    installationProcess: [
      {
        title: "Measure the bay, not just the wish",
        detail:
          "Length, width, height, and what surrounds the space are measured. A terrace that cannot take poles safely is not a cricket net.",
      },
      {
        title: "Place the anchors",
        detail:
          "Poles need a base or a wall that can hold them. The quote names that fixing. It is not assumed from a catalogue picture.",
      },
      {
        title: "Hang the side and roof mesh",
        detail:
          "Sides go up first. Roof mesh is added where the sport needs it, tied so there is no open corner for a ball to leave.",
      },
      {
        title: "Check the playing line",
        detail:
          "You can see the finished bay and the clearance around it before the job is called complete.",
      },
    ],
    faqs: [
      {
        question: "Can a sports net fit a home terrace?",
        answer:
          "Only if there is room for the poles and a safe way to anchor them. A home bay is shorter than a school net. If the terrace is too tight for the game, we will say that at the visit.",
      },
      {
        question: "Is this the same mesh as a balcony safety net?",
        answer:
          "No. Balcony mesh is for people and small objects at a railing. Sports mesh is for balls in a practice bay, often with a roof. Using one in place of the other gives the wrong strength and the wrong shape.",
      },
      {
        question: "Do you build full stadium enclosures?",
        answer:
          "The work we publish is practice bays for homes, schools, and residential courts. A competition ground is a different structure and is not what this service describes.",
      },
    ],
    seoTitle: "Sports Practice Nets in Andhra Pradesh",
    seoDescription:
      "Sports practice nets for terraces, yards, and small courts in Andhra Pradesh. Pole positions and mesh height follow the space you have.",
    ...pictures(
      "sports-nets",
      "Practice bay enclosed by sports netting on the sides and overhead",
      "Diagram of a sports-net grid across a practice opening",
      "End poles carrying the lines of a sports net",
    ),
    relatedServices: ["safety-spikes", "building-covering"],
    active: true,
    indexable: true,
  },
  {
    id: "safety-spikes",
    name: "Safety Spikes",
    slug: "safety-spikes",
    shortDescription:
      "Polycarbonate or stainless strips on ledges where birds settle or a wall is easy to climb, and nowhere people are meant to stand.",
    description:
      "Safety spikes are strips fixed along a ledge. They are used on parapets, outdoor AC platforms, signage edges, and the tops of compound walls. The point is to make a roost or a foothold uncomfortable, not to fence a balcony people use. They do not belong on a handrail, a stair, or any surface someone walks on. Where pigeons are entering through a shaft, spikes on the outer ledge are often paired with a duct net. One does not replace the other.",
    benefits: [
      "Discourages roosting on ledges without covering the whole balcony",
      "Makes a low compound wall harder to climb",
      "Follows the ledge, so the strip does not cross a walking path",
      "Can sit alongside a duct net where birds use both the ledge and the shaft",
    ],
    features: [
      "Polycarbonate or stainless spike strips",
      "Adhesive or screw fixing, chosen for the ledge material",
      "Runs cut to corners, slopes, and breaks around AC brackets",
      "Omitted from handrails and any surface people stand on",
    ],
    applications: [
      "Parapet walls and sunshades",
      "Outdoor air-conditioner ledges",
      "Compound walls with an easy foothold",
      "Beam edges and signage that collect nesting",
    ],
    installationProcess: [
      {
        title: "Walk the ledges",
        detail:
          "Every run is looked at. A ledge above a balcony door is not treated like a parapet nobody touches.",
      },
      {
        title: "Leave walking surfaces clear",
        detail:
          "If a surface is a route for people, spikes are not fitted there. The quote says what is included and what is refused.",
      },
      {
        title: "Fix the strips",
        detail:
          "The strip is screwed or bonded to a clean ledge. Paint that is peeling is not a fixing surface.",
      },
      {
        title: "Close the ends",
        detail:
          "Corners and stops are finished so there is no open gap that simply moves the roost one foot along.",
      },
    ],
    faqs: [
      {
        question: "Are safety spikes a balcony railing?",
        answer:
          "No. They are ledge strips. A balcony that people use needs a grill, a net, or a proper railing. Spikes are not a handhold and they are not fitted where someone stands.",
      },
      {
        question: "Will spikes alone stop pigeons in a duct?",
        answer:
          "Not always. Birds that nest inside a shaft need the opening covered, which is a duct net. Spikes help on the outer ledge. Many buildings need both.",
      },
      {
        question: "Which material is used?",
        answer:
          "Polycarbonate or stainless steel. The ledge, the weather, and whether the run is in full sun decide the choice at the visit. There is no single strip for every wall.",
      },
    ],
    seoTitle: "Safety Spikes for Ledges and Parapets in Andhra Pradesh",
    seoDescription:
      "Safety spikes for parapets, AC ledges, and compound walls in Andhra Pradesh. Strips are fitted only where people do not stand or walk.",
    ...pictures(
      "safety-spikes",
      "Spike strips mounted along a parapet ledge",
      "Diagram of a ledge with a continuous run of safety spikes",
      "Short spike row fixed to the top of a wall",
    ),
    relatedServices: ["duct-area-nets", "balcony-safety-nets"],
    active: true,
    indexable: true,
  },
  {
    id: "duct-area-nets",
    name: "Duct Area Nets",
    slug: "duct-area-nets",
    shortDescription:
      "Nets across plumbing ducts, AC shafts, and utility recesses that railings never cover.",
    description:
      "The dangerous gap in many apartment blocks is not the balcony. It is the plumbing duct or AC shaft beside the kitchen or the bathroom, open at each floor. Objects drop between floors. Pigeons treat the ledges as shelves. A duct area net is cut to that opening, including around the pipes that already cross it, and anchored to the surrounding wall or frame. It is not a balcony net stretched over a shaft and hoped into shape. If the outer ledge is also a roost, safety spikes are a separate run.",
    benefits: [
      "Closes a fall gap that the balcony railing does not cover",
      "Reduces the shelf pigeons use inside a shaft",
      "Cut around pipes instead of leaving a hole beside them",
      "Planned per floor, because shafts are rarely the same from one landing to the next",
    ],
    features: [
      "UV-stable net sized to the measured shaft",
      "Anchors into the wall or frame around the opening",
      "Shaped around soil pipes, water lines, and AC trunks",
      "Separate from balcony mesh so the fixing suits a vertical shaft",
    ],
    applications: [
      "Plumbing and drainage ducts",
      "AC and ventilation shafts",
      "Utility recesses open on each floor",
      "Gaps above common stair landings",
    ],
    installationProcess: [
      {
        title: "Measure the shaft, floor by floor",
        detail:
          "Width, height, and the pipes inside are measured. A drawing of a typical duct is not the opening in front of us.",
      },
      {
        title: "Check the anchor line",
        detail:
          "The wall around the shaft has to hold the fixings. Loose tiles or hollow plaster are not ignored.",
      },
      {
        title: "Cut and fit the net",
        detail:
          "The mesh is shaped around the services in the shaft and pulled tight so it does not hang into the duct.",
      },
      {
        title: "Close the leftover gaps",
        detail:
          "Edges beside pipes are finished. If the outer ledge still needs spikes, that is quoted as its own item.",
      },
    ],
    faqs: [
      {
        question: "Can one net pattern be repeated on every floor?",
        answer:
          "Only when the openings match. Pipes shift, and some floors have a smaller recess. Each opening we are asked to cover is measured.",
      },
      {
        question: "Will the net block plumbers later?",
        answer:
          "The net is a fitted cover, so a future repair may need it released at that opening. We place anchors so the panel can be understood, not buried in a knot of rope with no edge.",
      },
      {
        question: "Is this the same as a balcony safety net?",
        answer:
          "The mesh family is similar. The opening is not. A duct net is cut for a shaft, often with pipes through it. A balcony net covers a railing line people stand behind.",
      },
    ],
    seoTitle: "Duct Area Nets for Shafts in Andhra Pradesh",
    seoDescription:
      "Duct area nets for plumbing shafts, AC ducts, and utility openings in Andhra Pradesh. Each shaft is measured, including pipes that cross the gap.",
    ...pictures(
      "duct-area-nets",
      "Utility shaft covered by a duct area net, with a pipe passing through",
      "Diagram of a tall duct opening filled with netting",
      "Anchors at the corners of a duct net",
    ),
    relatedServices: ["safety-spikes", "balcony-safety-nets", "invisible-grills"],
    active: true,
    indexable: true,
  },
  {
    id: "building-covering",
    name: "Building Covering",
    slug: "building-covering",
    shortDescription:
      "Debris and shade nets hung for a stage of construction or repair, then taken down when that stage ends.",
    description:
      "Building covering is temporary. It screens a block while plaster, tile, painting, or other external work is underway. Debris net is there to catch material before it reaches the ground or a neighbouring roof. Shade and green net reduce dust and sun on the working face. The sheet is tied to scaffold or to anchors that can hold it, and it comes down when that stage is finished. It is not a permanent balcony product. A home that needs lasting protection at a railing needs a grill, a net, or both.",
    benefits: [
      "Catches falling debris during plaster, tile, and similar work",
      "Screens dust from homes beside the site",
      "Can shade the working face while that stage is open",
      "Removed when the stage ends, instead of being left as a torn sheet",
    ],
    features: [
      "Debris net, shade net, or green covering, chosen for the work underway",
      "Ties to scaffold or structural anchor points, not to a loose railing",
      "Coverage planned around the face that is actually being worked on",
      "A removal point agreed with the stage of construction",
    ],
    applications: [
      "Apartments under renovation",
      "New blocks before handover, while external work continues",
      "Painting and external plaster",
      "Sites beside an occupied neighbouring building",
    ],
    installationProcess: [
      {
        title: "Walk the face that needs cover",
        detail:
          "Height, width, and how the scaffold or slab edge can take ties are checked. The whole building is not wrapped by default.",
      },
      {
        title: "Choose the net for the stage",
        detail:
          "Debris control and shade are different cloths. The quote names which one is being hung and why.",
      },
      {
        title: "Tie it off",
        detail:
          "The sheet is fixed so a gust does not turn it into a sail. Loose corners are the usual failure, so the edges are part of the job.",
      },
      {
        title: "Plan the take-down",
        detail:
          "Covering stays for the stage it was hung for. When that work ends, it is removed rather than left to fray.",
      },
    ],
    faqs: [
      {
        question: "Is building covering permanent?",
        answer:
          "No. It stays up for the construction or repair stage it was hung for, then it is taken down. Lasting balcony protection is a grill, a safety net, or both.",
      },
      {
        question: "Can it be tied to the balcony railing?",
        answer:
          "Only if that railing can hold the load, which many cannot. The usual tie is scaffold or a structural anchor. The visit is where that is decided.",
      },
      {
        question: "Do you leave the net after painting is finished?",
        answer:
          "Not as a completed job. If the net is still needed for a later stage, that is a separate instruction. Otherwise it comes down.",
      },
    ],
    seoTitle: "Building Covering Nets for Construction in Andhra Pradesh",
    seoDescription:
      "Temporary building covering for construction, plaster, and painting in Andhra Pradesh. Debris and shade nets are hung for that stage, then removed.",
    ...pictures(
      "building-covering",
      "Building face screened by construction covering net",
      "Diagram of a facade with a covering net across the work area",
      "Vertical ties holding building covering between scaffold lines",
    ),
    relatedServices: ["sports-nets", "duct-area-nets"],
    active: true,
    indexable: true,
  },
];
