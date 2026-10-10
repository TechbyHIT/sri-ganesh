import type { MetadataRoute } from "next";
import { generateCanonicalUrl } from "@/lib/seo";

const groups = [
  "core-1.xml",
  "services-1.xml",
  "locations-1.xml",
  "areas-1.xml",
  "service-location-1.xml",
  "service-area-1.xml",
  "solutions-1.xml",
  "property-types-1.xml",
  "guides-1.xml",
  "blog-1.xml",
  "images-1.xml",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: [generateCanonicalUrl("/sitemap.xml"), ...groups.map((file) => generateCanonicalUrl(`/sitemaps/${file}`))],
  };
}
