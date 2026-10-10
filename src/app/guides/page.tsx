import type { Metadata } from "next";
import Link from "next/link";
import { StaticArticle } from "@/components/content/StaticArticle";
import { guides } from "@/data/guides";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";
import { notFound } from "next/navigation";

export function generateMetadata(): Metadata {
  return staticMetadata("/guides");
}

export default function GuidesPage() {
  const page = getStaticPage("/guides");

  if (!page) {
    notFound();
  }

  return (
    <StaticArticle page={page}>
      <ul className="grid list-none gap-3 p-0">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 font-bold text-teal no-underline" href={`/guides/${guide.slug}`}>
              {guide.h1}
            </Link>
          </li>
        ))}
      </ul>
    </StaticArticle>
  );
}
