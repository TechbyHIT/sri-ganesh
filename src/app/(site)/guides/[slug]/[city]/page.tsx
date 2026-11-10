import type { Metadata } from "next";
import { SeoScreen } from "@/components/SeoPage";
import { services } from "@/data/services";
import { hubCitySlugs } from "@/seo/catalog";
import { metadataFor } from "@/seo/metadata";
import { guideCityPath } from "@/seo/urls";

type Params = { slug: string; city: string };

export function generateStaticParams() {
  return services.flatMap((service) =>
    service.intents.flatMap((intent) => hubCitySlugs.map((city) => ({ slug: intent.slug, city }))),
  );
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, city } = await params;
  return metadataFor(guideCityPath(slug, city));
}

export default async function GuideCityPage({ params }: { params: Promise<Params> }) {
  const { slug, city } = await params;
  return <SeoScreen path={guideCityPath(slug, city)} />;
}
