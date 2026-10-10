import { business } from "@/data/business";

/**
 * Single source for public business facts.
 * Phone, WhatsApp, email, street address, coordinates, and social URLs
 * stay empty until they are verified. Do not invent them here.
 */
export const BUSINESS_CONFIG = {
  name: business.name,
  legalName: business.name,
  description:
    "Invisible grills, balcony safety nets, cloth hangers, sports nets, safety spikes, duct area nets, and building covering for homes in Andhra Pradesh.",
  websiteUrl: business.website,
  phone: {
    display: business.phone,
    raw: business.phone,
  },
  whatsapp: {
    display: business.whatsapp,
    raw: business.whatsapp,
  },
  email: business.email,
  address: {
    street: business.address?.streetAddress ?? "",
    city: business.address?.addressLocality ?? "",
    district: "",
    state: business.address?.addressRegion ?? "Andhra Pradesh",
    postalCode: business.address?.postalCode ?? "",
    country: business.address?.addressCountry ?? "India",
  },
  coordinates: {
    latitude: null,
    longitude: null,
  },
  logo: business.logo,
  defaultOpenGraphImage: "/brand/hero.svg",
  serviceArea: {
    primaryCity: "Vijayawada",
    state: "Andhra Pradesh",
    country: "India",
  },
  socialLinks: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
  analytics: {
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  },
} as const;
