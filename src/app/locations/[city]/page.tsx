import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationView } from "@/components/LocationView/LocationView";
import { getActiveCities, getCityBySlug } from "@/lib/locations";
import { generateLocationMetadata, getNotFoundMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getActiveCities().map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city?.active) {
    return getNotFoundMetadata();
  }

  return generateLocationMetadata(city.slug);
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);

  if (!city?.active) {
    notFound();
  }

  return <LocationView location={city} />;
}
