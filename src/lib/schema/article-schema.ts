import { generateCanonicalUrl } from "@/lib/seo";
import { business } from "@/data/business";

export function articleSchema(input: { title: string; description: string; path: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: generateCanonicalUrl(input.path),
    author: { "@type": "Organization", name: business.name },
  };
}
