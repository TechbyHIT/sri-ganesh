import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StaticArticle } from "@/components/content/StaticArticle";
import { getStaticPage, staticMetadata } from "@/lib/content/static-pages";

const path = "/materials-guide";

export function generateMetadata(): Metadata {
  return staticMetadata(path);
}

export default function Page() {
  const page = getStaticPage(path);
  if (!page) notFound();
  return <StaticArticle page={page} />;
}
