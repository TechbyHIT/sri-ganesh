import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoScreen } from "@/components/SeoPage";
import { villagePath } from "@/data/geo";
import { metadataFor } from "@/seo/metadata";

type Params = { state: string; district: string; mandal: string; village: string };

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state, district, mandal, village } = await params;
  return state === "andhra-pradesh" ? metadataFor(villagePath(district, mandal, village)) : {};
}

export default async function VillagePage({ params }: { params: Promise<Params> }) {
  const { state, district, mandal, village } = await params;
  if (state !== "andhra-pradesh") notFound();
  return <SeoScreen path={villagePath(district, mandal, village)} />;
}
