import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/database/pages";
import { generatePageMetadata, type MetadataPage } from "@/lib/seo/generate-page-metadata";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertyTypeSlug: string; serviceSlug: string }>;
}): Promise<Metadata> {
  const { propertyTypeSlug, serviceSlug } = await params;
  const record = await getPageByPath(`/property-types/${propertyTypeSlug}/${serviceSlug}`);
  return generatePageMetadata(record ? toMetadataPage(record) : null);
}

export default function PropertyServicePage({
  params,
}: {
  params: Promise<{ propertyTypeSlug: string; serviceSlug: string }>;
}) {
  return (
    <Suspense fallback={<p className="container py-8">Loading</p>}>
      <PropertyService params={params} />
    </Suspense>
  );
}

async function PropertyService({
  params,
}: {
  params: Promise<{ propertyTypeSlug: string; serviceSlug: string }>;
}) {
  const { propertyTypeSlug, serviceSlug } = await params;
  const record = await getPageByPath(`/property-types/${propertyTypeSlug}/${serviceSlug}`);

  if (!record || record.publicationStatus !== "published" || !isPageIndexable(toMetadataPage(record))) {
    notFound();
  }

  return (
    <article className="container py-8 pb-16">
      <h1>{record.h1}</h1>
      <p className="mt-4 max-w-3xl">{record.content?.body}</p>
    </article>
  );
}

function toMetadataPage(record: NonNullable<Awaited<ReturnType<typeof getPageByPath>>>): MetadataPage {
  return {
    title: record.title,
    metaDescription: record.metaDescription,
    canonicalUrl: record.canonicalUrl,
    publicationStatus: record.publicationStatus,
    allowIndexing: record.allowIndexing,
    qualityScore: record.qualityScore,
    contentReviewed: record.contentReviewed,
    localDataVerified: record.localDataVerified,
    hasUniqueMetadata: record.hasUniqueMetadata,
    hasUniqueContent: record.hasUniqueContent,
    hasValidCanonical: record.hasValidCanonical,
    hasInternalLinks: record.hasInternalLinks,
    hasValidSchema: record.hasValidSchema,
    wordCount: record.wordCount,
    minimumRequiredWordCount: record.minimumWordCount,
    similarityScore: record.similarityScore,
  };
}
