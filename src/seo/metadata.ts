import type { Metadata } from "next";
import { site } from "@/config/site";
import { heroImage } from "@/data/gallery";
import { pageAt } from "./catalog";
import { absoluteUrl } from "./urls";

export function firstSentence(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  const end = clean.search(/[.!?](?=\s|$)/);
  return end === -1 ? clean : clean.slice(0, end + 1);
}

export function metaDescription(value: string, max = 155) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max + 1);
  const sentence = Math.max(window.lastIndexOf(". "), window.lastIndexOf("! "), window.lastIndexOf("? "));
  if (sentence >= 70) return clean.slice(0, sentence + 1);
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return (space > 80 ? cut.slice(0, space) : cut).replace(/[.,;:\s]+$/, "");
}

export function staticMetadata(input: { title: string; description: string; path: string; image?: string; index?: boolean }): Metadata {
  const description = metaDescription(input.description);
  const canonical = absoluteUrl(input.path);
  const image = input.image ?? heroImage("site-share", "invisible-grills");
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const index = input.index !== false;
  return {
    title: input.title,
    description,
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      title: input.title,
      description,
      url: canonical,
      images: [{ url: imageUrl, alt: input.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description,
      images: [imageUrl],
    },
  };
}

export function metadataFor(path: string): Metadata {
  const page = pageAt(path);
  if (!page) return {};
  const description = metaDescription(page.description);
  const image = { url: page.image.startsWith("http") ? page.image : absoluteUrl(page.image), alt: page.imageAlt };
  return {
    title: page.title,
    description,
    alternates: { canonical: page.canonical },
    robots: page.index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: site.name,
      title: page.ogTitle,
      description,
      url: page.canonical,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.ogTitle,
      description,
      images: [image],
    },
  };
}
