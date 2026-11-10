import type { Metadata } from "next";
import { pageAt } from "./catalog";
import { absoluteUrl } from "./urls";

export function metadataFor(path: string): Metadata {
  const page = pageAt(path);
  if (!page) return {};
  const image = { url: page.image.startsWith("http") ? page.image : absoluteUrl(page.image), alt: page.imageAlt };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    robots: page.index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      title: page.ogTitle,
      description: page.ogDescription,
      url: page.canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description: page.ogDescription,
      images: [image],
    },
  };
}
