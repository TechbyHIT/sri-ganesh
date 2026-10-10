import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { propertyTypes } from "@/data/property-types";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";

export function generateMetadata(): Metadata {
  return staticMetadata("/property-types");
}

export default function PropertyTypesPage() {
  const page = getStaticPage("/property-types");

  if (!page) {
    notFound();
  }

  return (
    <StaticArticle page={page}>
      <ul className="grid list-none gap-3 p-0">
        {propertyTypes.map((item) => (
          <li key={item.slug} className="rounded-2xl border border-line bg-paper p-4">
            <h2 className="text-xl">{item.name}</h2>
            <p className="mt-2">{item.description}</p>
          </li>
        ))}
      </ul>
    </StaticArticle>
  );
}
