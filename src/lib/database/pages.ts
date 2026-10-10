import { getPrisma } from "@/lib/prisma";
import { sliceCursorPage } from "@/lib/database/pagination";

const pageSelect = {
  id: true,
  path: true,
  slug: true,
  pageType: true,
  title: true,
  metaDescription: true,
  h1: true,
  canonicalUrl: true,
  publicationStatus: true,
  allowIndexing: true,
  contentReviewed: true,
  localDataVerified: true,
  qualityScore: true,
  similarityScore: true,
  wordCount: true,
  minimumWordCount: true,
  hasUniqueMetadata: true,
  hasUniqueContent: true,
  hasValidCanonical: true,
  hasInternalLinks: true,
  hasValidSchema: true,
} as const;

export async function getPageByPath(path: string) {
  const prisma = getPrisma();

  if (!prisma) {
    return null;
  }

  return prisma.page.findUnique({
    where: { path },
    select: {
      ...pageSelect,
      content: { select: { body: true } },
    },
  });
}

export async function countPagesByStatus() {
  const prisma = getPrisma();

  if (!prisma) {
    return null;
  }

  const grouped = await prisma.page.groupBy({
    by: ["publicationStatus"],
    _count: { _all: true },
  });

  const counts: Record<string, number> = {};

  for (const row of grouped) {
    counts[row.publicationStatus] = row._count._all;
  }

  const indexable = await prisma.page.count({
    where: {
      publicationStatus: "published",
      allowIndexing: true,
      qualityScore: { gte: 80 },
      contentReviewed: true,
      localDataVerified: true,
      hasUniqueMetadata: true,
      hasUniqueContent: true,
      hasValidCanonical: true,
      hasInternalLinks: true,
      hasValidSchema: true,
      similarityScore: { lte: 0.7 },
    },
  });

  return { counts, indexable };
}

export async function listPages(cursor: string | undefined, take: number) {
  const prisma = getPrisma();

  if (!prisma) {
    return { items: [], nextCursor: null as string | null, database: false };
  }

  const size = Math.min(Math.max(take, 1), 50);
  const rows = await prisma.page.findMany({
    take: size + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: "asc" },
    select: pageSelect,
  });

  return { ...sliceCursorPage(rows, size), database: true };
}
