import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { getProblem, problems } from "@/data/problems";
import { servicePath } from "@/lib/paths";
import { generatePathMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return problems.map((problem) => ({ problemSlug: problem.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ problemSlug: string }>;
}): Promise<Metadata> {
  const { problemSlug } = await params;
  const problem = getProblem(problemSlug);

  if (!problem) {
    return {};
  }

  return generatePathMetadata({
    title: problem.title,
    description: problem.description,
    path: `/solutions/${problem.slug}`,
    indexable: problem.indexable,
  });
}

export default async function ProblemPage({ params }: { params: Promise<{ problemSlug: string }> }) {
  const { problemSlug } = await params;
  const problem = getProblem(problemSlug);

  if (!problem) {
    notFound();
  }

  return (
    <StaticArticle
      page={{
        path: `/solutions/${problem.slug}`,
        title: problem.title,
        description: problem.description,
        eyebrow: "Solution",
        h1: problem.h1,
        indexable: problem.indexable,
        priority: 0.6,
        sections: problem.sections,
      }}
    >
      <p>
        <Link className="font-bold text-teal no-underline" href={servicePath(problem.serviceSlug)}>
          View the related service
        </Link>
      </p>
    </StaticArticle>
  );
}
