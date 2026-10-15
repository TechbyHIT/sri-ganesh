import type { Metadata } from "next";
import { SeoScreen } from "@/components/SeoPage";
import { cities } from "@/data/cities";
import { services } from "@/data/services";
import { hubCitySlugs } from "@/seo/catalog";
import { metadataFor } from "@/seo/metadata";
import { topicOverlap } from "@/seo/topics";
import { serviceAreaPath } from "@/seo/urls";

type Params = { service: string; city: string; area: string };

const hubs = new Set(hubCitySlugs);

export function generateStaticParams() {
  return services.flatMap((service) =>
    cities
      .filter((city) => hubs.has(city.slug))
      .flatMap((city) =>
        city.areas
          .filter((area) => topicOverlap(service, `${area.detail} ${area.name}`))
          .map((area) => ({ service: service.slug, city: city.slug, area: area.slug })),
      ),
  );
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { service, city, area } = await params;
  return metadataFor(serviceAreaPath(service, city, area));
}

export default async function ServiceAreaPage({ params }: { params: Promise<Params> }) {
  const { service, city, area } = await params;
  return <SeoScreen path={serviceAreaPath(service, city, area)} />;
}
