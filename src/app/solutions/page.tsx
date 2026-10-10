import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { problems } from "@/data/problems";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";

export function generateMetadata(): Metadata {
  return staticMetadata("/solutions");
}

export default function SolutionsPage() {
  const page = getStaticPage("/solutions");

  if (!page) {
    notFound();
  }

  return (
    <StaticArticle page={page}>
      <ul className="grid list-none gap-3 p-0">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 font-bold text-teal no-underline" href={`/solutions/${problem.slug}`}>
              {problem.h1}
            </Link>
          </li>
        ))}
      </ul>
    </StaticArticle>
  );
}
