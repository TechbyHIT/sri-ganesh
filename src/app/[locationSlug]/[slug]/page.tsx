import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CombinationPage } from "@/components/content/CombinationPage";
import { serviceLocations } from "@/data/serviceLocations";
import { getServiceCityContent } from "@/lib/content";
import { getLocationBySlug } from "@/lib/locations";
import { generateServiceLocationMetadata } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/services";

/**
 * Public URL: /{city}/{service}.
 * The second segment is named slug because Next.js requires one param name
 * at this depth. The area route uses the same folder for /{city}/{area}/{service}.
 */
export function generateStaticParams() {
  return serviceLocations.flatMap((relation) => {
    if (!relation.active || !relation.indexable) {
      return [];
    }

    const location = getLocationBySlug(relation.locationSlug);

    if (!location || location.type !== "city" || !location.indexable) {
      return [];
    }

    return [{ locationSlug: location.slug, slug: relation.serviceSlug }];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string; slug: string }>;
}): Promise<Metadata> {
  const { locationSlug, slug } = await params;
  return generateServiceLocationMetadata(slug, locationSlug);
}

export default async function CityServicePage({
  params,
}: {
  params: Promise<{ locationSlug: string; slug: string }>;
}) {
  const { locationSlug, slug } = await params;
  const location = getLocationBySlug(locationSlug);
  const service = getServiceBySlug(slug);

  if (!location || location.type !== "city" || !service?.active) {
    notFound();
  }

  const content = getServiceCityContent(service.slug, location.slug);

  if (!content) {
    notFound();
  }

  return <CombinationPage service={service} location={location} content={content} />;
}
