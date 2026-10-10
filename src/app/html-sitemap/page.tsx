import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { getIndexableEntries } from "@/lib/sitemap-data";
import { breadcrumbSchema } from "@/lib/schema";
import { generatePathMetadata } from "@/lib/seo";

const path = "/html-sitemap";

export function generateMetadata(): Metadata {
  return generatePathMetadata({
    title: "HTML sitemap",
    description: "Published Sri Ganesha pages: services, cities, and the service-and-place pairs that are already live.",
    path,
    indexable: true,
  });
}

function labelFor(urlPath: string): string {
  if (urlPath === "/") {
    return "Home";
  }

  return urlPath
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/-/g, " "))
    .join(" · ");
}

function groupFor(urlPath: string): string {
  if (urlPath === "/" || urlPath === "/services" || urlPath === "/locations") {
    return "Main";
  }

  if (urlPath.startsWith("/services/")) {
    return "Services";
  }

  const parts = urlPath.split("/").filter(Boolean);

  if (urlPath.startsWith("/locations/") && parts.length === 2) {
    return "Cities";
  }

  if (urlPath.startsWith("/locations/")) {
    return "Areas";
  }

  if (parts.length >= 2 && !urlPath.startsWith("/guides") && !urlPath.startsWith("/solutions") && !urlPath.startsWith("/property-types")) {
    return "Service and place";
  }

  return "Guides and help";
}

export default function HtmlSitemapPage() {
  const groups = new Map<string, { path: string }[]>();

  for (const entry of getIndexableEntries()) {
    const name = groupFor(entry.path);
    groups.set(name, [...(groups.get(name) ?? []), entry]);
  }

  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: path, label: "Sitemap" },
  ];

  return (
    <article className="container py-8 pb-16">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <BreadcrumbNav items={breadcrumbs} />
      <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Find a page</p>
      <h1>Published pages</h1>
      <p className="mt-3 max-w-3xl text-muted">
        These are the indexable pages. A town can be stored in the location records without a link here. A service is paired with a city only when that page has its own reviewed copy.
      </p>
      <div className="mt-8 grid gap-8">
        {[...groups.entries()].map(([name, entries]) => (
          <section key={name} aria-labelledby={`sitemap-${name}`}>
            <h2 id={`sitemap-${name}`}>{name}</h2>
            <ul className="mt-3 grid list-none gap-2 p-0 sm:grid-cols-2">
              {entries.map((entry) => (
                <li key={entry.path}>
                  <Link className="inline-flex min-h-11 items-center font-bold text-teal no-underline capitalize" href={entry.path}>
                    {labelFor(entry.path)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </article>
  );
}
