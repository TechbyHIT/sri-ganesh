import { generateCanonicalUrl } from "@/lib/seo";
import { indexabilityGaps } from "@/lib/seo/is-page-indexable";
import { wordCount } from "@/lib/seo/similarity";
import { getPrisma } from "@/lib/prisma";
import { buildDraftRecords, type DraftRecord } from "@/lib/publishing/drafts";
import type { PageIndexabilityInput } from "@/types/page";

export async function requireDatabase() {
  const prisma = getPrisma();

  if (!prisma) {
    throw new Error("DATABASE_URL is not set. Connect PostgreSQL before running this command.");
  }

  return prisma;
}

export async function createPageRecords(type: string | undefined, limit: number) {
  const prisma = await requireDatabase();
  const records = buildDraftRecords()
    .filter((record) => !type || record.pageType === type)
    .slice(0, limit);
  let written = 0;

  for (const record of records) {
    await upsertDraft(prisma, record);
    written += 1;
  }

  return { written, considered: records.length };
}

async function upsertDraft(
  prisma: NonNullable<ReturnType<typeof getPrisma>>,
  record: DraftRecord,
) {
  const input = toIndexability(record);
  const gaps = indexabilityGaps(input);
  const canonicalUrl = generateCanonicalUrl(record.path);

  await prisma.page.upsert({
    where: { path: record.path },
    create: {
      path: record.path,
      slug: record.slug,
      pageType: record.pageType,
      title: record.title,
      metaDescription: trim(record.metaDescription, 300),
      h1: record.h1,
      canonicalUrl,
      publicationStatus: "review",
      allowIndexing: false,
      contentReviewed: false,
      localDataVerified: record.localDataVerified,
      qualityScore: record.qualityScore,
      similarityScore: 0,
      wordCount: input.wordCount,
      minimumWordCount: record.minimumWordCount,
      hasUniqueMetadata: input.hasUniqueMetadata,
      hasUniqueContent: input.hasUniqueContent,
      hasValidCanonical: true,
      hasInternalLinks: input.hasInternalLinks,
      hasValidSchema: false,
      sitemapGroup: record.pageType,
      content: { create: { body: record.body, modules: record.pageType } },
    },
    update: {
      title: record.title,
      metaDescription: trim(record.metaDescription, 300),
      h1: record.h1,
      qualityScore: record.qualityScore,
      wordCount: input.wordCount,
      minimumWordCount: record.minimumWordCount,
      localDataVerified: record.localDataVerified,
      content: { upsert: { create: { body: record.body, modules: record.pageType }, update: { body: record.body } } },
    },
  });

  return gaps;
}

export async function auditPages(status: string, limit: number) {
  const prisma = await requireDatabase();
  const rows = await prisma.page.findMany({
    where: { publicationStatus: status },
    take: limit,
    orderBy: { id: "asc" },
    select: {
      path: true,
      publicationStatus: true,
      allowIndexing: true,
      qualityScore: true,
      contentReviewed: true,
      localDataVerified: true,
      hasUniqueMetadata: true,
      hasUniqueContent: true,
      hasValidCanonical: true,
      hasInternalLinks: true,
      hasValidSchema: true,
      wordCount: true,
      minimumWordCount: true,
      similarityScore: true,
    },
  });

  return rows.map((row) => ({
    path: row.path,
    gaps: indexabilityGaps({
      ...row,
      minimumRequiredWordCount: row.minimumWordCount,
    }),
  }));
}

export async function publishBatch(size: number) {
  const prisma = await requireDatabase();
  const candidates = await prisma.page.findMany({
    where: { publicationStatus: "review" },
    take: size,
    orderBy: { qualityScore: "desc" },
  });
  const ready = candidates.filter((page) => indexabilityGaps(toStored(page)).length === 0);

  if (ready.length === 0) {
    return { published: 0, examined: candidates.length };
  }

  await prisma.$transaction(async (tx) => {
    const batch = await tx.publishingBatch.create({
      data: {
        phase: 1,
        size: ready.length,
        status: "published",
        note: `Published ${ready.length} pages that passed the indexability gates.`,
      },
    });

    for (const page of ready) {
      await tx.page.update({
        where: { id: page.id },
        data: {
          publicationStatus: "published",
          allowIndexing: true,
          publishedAt: new Date(),
          batchId: batch.id,
        },
      });
    }
  });

  return { published: ready.length, examined: candidates.length };
}

export async function noindexBelow(score: number) {
  const prisma = await requireDatabase();
  const result = await prisma.page.updateMany({
    where: { qualityScore: { lt: score }, publicationStatus: { not: "archived" } },
    data: { allowIndexing: false, publicationStatus: "noindex" },
  });

  return result.count;
}

export async function countStoredPages() {
  const prisma = await requireDatabase();
  const grouped = await prisma.page.groupBy({
    by: ["publicationStatus"],
    _count: { _all: true },
  });

  return Object.fromEntries(grouped.map((row) => [row.publicationStatus, row._count._all]));
}

function toIndexability(record: DraftRecord): PageIndexabilityInput {
  const count = wordCount(record.body);

  return {
    publicationStatus: "review",
    allowIndexing: false,
    qualityScore: record.qualityScore,
    contentReviewed: false,
    localDataVerified: record.localDataVerified,
    hasUniqueMetadata: record.title.trim().length > 0 && record.metaDescription.trim().length > 0,
    hasUniqueContent: count > 40,
    hasValidCanonical: true,
    hasInternalLinks: record.body.length > 0,
    hasValidSchema: false,
    wordCount: count,
    minimumRequiredWordCount: record.minimumWordCount,
    similarityScore: 0,
  };
}

function toStored(page: {
  publicationStatus: string;
  allowIndexing: boolean;
  qualityScore: number;
  contentReviewed: boolean;
  localDataVerified: boolean;
  hasUniqueMetadata: boolean;
  hasUniqueContent: boolean;
  hasValidCanonical: boolean;
  hasInternalLinks: boolean;
  hasValidSchema: boolean;
  wordCount: number;
  minimumWordCount: number;
  similarityScore: number;
}): PageIndexabilityInput {
  return { ...page, minimumRequiredWordCount: page.minimumWordCount };
}

function trim(value: string, limit: number): string {
  return value.length <= limit ? value : value.slice(0, limit);
}
