import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/ServiceDetail/ServiceDetail";
import { getAllServices, getServiceBySlug } from "@/lib/services";
import { generateServiceMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getAllServices().map((service) => ({ service: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  return generateServiceMetadata(slug);
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service?.active) {
    notFound();
  }

  return <ServiceDetail service={service} />;
}
