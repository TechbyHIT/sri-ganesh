/**
 * Supplied service catalog: eight categories and the 54 entries the brief listed.
 * (The brief said 56. The list it supplied has 54. Nothing was added to make up the difference.)
 *
 * Entries are kept as named requests. Each resolves to a page that already exists.
 * - "canonical": the entry is the published service page itself.
 * - "merged": same customer intent as an existing page; served there, no separate URL.
 * - "unverified": the business has not confirmed this work; kept for review, no public link.
 *
 * Pure data with no imports so next.config.ts can read it for redirects.
 */
export type CatalogIntentStatus = "canonical" | "merged" | "unverified";

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  /** Slug in data/services.ts that this category is served under. */
  serviceSlug: string;
  summary: string;
};

export type CatalogEntry = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  searchIntent: string;
  /** Existing published page that answers this request. */
  canonicalPath: string;
  status: CatalogIntentStatus;
};

const SERVICE = {
  grills: "/services/invisible-grills",
  balconyNets: "/services/balcony-safety-nets",
  ductNets: "/services/duct-area-nets",
  sports: "/services/sports-nets",
  hangers: "/services/cloth-hangers",
  spikes: "/services/safety-spikes",
  child: "/solutions/child-balcony-safety",
  pet: "/solutions/pet-balcony-safety",
  property: "/property-types",
} as const;

export const serviceCategories: ServiceCategory[] = [
  {
    id: "invisible-grills",
    name: "Invisible Grills",
    slug: "invisible-grills",
    serviceSlug: "invisible-grills",
    summary: "Tensioned stainless wires across a balcony or window opening.",
  },
  {
    id: "safety-nets",
    name: "Safety Nets",
    slug: "safety-nets",
    serviceSlug: "balcony-safety-nets",
    summary: "Knotted mesh fixed across railings and openings for people and pets.",
  },
  {
    id: "balcony-nets",
    name: "Balcony Nets",
    slug: "balcony-nets",
    serviceSlug: "balcony-safety-nets",
    summary: "The balcony-specific use of the same safety-net service.",
  },
  {
    id: "bird-nets",
    name: "Bird Nets",
    slug: "bird-nets",
    serviceSlug: "duct-area-nets",
    summary: "Mesh that closes shafts, ducts, and openings birds use.",
  },
  {
    id: "pigeon-nets",
    name: "Pigeon Nets",
    slug: "pigeon-nets",
    serviceSlug: "balcony-safety-nets",
    summary: "Balcony and window mesh against pigeons; duct mesh for shafts.",
  },
  {
    id: "sports-nets",
    name: "Sports Nets",
    slug: "sports-nets",
    serviceSlug: "sports-nets",
    summary: "Practice-bay enclosures for terraces, yards, schools, and clubs.",
  },
  {
    id: "cloth-hangers",
    name: "Cloth Hangers",
    slug: "cloth-hangers",
    serviceSlug: "cloth-hangers",
    summary: "Ceiling-mounted drying rods and pulley runs.",
  },
  {
    id: "bird-spikes",
    name: "Bird Spikes",
    slug: "bird-spikes",
    serviceSlug: "safety-spikes",
    summary: "Stainless spike strips on ledges, parapets, and sunshades.",
  },
];

function entry(
  categoryId: string,
  slug: string,
  name: string,
  searchIntent: string,
  canonicalPath: string,
  status: CatalogIntentStatus = "merged",
): CatalogEntry {
  return { id: `${categoryId}:${slug}`, name, slug, categoryId, searchIntent, canonicalPath, status };
}

export const catalogEntries: CatalogEntry[] = [
  // Category 1: Invisible Grills
  entry("invisible-grills", "invisible-grills", "Invisible Grills", "Invisible grill installation", SERVICE.grills, "canonical"),
  entry("invisible-grills", "balcony-invisible-grills", "Balcony Invisible Grills", "Invisible grill across a balcony railing", SERVICE.grills),
  entry("invisible-grills", "window-invisible-grills", "Window Invisible Grills", "Invisible grill on a window or French door", SERVICE.grills),
  entry("invisible-grills", "invisible-grills-for-apartments", "Invisible Grills for Apartments", "Invisible grill for a flat", SERVICE.property),
  entry("invisible-grills", "invisible-grills-for-villas", "Invisible Grills for Villas", "Invisible grill for an independent house", SERVICE.property),
  entry("invisible-grills", "invisible-grills-for-child-safety", "Invisible Grills for Child Safety", "Keep a child away from a balcony edge", SERVICE.child),
  entry("invisible-grills", "invisible-grills-for-pets", "Invisible Grills for Pets", "Keep a pet inside a balcony", SERVICE.pet),

  // Category 2: Safety Nets
  entry("safety-nets", "safety-nets", "Safety Nets", "Safety net installation", SERVICE.balconyNets),
  entry("safety-nets", "balcony-safety-nets", "Balcony Safety Nets", "Safety net across a balcony", SERVICE.balconyNets, "canonical"),
  entry("safety-nets", "kids-safety-nets", "Kids Safety Nets", "Net to protect children at a railing", SERVICE.child),
  entry("safety-nets", "child-safety-nets", "Child Safety Nets", "Net to protect children at a railing", SERVICE.child),
  entry("safety-nets", "pet-safety-nets", "Pet Safety Nets", "Net to keep a pet off a balcony edge", SERVICE.pet),
  entry("safety-nets", "cat-safety-nets", "Cat Safety Nets", "Net to keep a cat inside a balcony", SERVICE.pet),
  entry("safety-nets", "dog-safety-nets", "Dog Safety Nets", "Net to keep a dog inside a balcony", SERVICE.pet),

  // Category 3: Balcony Nets
  entry("balcony-nets", "balcony-nets", "Balcony Nets", "Net across a balcony opening", SERVICE.balconyNets),
  entry("balcony-nets", "balcony-protection-nets", "Balcony Protection Nets", "Net across a balcony opening", SERVICE.balconyNets),
  entry("balcony-nets", "balcony-children-safety-nets", "Balcony Children Safety Nets", "Balcony net for a household with children", SERVICE.child),
  entry("balcony-nets", "balcony-pet-safety-nets", "Balcony Pet Safety Nets", "Balcony net for a household with pets", SERVICE.pet),
  entry("balcony-nets", "balcony-cat-nets", "Balcony Cat Nets", "Balcony net for a cat", SERVICE.pet),
  entry("balcony-nets", "apartment-balcony-nets", "Apartment Balcony Nets", "Balcony net in a flat", SERVICE.property),
  entry("balcony-nets", "high-rise-balcony-nets", "High Rise Balcony Nets", "Balcony net on an upper floor", SERVICE.property),

  // Category 4: Bird Nets
  entry("bird-nets", "bird-nets", "Bird Nets", "Mesh to keep birds out", SERVICE.ductNets),
  entry("bird-nets", "anti-bird-nets", "Anti Bird Nets", "Mesh to keep birds out", SERVICE.ductNets),
  entry("bird-nets", "bird-protection-nets", "Bird Protection Nets", "Mesh to keep birds out", SERVICE.ductNets),
  entry("bird-nets", "balcony-bird-nets", "Balcony Bird Nets", "Mesh to keep birds off a balcony", SERVICE.balconyNets),
  entry("bird-nets", "window-bird-nets", "Window Bird Nets", "Mesh to keep birds off a window ledge", SERVICE.balconyNets),
  entry("bird-nets", "duct-area-bird-nets", "Duct Area Bird Nets", "Mesh across a plumbing or AC duct", SERVICE.ductNets),

  // Category 5: Pigeon Nets
  entry("pigeon-nets", "pigeon-nets", "Pigeon Nets", "Mesh to keep pigeons out", SERVICE.balconyNets),
  entry("pigeon-nets", "anti-pigeon-nets", "Anti Pigeon Nets", "Mesh to keep pigeons out", SERVICE.balconyNets),
  entry("pigeon-nets", "pigeon-safety-nets", "Pigeon Safety Nets", "Mesh to keep pigeons out", SERVICE.balconyNets),
  entry("pigeon-nets", "balcony-pigeon-nets", "Balcony Pigeon Nets", "Mesh to keep pigeons off a balcony", SERVICE.balconyNets),
  entry("pigeon-nets", "window-pigeon-nets", "Window Pigeon Nets", "Mesh to keep pigeons off a window", SERVICE.balconyNets),
  entry("pigeon-nets", "duct-area-pigeon-nets", "Duct Area Pigeon Nets", "Mesh across a duct pigeons nest in", SERVICE.ductNets),

  // Category 6: Sports Nets
  entry("sports-nets", "sports-nets", "Sports Nets", "Practice-bay net", SERVICE.sports, "canonical"),
  entry("sports-nets", "cricket-nets", "Cricket Nets", "Cricket practice bay", SERVICE.sports),
  entry("sports-nets", "cricket-practice-nets", "Cricket Practice Nets", "Cricket practice bay", SERVICE.sports),
  entry("sports-nets", "football-nets", "Football Nets", "Football practice bay", SERVICE.sports),
  entry("sports-nets", "football-goal-nets", "Football Goal Nets", "Goal net supply", SERVICE.sports, "unverified"),
  entry("sports-nets", "golf-nets", "Golf Nets", "Golf practice net", SERVICE.sports, "unverified"),
  entry("sports-nets", "volleyball-nets", "Volleyball Nets", "Volleyball net", SERVICE.sports, "unverified"),

  // Category 7: Cloth Hangers
  entry("cloth-hangers", "cloth-hangers", "Cloth Hangers", "Ceiling cloth hanger installation", SERVICE.hangers, "canonical"),
  entry("cloth-hangers", "ceiling-cloth-hangers", "Ceiling Cloth Hangers", "Ceiling-mounted drying rods", SERVICE.hangers),
  entry("cloth-hangers", "balcony-cloth-hangers", "Balcony Cloth Hangers", "Drying rods on a balcony ceiling", SERVICE.hangers),
  entry("cloth-hangers", "wall-mounted-cloth-hangers", "Wall Mounted Cloth Hangers", "Wall-fixed drying rods", SERVICE.hangers),
  entry("cloth-hangers", "pulley-cloth-hangers", "Pulley Cloth Hangers", "Pulley-operated drying rods", SERVICE.hangers),
  entry("cloth-hangers", "stainless-steel-cloth-hangers", "Stainless Steel Cloth Hangers", "Stainless drying rods", SERVICE.hangers),
  entry("cloth-hangers", "clothes-drying-hangers", "Clothes Drying Hangers", "Ceiling drying hangers", SERVICE.hangers),

  // Category 8: Bird Spikes
  entry("bird-spikes", "bird-spikes", "Bird Spikes", "Spike strips on ledges", SERVICE.spikes),
  entry("bird-spikes", "pigeon-spikes", "Pigeon Spikes", "Spike strips against pigeons", SERVICE.spikes),
  entry("bird-spikes", "anti-bird-spikes", "Anti Bird Spikes", "Spike strips on ledges", SERVICE.spikes),
  entry("bird-spikes", "anti-pigeon-spikes", "Anti Pigeon Spikes", "Spike strips against pigeons", SERVICE.spikes),
  entry("bird-spikes", "bird-control-spikes", "Bird Control Spikes", "Spike strips on ledges", SERVICE.spikes),
  entry("bird-spikes", "pigeon-control-spikes", "Pigeon Control Spikes", "Spike strips against pigeons", SERVICE.spikes),
  entry("bird-spikes", "stainless-steel-bird-spikes", "Stainless Steel Bird Spikes", "Stainless spike strips", SERVICE.spikes),
];
