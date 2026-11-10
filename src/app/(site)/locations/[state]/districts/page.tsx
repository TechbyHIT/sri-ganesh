import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocationSearchForm } from "@/components/LocationSearchForm";
import { PageHero } from "@/components/ui";
import { regions } from "@/data/cities";
import { allServices } from "@/data/all-services";
import { heroImage } from "@/data/gallery";
import { citiesInDistrict, districtPath, geo, geoDistricts, geoTotals, hubCityOf, mandalPath, mandalsOf } from "@/data/geo";
import { cityPath, servicePath } from "@/seo/urls";
import { absoluteUrl } from "@/seo/urls";

export function generateStaticParams() {
  return [{ state: "andhra-pradesh" }];
}

export const dynamicParams = true;

export const metadata: Metadata = {
  title: "Andhra Pradesh Service Areas: All 28 Districts and Mandals",
  description: `Invisible grills and safety nets across all ${geoTotals.districts} districts, ${geoTotals.divisions} revenue divisions and ${geoTotals.mandals} mandals of Andhra Pradesh, with the hub each visit is booked from.`,
  alternates: { canonical: absoluteUrl("/locations/andhra-pradesh/districts") },
};

export default async function DistrictDirectory({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (state !== "andhra-pradesh") notFound();
  const services = allServices();
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Locations", item: absoluteUrl("/locations") },
      { "@type": "ListItem", position: 3, name: "Andhra Pradesh", item: absoluteUrl("/locations/andhra-pradesh") },
      { "@type": "ListItem", position: 4, name: "Districts", item: absoluteUrl("/locations/andhra-pradesh/districts") },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <PageHero
        eyebrow="Service-area directory"
        title="Every district and mandal in Andhra Pradesh"
        highlight={`${geoTotals.districts} districts · ${geoTotals.divisions} revenue divisions · ${geoTotals.mandals} mandals`}
        text="Pick your district, then your revenue division and mandal. Each district names the hub we book visits from, and links to the town pages where we have written a local specification."
        image={heroImage("district-directory", "invisible-grills")}
        crumbs={[{ href: "/", label: "Home" }, { href: "/locations", label: "Locations" }, { href: "/locations/andhra-pradesh", label: "Andhra Pradesh" }, { label: "Districts" }]}
      />
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
        <section className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-bold text-brand-900">Search by district, mandal, town, village, colony or service</h2>
          <div className="mt-4">
            <LocationSearchForm />
          </div>
        </section>
        {regions.map((region) => (
          <section key={region} aria-labelledby={`region-${region}`}>
            <h2 id={`region-${region}`} className="font-display text-3xl font-bold text-brand-900">{region}</h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {geoDistricts.filter((district) => district.region === region).map((district) => {
                const hub = hubCityOf(district);
                const towns = citiesInDistrict(district);
                return (
                  <article key={district.slug} id={district.slug} className="rounded-[1.75rem] border border-brand-100 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl font-bold text-brand-900">
                        <Link href={districtPath(district.slug)} className="hover:text-brand-700">{district.name}</Link>
                      </h3>
                      <span className="text-xs font-semibold uppercase tracking-wide text-cta-600">HQ {district.headquarters}</span>
                    </div>
                    <p className="mt-1 text-sm text-brand-800/70">
                      {district.divisions.length} revenue divisions · {district.mandals.length} mandals
                      {hub ? <> · visits from <Link className="font-semibold text-brand-900" href={cityPath(hub.slug)}>{hub.name}</Link></> : null}
                    </p>
                    <div className="mt-4 space-y-2">
                      {district.divisions.map((division) => (
                        <details key={division.slug} id={`${district.slug}-division-${division.slug}`} className="group rounded-2xl bg-brand-50 px-4 py-3">
                          <summary className="cursor-pointer list-none text-sm font-semibold text-brand-900 [&::-webkit-details-marker]:hidden">
                            {division.name} division <span className="font-normal text-brand-800/60">({division.mandals.length} mandals)</span>
                          </summary>
                          <ul className="mt-3 flex flex-wrap gap-2">
                            {mandalsOf(district, division).map((mandal) => (
                              <li key={mandal.slug}>
                                <Link href={mandalPath(district.slug, mandal.slug)} className="inline-block rounded-full bg-white px-3 py-1.5 text-sm text-brand-800 ring-1 ring-brand-100 hover:ring-cta-500">
                                  {mandal.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      ))}
                    </div>
                    {towns.length ? (
                      <p className="mt-4 text-sm leading-7 text-brand-800/80">
                        <span className="font-semibold text-brand-900">Town pages: </span>
                        {towns.map((town, index) => (
                          <span key={town.slug}>
                            {index ? ", " : ""}
                            <Link href={cityPath(town.slug)} className="underline decoration-brand-100 underline-offset-4 hover:decoration-cta-500">{town.name}</Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
        <section aria-labelledby="by-service">
          <h2 id="by-service" className="font-display text-3xl font-bold text-brand-900">Browse by service</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-brand-800/75">Each service page lists every town where that service has its own page.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={servicePath(service.slug)} className="inline-block rounded-full border border-brand-100 bg-white px-3 py-2 text-sm font-medium text-brand-800 hover:border-cta-500">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="text-xs leading-6 text-brand-800/60">
          Administrative structure: {geo.reorganisation} Each district page links the official sources it was checked against.
        </p>
      </div>
    </>
  );
}
