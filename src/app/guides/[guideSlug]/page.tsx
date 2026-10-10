import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { getGuide, guides } from "@/data/guides";
import { generatePathMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ guideSlug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guideSlug: string }>;
}): Promise<Metadata> {
  const { guideSlug } = await params;
  const guide = getGuide(guideSlug);

  if (!guide) {
    return {};
  }

  return generatePathMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}`,
    indexable: guide.indexable,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ guideSlug: string }> }) {
  const { guideSlug } = await params;
  const guide = getGuide(guideSlug);

  if (!guide) {
    notFound();
  }

  return (
    <StaticArticle
      page={{
        path: `/guides/${guide.slug}`,
        title: guide.title,
        description: guide.description,
        eyebrow: "Guide",
        h1: guide.h1,
        indexable: guide.indexable,
        priority: 0.6,
        sections: guide.sections,
      }}
    />
  );
}
