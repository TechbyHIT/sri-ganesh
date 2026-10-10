import { business } from "@/data/business";

/**
 * Site chrome and locale.
 * Name, contact, and origin come from data/business.ts.
 * Phone and email stay blank until real values are added there.
 */
export const site = {
  name: business.name,
  shortName: "Sri Ganesha",
  tagline: "Home safety for Vijayawada",
  description:
    "Invisible grills, balcony safety nets, cloth hangers, and related fittings for homes in Vijayawada and other published Andhra Pradesh cities.",
  url: business.website,
  locale: "en_IN",
  language: "en",
  region: "Andhra Pradesh",
  country: "India",
  /** ISO date for sitemap lastmod. Update when public content changes. */
  contentUpdated: "2026-10-09",
  email: business.email,
  phoneDisplay: business.phone,
  phoneTel: business.phone,
  whatsapp: business.whatsapp,
} as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/locations", label: "Locations" },
  { href: "/pricing-guide", label: "Prices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const cta = {
  id: "book",
  eyebrow: "Photo estimate",
  title: "Not sure which fitting suits the opening?",
  text: "Share the city, a photo of the full opening, and whether the priority is the balcony edge, birds in a shaft, drying space, or a practice corner.",
  primary: { href: "/contact", label: "Send opening details" },
  secondary: { href: "/locations/vijayawada", label: "Vijayawada services" },
} as const;
