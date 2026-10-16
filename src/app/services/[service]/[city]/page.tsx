import type { Metadata } from "next";
import { SeoScreen } from "@/components/SeoPage";
import { cities } from "@/data/cities";
import { services } from "@/data/services";
import { metadataFor } from "@/seo/metadata";
import { serviceCityPath } from "@/seo/urls";

type Params = { service: string; city: string };

export function generateStaticParams() {
  return services.flatMap((service) => cities.map((city) => ({ service: service.slug, city: city.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service, city } = await params;
  return metadataFor(serviceCityPath(service, city));
}

export default async function ServiceCityPage({ params }: { params: Promise<Params> }) {
  const { service, city } = await params;
  return <SeoScreen path={serviceCityPath(service, city)} />;
}
