export const heroSlides = [
  {
    src: "/home/hero-invisible-grills.webp",
    alt: "Apartment balcony with slim vertical stainless-steel safety cables and an open sea view",
    title: "Invisible grills in Visakhapatnam",
    text: "The Visakhapatnam invisible-grill page is published. The wires stay slim so the balcony still reads as open. Vijayawada is the primary city for new visits.",
    href: "/visakhapatnam/invisible-grills",
    cta: "Visakhapatnam grills",
  },
  {
    src: "/home/hero-balcony-net.webp",
    alt: "Coastal balcony enclosed with a taut knotted safety net",
    title: "Balcony safety nets",
    text: "A balcony net is a taut mesh across the opening. Kakinada can be named on the inspection form. A published Kakinada balcony-net page is not live yet.",
    href: "/services/balcony-safety-nets",
    cta: "Balcony nets",
  },
  {
    src: "/home/hero-pigeon-net.webp",
    alt: "Residential balcony covered with a fine mesh used to keep pigeons off the ledge",
    title: "Pigeon mesh for open balconies",
    text: "Pigeon mesh is planned as a balcony or shaft net, not as a separate unpublished city page. Rajahmundry already has a published duct-net page.",
    href: "/rajahmundry/duct-area-nets",
    cta: "Rajahmundry duct nets",
  },
  {
    src: "/home/hero-child-net.webp",
    alt: "Apartment balcony with a close safety net across the railing",
    title: "Closer mesh where children use the balcony",
    text: "Families in Vizianagaram can ask for a measurement. A net reduces the opening. It does not replace supervision, and the town is not a published service page yet.",
    href: "/services/balcony-safety-nets",
    cta: "Child balcony nets",
  },
  {
    src: "/home/hero-bird-net.webp",
    alt: "Terrace parapet fitted with a bird protection net under open sky",
    title: "Bird protection nets",
    text: "Bird mesh is specified when droppings or nesting are the problem. Srikakulam enquiries start with a photo of the ledge. Coverage is confirmed only on a published page.",
    href: "/services/balcony-safety-nets",
    cta: "Bird mesh",
  },
  {
    src: "/home/hero-cloth-hanger.webp",
    alt: "Utility balcony with a ceiling-mounted stainless cloth drying hanger",
    title: "Ceiling cloth hangers",
    text: "Drying rods move laundry off the railing. Vijayawada and Guntur have published cloth-hanger pages. Eluru can be named when you book the visit.",
    href: "/vijayawada/cloth-hangers",
    cta: "Vijayawada hangers",
  },
  {
    src: "/home/hero-sports-net.webp",
    alt: "Outdoor practice bay enclosed in green sports netting",
    title: "Sports nets in Andhra Pradesh",
    text: "Practice bays are measured on the ground, not copied from a balcony. Tirupati has a published sports-net page. Other grounds are quoted after a site visit.",
    href: "/tirupati/sports-nets",
    cta: "Tirupati sports nets",
  },
  {
    src: "/home/hero-cricket-net.webp",
    alt: "Empty cricket practice lane with tall side nets and a rear net",
    title: "Cricket practice nets",
    text: "A cricket lane uses the sports-net service: side nets, a rear net, and poles set to that pitch. There is no separate unpublished city page for every ground.",
    href: "/services/sports-nets",
    cta: "Sports nets",
  },
  {
    src: "/home/hero-bird-spikes.webp",
    alt: "Stainless steel bird spikes fixed along a clean concrete ledge",
    title: "Bird spikes on ledges",
    text: "Spikes sit on a ledge where birds land. Visakhapatnam and Tirupati have published safety-spike pages. The strip is not a net and it is not fitted on a balcony opening.",
    href: "/visakhapatnam/safety-spikes",
    cta: "Visakhapatnam spikes",
  },
  {
    src: "/home/hero-terrace-net.webp",
    alt: "High terrace with a perimeter safety net along the parapet",
    title: "Terrace safety nets",
    text: "A terrace net follows the parapet that was measured. Anakapalli, Narsipatnam, and Yelamanchili can be written on the form. They are not published service cities yet.",
    href: "/services/balcony-safety-nets",
    cta: "Terrace nets",
  },
] as const;

export const trustPoints = [
  { value: "Vijayawada", label: "Primary city for new visits" },
  { value: "7", label: "Published installation services" },
  { value: "Measured", label: "Every quote starts from the opening" },
  { value: "Listed", label: "Other cities only when a page is published" },
  { value: "Andhra Pradesh", label: "Enquiries can name nearby towns" },
] as const;

export const chipServices = [
  { label: "Invisible Grills", slug: "invisible-grills" },
  { label: "Safety Nets", slug: "balcony-safety-nets" },
  { label: "Pigeon Nets", slug: "balcony-safety-nets" },
  { label: "Balcony Safety Nets", slug: "balcony-safety-nets" },
  { label: "Children Safety Nets", slug: "balcony-safety-nets" },
  { label: "Bird Nets", slug: "balcony-safety-nets" },
  { label: "Bird Spikes", slug: "safety-spikes" },
  { label: "Cloth Hangers", slug: "cloth-hangers" },
  { label: "Sports Nets", slug: "sports-nets" },
  { label: "Cricket Nets", slug: "sports-nets" },
] as const;

export const enquiryCities = [
  { name: "Vijayawada", slug: "vijayawada" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
  { name: "Kakinada", slug: "kakinada" },
  { name: "Rajahmundry", slug: "rajahmundry" },
  { name: "Vizianagaram", slug: "vizianagaram" },
  { name: "Srikakulam", slug: "srikakulam" },
  { name: "Eluru", slug: "eluru" },
  { name: "Tadepalligudem", slug: "tadepalligudem" },
  { name: "Anakapalli", slug: "anakapalli" },
  { name: "Narsipatnam", slug: "narsipatnam" },
  { name: "Yelamanchili", slug: "yelamanchili" },
] as const;

export const offerCards = [
  {
    title: "Invisible Grills",
    serviceSlug: "invisible-grills",
    image: "/services/invisible-grills-hero.svg",
    alt: "Illustration of tensioned balcony wires in slim channels",
    points: ["Open view", "Measured spacing", "Stainless wire"],
    summary:
      "An invisible grill is tensioned stainless-steel wire between slim channels. It is the right conversation when the balcony should stay visually open and the wide gaps still need to be closed. The channel line follows the real opening, including columns, sliding tracks, and corners that are not square. Spacing is set for the people who use that balcony, tighter where small children lean on the railing. Visakhapatnam and Vijayawada already have published invisible-grill pages. Other towns can be named on the inspection form without being treated as a live service page.",
  },
  {
    title: "Pigeon Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/balcony-safety-nets-opening.svg",
    alt: "Illustration of a balcony opening prepared for a safety mesh",
    points: ["Ledges and windows", "Mesh, not spikes", "Photo first"],
    summary:
      "Pigeon nets are a fine mesh across the balcony, window bay, or shaft where birds land and nest. The mesh is planned with the balcony-net or duct-net service, depending on whether the opening is a living balcony or a service shaft. A photo should show the ledge, the pipes, and how the window opens. Rajahmundry, Kakinada, and Visakhapatnam already have published duct-net pages for shaft work. A pigeon enquiry for another town is a measurement request, not a new city page.",
  },
  {
    title: "Balcony Safety Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/balcony-safety-nets-hero.svg",
    alt: "Illustration of a balcony covered by a taut safety net",
    points: ["Taut mesh", "Usable doors", "Guntur page live"],
    summary:
      "A balcony safety net is a taut mesh from the railing line to the points that can hold it. Families choose it when the gap itself should be covered, not only marked with wires. Doors, drying space, and the way you still step onto the balcony are drawn before the net is cut. Guntur has the published balcony-net page. Kakinada and the other coastal towns on this homepage can be named when you ask for a visit. The quote follows that opening, not a city-wide rate.",
  },
  {
    title: "Children Safety Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/balcony-safety-nets-fixing.svg",
    alt: "Illustration of safety-net fixings along a balcony edge",
    points: ["Closer mesh", "Adult access kept", "Supervision still matters"],
    summary:
      "A children safety net is a balcony net with spacing and a fixing height chosen because children use that opening. It reduces the gap a child can slip through. It is not a substitute for supervision, and it is not a claim that every net suits every age. The visit looks at climbable rails, furniture placed against the net, and whether a door must still open. Vizianagaram and other towns can be written on the form. Installation in a rented flat needs the owner’s permission and a sound surface.",
  },
  {
    title: "Pets Safety Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/invisible-grills-opening.svg",
    alt: "Illustration of an open balcony edge before a safety fitting",
    points: ["Cats and dogs", "Mesh or wires", "No chewed corners"],
    summary:
      "Pet safety on a balcony is usually a mesh, sometimes wires, so a cat or a small dog cannot squeeze out. The choice depends on claws, chewing, and whether you still want an open view. A net is more visible and closes the gap. Wires leave the view and need spacing tight enough for that pet. Tell us the animal and send a photo of the full opening. Published pages do not exist for every town. The visit confirms the surface before any fitting is promised.",
  },
  {
    title: "Bird Protection Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/duct-area-nets-opening.svg",
    alt: "Illustration of a shaft opening that can take a protective mesh",
    points: ["Nesting ledges", "Droppings", "Mesh specification"],
    summary:
      "Bird protection nets cover the place birds enter, which may be a balcony, a ventilator, or the top of a shaft. The mesh grade is chosen for that opening, not from a single catalogue photo. Spikes are a different product and belong on a landing ledge, not across a door. Srikakulam enquiries should include a photo of where the birds sit. If that town has no published service page, the next step is a measurement, and the work is scheduled only after the quote is approved.",
  },
  {
    title: "Anti Bird Spikes",
    serviceSlug: "safety-spikes",
    image: "/services/safety-spikes-hero.svg",
    alt: "Illustration of bird spikes along a narrow ledge",
    points: ["Ledges only", "Not a balcony net", "Two city pages"],
    summary:
      "Anti bird spikes are stainless or polycarbonate strips fixed to a ledge, beam, or sign where birds land. They do not close a balcony the way a net does. They are a poor fit on a wide opening and they are not installed where someone must grip the edge. Visakhapatnam and Tirupati have published safety-spike pages. Other towns can ask for a visit. The quote names the length of ledge and the base that can take the strip. A damaged old strip is looked at before a new run is added.",
  },
  {
    title: "Terrace Safety Nets",
    serviceSlug: "balcony-safety-nets",
    image: "/services/invisible-grills-fixing.svg",
    alt: "Illustration of end fixings for a balcony safety run",
    points: ["Parapet line", "Wind and access", "Measured, not assumed"],
    summary:
      "A terrace safety net follows the parapet and the openings people actually walk toward. Height, wind, and how the installer reaches the edge change the work, so they are recorded on site. A photo from the stair door is a start. It is not a measurement. Anakapalli, Narsipatnam, Yelamanchili, and Tadepalligudem can be named on the form. None of those towns has a published terrace-net page yet. The fitting is quoted only for the terrace that was seen.",
  },
  {
    title: "Duct Area Nets",
    serviceSlug: "duct-area-nets",
    image: "/services/duct-area-nets-hero.svg",
    alt: "Illustration of a duct opening covered with a safety net",
    points: ["Shafts and pipes", "Three city pages", "Access planned"],
    summary:
      "Duct area nets close a shaft, a service duct, or a ventilator where a fall, a bird, or a dropped object is the risk. Pipes and brackets usually cross the opening, so the net is cut around them instead of pulled in one rectangle. Visakhapatnam, Kakinada, and Rajahmundry have published duct-net pages. A duct in another town is still a site job: the visit records height, the landing, and whether the net must be opened later for maintenance.",
  },
  {
    title: "Ceiling Cloth Hangers",
    serviceSlug: "cloth-hangers",
    image: "/services/cloth-hangers-hero.svg",
    alt: "Illustration of a ceiling-mounted cloth drying hanger",
    points: ["Off the railing", "Ceiling fixings", "Vijayawada page"],
    summary:
      "A ceiling cloth hanger lifts drying off the balcony rail so the net or grill underneath is not used as a clothesline. The rods and the pulley, if there is one, need a ceiling or beam that can hold them. Vijayawada has the published cloth-hanger page, and Guntur has one too. Eluru can be requested on the form. The visit checks fan clearance, the slab, and how far the rods should travel. A hanger is not a safety net and it is not sold as one.",
  },
  {
    title: "Wall Mounted Cloth Hangers",
    serviceSlug: "cloth-hangers",
    image: "/services/cloth-hangers-opening.svg",
    alt: "Illustration of a balcony prepared for a wall-fixed drying rack",
    points: ["Side wall", "Short balconies", "Same service"],
    summary:
      "Wall mounted hangers suit a short balcony where the ceiling cannot take a rod, or where a ceiling fan already fills that space. Brackets go into the wall that was checked, not into a hollow cover or a loose tile. This is still the cloth-hanger service. Tell us if the balcony already has a net, because the brackets and the mesh should be planned together. There is no separate city page for wall brackets. The published hanger pages are Vijayawada and Guntur.",
  },
  {
    title: "Pulley Cloth Hangers",
    serviceSlug: "cloth-hangers",
    image: "/services/cloth-hangers-fixing.svg",
    alt: "Illustration of cloth-hanger fixings on a balcony",
    points: ["Raise and lower", "Clear of the net", "Quoted as a hanger"],
    summary:
      "A pulley cloth hanger lets the drying rods be lowered for loading and raised clear of the railing. The rope, the pulleys, and the stop are part of the same cloth-hanger quote. They are not a sports net and they are not a child barrier. The visit looks at who will pull the rope and whether it crosses a door. If a balcony net is added in the same job, the two fixing lines are drawn so they do not fight. Pricing follows the measured run and the hardware, after the opening is seen.",
  },
  {
    title: "Sports Nets",
    serviceSlug: "sports-nets",
    image: "/services/sports-nets-hero.svg",
    alt: "Illustration of a sports practice bay enclosed in netting",
    points: ["Ground, not a balcony", "Pole layout", "Tirupati page"],
    summary:
      "Sports nets enclose a practice bay, a school corner, or a games room opening. The mesh, the poles, and the ground anchors are different from a balcony kit. Tirupati has the published sports-net page. A ground in Srikakulam or anywhere else starts with the pitch size, the height of the side nets, and how players enter. Apartment balconies are not quoted as sports nets. If the job is a small home putting corner, say so, because the structure is lighter than a full bay.",
  },
  {
    title: "Cricket Practice Nets",
    serviceSlug: "sports-nets",
    image: "/services/sports-nets-opening.svg",
    alt: "Illustration of an open side of a sports net enclosure",
    points: ["Lane length", "Side and rear nets", "Sports-net service"],
    summary:
      "Cricket practice nets are a lane with side nets and a rear net, built under the sports-net service. The length of the pitch, the height of the sides, and the surface under the poles decide the quote. A photo of the ground helps. It does not replace the visit. There is no separate cricket page for each district. Schools, clubs, and house compounds can ask. The published sports-net city page today is Tirupati. Other grounds are scheduled only after measurement and an approved quote.",
  },
] as const;

export const materials = [
  {
    name: "SS304 invisible grill wire",
    text: "Stainless wire is the usual specification when a balcony grill must stay slim and resist ordinary weather, including coastal air.",
    benefits: ["Slim profile", "Can be re-tensioned", "Named on the quote"],
  },
  {
    name: "HDPE nets",
    text: "HDPE mesh is a common balcony and duct net. The grade and the knot are chosen after the opening is measured.",
    benefits: ["Balcony and shaft use", "UV resistance varies by grade", "Not one universal mesh"],
  },
  {
    name: "Nylon nets",
    text: "Nylon is considered when the opening needs a particular hand-feel or knot. It is not automatically better than HDPE.",
    benefits: ["Specified per opening", "Compared at the visit", "Not a hidden upgrade"],
  },
  {
    name: "Braided nets",
    text: "Braided construction is discussed for sports bays and heavier practice use, where the mesh takes repeated impact.",
    benefits: ["Practice bays", "Impact is part of the brief", "Pole layout still matters"],
  },
  {
    name: "Twisted nets",
    text: "Twisted nets are one of the constructions that can be used for balcony or bird mesh. The sample is confirmed before cutting.",
    benefits: ["Bird and balcony mesh", "Construction named in writing", "Edges finished to the opening"],
  },
  {
    name: "Stainless steel bird spikes",
    text: "Stainless spike strips are for ledges. They are not stretched across a balcony door.",
    benefits: ["Ledge landing spots", "Length measured", "Separate from nets"],
  },
  {
    name: "Aluminium cloth hanger systems",
    text: "Aluminium or stainless rods, wall brackets, or a pulley set. The metal is the one the ceiling or wall can hold.",
    benefits: ["Ceiling or wall", "Clear of fans", "Planned with any net"],
  },
] as const;

export const propertyTypes = [
  "Apartments",
  "Villas",
  "Schools",
  "Sports grounds",
  "Commercial buildings",
  "High-rise buildings",
  "Gated communities",
] as const;

export const projectCards = [
  {
    title: "Invisible grills",
    place: "Visakhapatnam",
    src: "/home/gallery-community.webp",
    alt: "White apartment facade with one balcony fitted with slim vertical safety cables",
    note: "A published invisible-grill city. The photo shows the kind of balcony, not a named client.",
  },
  {
    title: "Balcony safety net",
    place: "Kakinada enquiry",
    src: "/home/gallery-apartment.webp",
    alt: "Balcony corner with safety cables and a side mesh",
    note: "Kakinada’s published page is for duct nets. A balcony net is quoted after a visit.",
  },
  {
    title: "Pigeon mesh",
    place: "Rajahmundry",
    src: "/home/gallery-duct.webp",
    alt: "Service opening covered with a dark protective mesh",
    note: "Rajahmundry has a published duct-net page for shaft and pigeon mesh of that kind.",
  },
  {
    title: "Child balcony net",
    place: "Vizianagaram enquiry",
    src: "/home/gallery-villa.webp",
    alt: "Terrace edge with a safety net along a low parapet",
    note: "Vizianagaram is not a published service city. The visit comes before any date is promised.",
  },
  {
    title: "Sports net",
    place: "Srikakulam enquiry",
    src: "/home/gallery-school.webp",
    alt: "Empty school play area with green sports netting along one side",
    note: "Sports nets are published for Tirupati. Other grounds are measured first.",
  },
  {
    title: "Cloth hanger",
    place: "Eluru enquiry",
    src: "/services/cloth-hangers-hero.svg",
    alt: "Illustration of a ceiling cloth hanger on a utility balcony",
    note: "Published hanger pages are Vijayawada and Guntur. Eluru can be requested.",
  },
] as const;

export const galleryItems = [
  {
    src: "/services/sports-nets-fixing.svg",
    alt: "Illustration of sports-net pole fixings",
    caption: "Sports-net fixings",
  },
  {
    src: "/services/safety-spikes-opening.svg",
    alt: "Illustration of a ledge before bird spikes are fitted",
    caption: "Ledge prepared for spikes",
  },
  {
    src: "/services/safety-spikes-fixing.svg",
    alt: "Illustration of bird-spike fixings on a ledge",
    caption: "Spike strip fixing",
  },
  {
    src: "/services/duct-area-nets-fixing.svg",
    alt: "Illustration of a duct net tied around pipes",
    caption: "Duct net around pipes",
  },
  {
    src: "/services/building-covering-hero.svg",
    alt: "Illustration of temporary building covering during repair work",
    caption: "Temporary building cover",
  },
  {
    src: "/services/building-covering-opening.svg",
    alt: "Illustration of a building face prepared for a temporary cover",
    caption: "Cover before a repair stage",
  },
] as const;

export const steps = [
  { title: "Call or write", text: "Use the inspection form and name the city, the service, and what the opening has to do. Phone and WhatsApp appear here when those numbers are confirmed." },
  { title: "Free site inspection", text: "A visit looks at the opening, the fixing surface, and access. The form asks for that visit. It does not confirm a same-day slot." },
  { title: "Measurement and material", text: "Width, height, mesh or wire, and the anchors are chosen from what was measured. The material name is written on the quote." },
  { title: "Installation", text: "Work starts after you approve the quote. A single balcony is often one visit. A sports bay or a full shaft takes longer." },
  { title: "Handover", text: "Edges, doors, and everyday access are checked with you. Any supplier warranty is the one written for that material, not a blanket range." },
] as const;

export const reasons = [
  { title: "Measurement before tools", text: "The opening is seen before a price is treated as final. Two flats in one block can differ." },
  { title: "Material named in writing", text: "Wire, mesh, spikes, or rods are specified on the quote. A brand is listed only when that batch is the one being supplied." },
  { title: "Inspection before the quote", text: "The visit is how the job is scoped. A city name on this page is not a booking." },
  { title: "A stated visit, not a slogan", text: "The quote says what the visit covers. Same-day installation is not promised." },
  { title: "Support follows the quote", text: "Slack wires, a torn mesh, or a loose bracket are looked at against what was installed. A 2–20 year warranty is not published as a fact." },
  { title: "Vijayawada first", text: "New work is centred on Vijayawada. Other Andhra Pradesh cities appear as service pages only where coverage is already published." },
] as const;

export const solutions = [
  { title: "Pigeon control", text: "Mesh on the ledge or shaft where birds land.", href: "/solutions/shaft-and-duct-safety" },
  { title: "Balcony safety", text: "A net or a wire grill across the opening you use.", href: "/services/balcony-safety-nets" },
  { title: "Child safety", text: "Closer cover on a balcony children can reach.", href: "/solutions/child-balcony-safety" },
  { title: "Invisible protection", text: "Slim wires when the view should stay open.", href: "/services/invisible-grills" },
  { title: "Sports practice nets", text: "A bay or a cricket lane, measured on the ground.", href: "/services/sports-nets" },
  { title: "Cloth drying", text: "Ceiling, wall, or pulley rods off the railing.", href: "/services/cloth-hangers" },
  { title: "Bird spike protection", text: "Strips for a ledge, not for a doorway.", href: "/solutions/ledge-bird-deterrent" },
  { title: "Pet safety", text: "Mesh or wires sized for the animal that uses the balcony.", href: "/solutions/pet-balcony-safety" },
] as const;

export const readingCards = [
  {
    href: "/guides/balcony-safety-net-or-grill",
    title: "Balcony net or invisible grill",
    text: "When a mesh should close the gap, and when wires should leave the view open.",
    meta: "Guide",
  },
  {
    href: "/guides/invisible-grill-material-guide",
    title: "How invisible grill materials are chosen",
    text: "Wire, channels, and anchors are picked after the balcony is measured. This guide does not list a price.",
    meta: "Guide",
  },
  {
    href: "/guides/how-a-site-measurement-works",
    title: "What happens at a site measurement",
    text: "Opening size, fixing surface, height, and access. Nothing on that page is a finished rate.",
    meta: "Guide",
  },
] as const;

export const homeFaqs = [
  {
    question: "How do I get a quote?",
    answer:
      "Send the city, the service, and a photo of the full opening through the inspection form. The visit measures the opening. Pricing depends on measurements, material grade, required spacing, installation complexity, building height, site accessibility and total project quantity.",
  },
  {
    question: "How long does installation take?",
    answer:
      "A single balcony grill or net is often finished in one visit after measurement. Sports bays, long terraces, and shafts take longer because there are more fixing points. The quote names the visit. It does not promise same-day work.",
  },
  {
    question: "What warranty do you provide?",
    answer:
      "Any warranty is the one written on the quote for that material and that installation. A published range such as 2–20 years is not used, because it would not describe every mesh, wire, and site.",
  },
  {
    question: "Are safety nets safe for children?",
    answer:
      "A correctly fixed net reduces the opening a child can slip through. It does not replace supervision. Furniture against the net, a loose tie, or a cut mesh changes that protection, so those are checked at handover and if you ask for a later visit.",
  },
  {
    question: "Do invisible grills block the view?",
    answer:
      "The grill is slim wire, not a solid screen, so you still see through the balcony. A safety net is more visible because it is a mesh. The visit says which one suits the opening before you approve the work.",
  },
  {
    question: "Can nets be installed in rented apartments?",
    answer:
      "Only with the owner’s permission and a surface that can hold the anchors. A rented flat is not refused because it is rented. It is refused if the slab, the wall, or the permission is not sound.",
  },
  {
    question: "Do you provide same-day installation?",
    answer:
      "Same-day installation is not offered as a promise. Some single balconies are completed in the visit that follows measurement. The date is agreed after the quote, not from this page.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "Vijayawada is the primary city. Published service pages also exist for Visakhapatnam, Guntur, Tirupati, Rajahmundry, and Kakinada, each only for the services listed on that page. Vizianagaram, Srikakulam, Eluru, Tadepalligudem, Anakapalli, Narsipatnam, and Yelamanchili can be named on an enquiry. Naming them here does not publish a service page.",
  },
  {
    question: "What materials do you use?",
    answer:
      "Stainless wire for invisible grills, HDPE or nylon mesh for nets, spike strips for ledges, and aluminium or stainless rods for cloth hangers. The grade is named on the quote. A brand is named only when that product is the one being supplied.",
  },
  {
    question: "How do I maintain safety nets?",
    answer:
      "Keep the mesh clear of stored furniture, do not cut it to pass a pipe later, and ask for a visit if a tie is loose or a panel sags. Invisible-grill wires that go slack are re-tensioned at the end fittings rather than pulled by hand from the middle.",
  },
] as const;
