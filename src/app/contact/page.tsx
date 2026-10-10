import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { propertyTypes } from "@/data/property-types";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";
import { getActiveCities } from "@/lib/locations";
import { getAllServices } from "@/lib/services";

export function generateMetadata(): Metadata {
  return staticMetadata("/contact");
}

export default function ContactPage() {
  const page = getStaticPage("/contact");

  if (!page) {
    notFound();
  }

  return (
    <StaticArticle page={page}>
      <QuoteForm
        services={getAllServices().map((service) => ({ slug: service.slug, name: service.name }))}
        cities={getActiveCities().map((city) => ({ slug: city.slug, name: city.name }))}
        propertyTypes={propertyTypes.map((item) => ({ slug: item.slug, name: item.name }))}
      />
    </StaticArticle>
  );
}
