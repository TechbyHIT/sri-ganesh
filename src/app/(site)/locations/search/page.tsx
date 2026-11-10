import type { Metadata } from "next";
import Link from "next/link";
import { LocationSearchForm } from "@/components/LocationSearchForm";
import { PageHero } from "@/components/ui";
import { heroImage } from "@/data/gallery";
import { searchKinds, searchLocations, type SearchKind } from "@/lib/search";
import { absoluteUrl } from "@/seo/urls";

export const metadata: Metadata = {
  title: "Search Andhra Pradesh service areas",
  description: "Find your district, mandal, town, village or colony and see how invisible grills and safety nets are scheduled there.",
  alternates: { canonical: absoluteUrl("/locations/search") },
  robots: { index: false, follow: true },
};

const perPage = 40;

const kindLabel: Record<SearchKind, string> = {
  service: "Service",
  district: "District",
  division: "Revenue division",
  mandal: "Mandal",
  town: "Town",
  city: "City page",
  locality: "Locality",
  village: "Village",
};

type Search = { q?: string; kind?: string; page?: string };

export default async function LocationSearchPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q = "", kind: rawKind = "all", page: rawPage = "1" } = await searchParams;
  const kind = (searchKinds.some((option) => option.id === rawKind) ? rawKind : "all") as SearchKind | "all";
  const hits = searchLocations(q, kind);
  const pages = Math.max(1, Math.ceil(hits.length / perPage));
  const page = Math.min(pages, Math.max(1, Number.parseInt(rawPage, 10) || 1));
  const shown = hits.slice((page - 1) * perPage, page * perPage);
  const pageHref = (target: number) => `/locations/search?${new URLSearchParams({ q, kind, page: String(target) }).toString()}`;
  return (
    <>
      <PageHero
        eyebrow="Service-area search"
        title="Find your place in Andhra Pradesh"
        text="Search all 28 districts, their revenue divisions and mandals, towns with a municipality, our city and neighbourhood pages, and any villages or colonies on record."
        image={heroImage("location-search", "balcony-safety-nets")}
        crumbs={[{ href: "/", label: "Home" }, { href: "/locations", label: "Locations" }, { label: "Search" }]}
      />
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6">
        <LocationSearchForm query={q} kind={kind} />
        {q.trim().length >= 2 ? (
          <p className="text-sm text-brand-800/70" aria-live="polite">
            {hits.length ? `${hits.length} result${hits.length === 1 ? "" : "s"} for “${q}”` : `Nothing matched “${q}”.`}
            {pages > 1 ? ` Page ${page} of ${pages}.` : ""}
          </p>
        ) : null}
        {shown.length ? (
          <ul className="divide-y divide-brand-100 rounded-3xl border border-brand-100 bg-white">
            {shown.map((hit) => (
              <li key={`${hit.kind}:${hit.href}:${hit.label}`}>
                <Link href={hit.href} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-brand-50">
                  <span>
                    <span className="block font-semibold text-brand-900">{hit.label}</span>
                    <span className="block text-sm text-brand-800/70">{hit.detail}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-cta-600">{kindLabel[hit.kind]}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : q.trim().length >= 2 ? (
          <div className="rounded-3xl border border-brand-100 bg-white p-6 text-sm leading-7 text-brand-800/80">
            Your village may not be in our records yet, but every district of Andhra Pradesh is in scope. Open the{" "}
            <Link className="font-semibold text-brand-900 underline" href="/locations/andhra-pradesh/districts">
              district directory
            </Link>{" "}
            or{" "}
            <Link className="font-semibold text-brand-900 underline" href={`/contact?need=${encodeURIComponent(q)}`}>
              send us the place name
            </Link>
            .
          </div>
        ) : null}
        {pages > 1 ? (
          <nav aria-label="Search result pages" className="flex items-center justify-between text-sm font-semibold">
            {page > 1 ? <Link href={pageHref(page - 1)} className="text-brand-900">← Previous</Link> : <span />}
            {page < pages ? <Link href={pageHref(page + 1)} className="text-brand-900">Next →</Link> : <span />}
          </nav>
        ) : null}
      </div>
    </>
  );
}
