import { generateCanonicalUrl } from "@/lib/seo";

export function imageSchema(input: { src: string; alt: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: generateCanonicalUrl(input.src),
    name: input.alt,
  };
}
