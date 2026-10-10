import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq/Faq";
import { StaticArticle } from "@/components/content/StaticArticle";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";

export function generateMetadata(): Metadata {
  return staticMetadata("/faq");
}

export default function FaqPage() {
  const page = getStaticPage("/faq");

  if (!page) {
    notFound();
  }

  return (
    <StaticArticle page={page}>
      <Faq embedded title="Questions before a site visit" intro="These are the same answers used on the homepage." />
    </StaticArticle>
  );
}
