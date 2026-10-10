import type { Metadata } from "next";
import { BUSINESS_CONFIG } from "@/config/business";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";
import { generateRobots } from "@/lib/seo/generate-robots";
import type { PageIndexabilityInput } from "@/types/page";

export type MetadataPage = PageIndexabilityInput & {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  openGraphImageAlt?: string;
  twitterTitle?: string;
  twitterDescription?: string;
};

export function generatePageMetadata(page: MetadataPage | null): Metadata {
  if (!page) {
    return {};
  }

  const indexable = isPageIndexable(page);
  const image = page.openGraphImage || BUSINESS_CONFIG.defaultOpenGraphImage;

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: page.canonicalUrl,
    },
    robots: generateRobots(indexable),
    openGraph: {
      title: page.openGraphTitle || page.title,
      description: page.openGraphDescription || page.metaDescription,
      url: page.canonicalUrl,
      siteName: BUSINESS_CONFIG.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: page.openGraphImageAlt || page.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitterTitle || page.title,
      description: page.twitterDescription || page.metaDescription,
      images: [image],
    },
  };
}
