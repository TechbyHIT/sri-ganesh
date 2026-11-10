import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoScreen } from "@/components/SeoPage";
import { mandalPath } from "@/data/geo";
import { metadataFor } from "@/seo/metadata";

type Params = { state: string; district: string; mandal: string };

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { state, district, mandal } = await params;
  return state === "andhra-pradesh" ? metadataFor(mandalPath(district, mandal)) : {};
}

export default async function MandalPage({ params }: { params: Promise<Params> }) {
  const { state, district, mandal } = await params;
  if (state !== "andhra-pradesh") notFound();
  return <SeoScreen path={mandalPath(district, mandal)} />;
}
