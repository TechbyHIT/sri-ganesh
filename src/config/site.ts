export const site = {
  name: "Sri Ganesha Home Safety Solutions",
  shortName: "Sri Ganesha",
  tagline: "Invisible grills, safety nets and bird protection across Andhra Pradesh",
  description:
    "Sri Ganesha Home Safety Solutions measures and installs invisible grills, safety nets, pigeon nets, bird spikes, cloth hangers and sports nets for homes and buildings across Andhra Pradesh. Free site visit and a written quote.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://sriganeshahomesafety.in",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY || "9912811124",
  phoneTel: process.env.NEXT_PUBLIC_PHONE_TEL || "+919912811124",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "919912811124",
  email: process.env.NEXT_PUBLIC_EMAIL || "sriganeshahomesafetysolutions@gmail.com",
  hours: "Mon–Sun: 8:00 AM – 8:00 PM",
  address: "Andhra Pradesh, India",
  region: "Entire Andhra Pradesh",
};

export function telHref() {
  return site.phoneTel ? `tel:${site.phoneTel}` : "/contact";
}

export function whatsappHref(text: string) {
  if (!site.whatsapp) return "";
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
