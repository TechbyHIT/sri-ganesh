/**
 * Public business identity used by metadata and JSON-LD.
 * Leave phone, email, social profiles, and address empty until they are verified.
 * Do not add a street address that has not been confirmed.
 */
export type BusinessAddress = {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
};

export const business = {
  name: "Sri Ganesha Home Safety Solutions",
  phone: "",
  /** Digits with country code, used only for the WhatsApp button. Leave blank until verified. */
  whatsapp: "",
  email: "",
  /**
   * Public origin. Canonical URLs use this host.
   * Localhost stays on http. Any other http origin is published as https.
   * Replace with the live domain before launch.
   */
  website: "http://localhost:3000",
  serviceArea: "Andhra Pradesh, India",
  socialProfiles: [] as string[],
  address: undefined as BusinessAddress | undefined,
  logo: "/brand/mark.svg",
} as const;
