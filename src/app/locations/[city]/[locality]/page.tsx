import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/LocationView/LocationView";
import { getActiveLocalities, getLocationBySlug } from "@/lib/locations";
import { generateLocationMetadata, getNotFoundMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getActiveLocalities().map((locality) => ({
    city: locality.citySlug,
    locality: locality.slug,
  }));
}

function resolveLocality(citySlug: string, localitySlug: string) {
  const locality = getLocationBySlug(localitySlug);

  if (
    !locality ||
    locality.type !== "locality" ||
    !locality.active ||
    locality.citySlug !== citySlug
  ) {
    return undefined;
  }

  return locality;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}): Promise<Metadata> {
  const { city, locality: localitySlug } = await params;
  const locality = resolveLocality(city, localitySlug);

  if (!locality) {
    return getNotFoundMetadata();
  }

  return generateLocationMetadata(locality.slug);
}

export default async function LocalityPage({
  params,
}: {
  params: Promise<{ city: string; locality: string }>;
}) {
  const { city, locality: localitySlug } = await params;
  const locality = resolveLocality(city, localitySlug);

  if (!locality) {
    notFound();
  }

  return <LocationView location={locality} />;
}
