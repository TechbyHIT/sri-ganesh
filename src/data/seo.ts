/**
 * Title and description templates.
 * Tokens: {service} {serviceLower} {city} {locality} {region} {summary}
 * The brand name is added by the Metadata title template, so these titles omit it.
 */

export const seo = {
  home: {
    title: "Safety Nets and Invisible Grills in Andhra Pradesh | Sri Ganesha",
    description:
      "Invisible grills, balcony safety nets, cloth hangers, and pigeon mesh. Vijayawada leads. Other Andhra Pradesh pages exist only where coverage is published.",
  },
  servicesIndex: {
    title: "Home Safety Services in Andhra Pradesh",
    description:
      "Invisible grills, balcony safety nets, cloth hangers, sports nets, safety spikes, duct area nets, and building covering.",
  },
  locationsIndex: {
    title: "Vijayawada and Other Service Areas",
    description:
      "Vijayawada is the main city. Other Andhra Pradesh pages appear only where a service pairing is already published.",
  },
  service: {
    title: "{service} in {region}",
    description: "{service} supply and installation across {region}. {summary}",
  },
  serviceCity: {
    title: "{service} in {city}",
    description: "{service} in {city}, {region}. {summary}",
  },
  serviceLocality: {
    title: "{service} in {locality}, {city}",
    description: "{service} in {locality}, {city}. {summary}",
  },
  notFound: {
    title: "Page not found",
    description: "This page is not part of Sri Ganesha Home Safety Solutions.",
  },
} as const;
