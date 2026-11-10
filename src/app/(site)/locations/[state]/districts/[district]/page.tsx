import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoScreen } from "@/components/SeoPage";
import { districtPath, geoDistricts } from "@/data/geo";
import { metadataFor } from "@/seo/metadata";

type Params = { state: string; district: string };

export function generateStaticParams() {
  return geoDistricts.map((district) => ({ state: "andhra-pradesh", district: district.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state, district } = await params;
  return state === "andhra-pradesh" ? metadataFor(districtPath(district)) : {};
}

export default async function DistrictPage({ params }: { params: Promise<Params> }) {
  const { state, district } = await params;
  if (state !== "andhra-pradesh") notFound();
  return <SeoScreen path={districtPath(district)} />;
}
