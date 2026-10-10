import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageByPath } from "@/lib/database/pages";
import { isPageIndexable } from "@/lib/seo/is-page-indexable";
import { generatePageMetadata, type MetadataPage } from "@/lib/seo/generate-page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postSlug: string }>;
}): Promise<Metadata> {
  const { postSlug } = await params;
  const record = await getPageByPath(`/blog/${postSlug}`);
  return generatePageMetadata(record ? toMetadataPage(record) : null);
}

export default function BlogPostPage({ params }: { params: Promise<{ postSlug: string }> }) {
  return (
    <Suspense fallback={<p className="container py-8">Loading</p>}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: { params: Promise<{ postSlug: string }> }) {
  const { postSlug } = await params;
  const record = await getPageByPath(`/blog/${postSlug}`);

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
