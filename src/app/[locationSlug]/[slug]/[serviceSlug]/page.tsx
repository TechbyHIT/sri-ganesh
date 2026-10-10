import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CombinationPage } from "@/components/content/CombinationPage";
import { serviceLocations } from "@/data/serviceLocations";
import { getServiceLocalityContent } from "@/lib/content";
import { getLocationBySlug } from "@/lib/locations";
import { MatrixPage } from "@/components/MatrixPage/MatrixPage";
import { generateServiceLocationMetadata } from "@/lib/seo";
import { getServiceBySlug } from "@/lib/services";
import { matrixMetadata } from "@/lib/url-matrix/metadata";
import { getPublishedMatrixPage } from "@/lib/url-matrix/published";

/** Public URL: /{city}/{area}/{service}. `slug` is the area. */
export function generateStaticParams() {
  return serviceLocations.flatMap((relation) => {
    if (!relation.active || !relation.indexable) {
      return [];
    }

    const location = getLocationBySlug(relation.locationSlug);

    if (!location || location.type !== "locality" || !location.indexable) {
      return [];
    }

    return [
      {
        locationSlug: location.citySlug,
        slug: location.slug,
        serviceSlug: relation.serviceSlug,
      },
    ];
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locationSlug: string; slug: string; serviceSlug: string }>;
}): Promise<Metadata> {
  const { locationSlug, slug, serviceSlug } = await params;
  const matrix = getPublishedMatrixPage(`/${locationSlug}/${slug}/${serviceSlug}`);

  if (matrix) {
    return matrixMetadata(matrix);
  }

  return generateServiceLocationMetadata(serviceSlug, slug);
}

export default async function AreaServicePage({
  params,
}: {
  params: Promise<{ locationSlug: string; slug: string; serviceSlug: string }>;
}) {
  const { locationSlug, slug, serviceSlug } = await params;
  // District-level matrix URL: /{service}/{state}/{district}. Only approved pages render.
  const matrix = getPublishedMatrixPage(`/${locationSlug}/${slug}/${serviceSlug}`);

  if (matrix) {
    return <MatrixPage page={matrix} />;
  }

  const location = getLocationBySlug(slug);
  const service = getServiceBySlug(serviceSlug);

  if (!location || location.type !== "locality" || location.citySlug !== locationSlug || !service?.active) {
    notFound();
  }

  const content = getServiceLocalityContent(service.slug, location.citySlug, location.slug);

  if (!content) {
    notFound();
  }

  return <CombinationPage service={service} location={location} content={content} />;
}
