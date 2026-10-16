import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstallationGallery } from "@/components/InstallationGallery";
import { SiteModules } from "@/components/SiteModules";
import { QuotePanel } from "@/components/QuotePanel";
import { CheckList, CtaBand, FactBar, FaqStatic, LinkCloud, PageHero, Panel } from "@/components/ui";
import { getCity } from "@/data/cities";
import { galleryCards, viewSrc } from "@/data/gallery";
import { getService } from "@/data/services";
import { coverage } from "@/data/stats";
import { pageAt } from "@/seo/catalog";
import type { PageDocument } from "@/seo/types";
import { areaPath, servicePath } from "@/seo/urls";

export function SeoScreen({ path }: { path: string }) {
  const page = pageAt(path);
  if (!page || page.status === "exclude") notFound();
  return <SeoPage page={page} />;
}

export function SeoPage({ page }: { page: PageDocument }) {
  const service = page.params.service ? getService(page.params.service) : undefined;
  const city = page.params.city ? getCity(page.params.city) : undefined;
  const strip = galleryCards(`${page.path}:strip`, 3, page.params.service);
  const facts = [
    service ? { label: "System", value: service.name } : { label: "Coverage", value: "Andhra Pradesh" },
    city ? { label: "District", value: city.district } : { label: "Districts", value: String(coverage.districts) },
    city ? { label: "Region", value: city.region } : { label: "Cities", value: String(coverage.cities) },
    { label: "Photographs", value: String(coverage.photos) },
  ];
  return (
    <>
      {page.jsonLd.map((block) => (
        <script key={String(block["@type"])} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }} />
      ))}
      <PageHero eyebrow={page.eyebrow} title={page.h1} text={page.hero} image={viewSrc(page.image)} crumbs={page.breadcrumb.map((item) => ({ href: item.href, label: item.label }))} />
      <FactBar items={facts} />
      <div className="bg-brand-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            {page.status === "review" ? (
              <p className="rounded-3xl border border-cta-500/40 bg-cta-500/10 px-4 py-3 text-sm leading-6 text-brand-900">
                Held for review. This URL is not in the sitemap and asks search engines not to index it until the local detail is strong enough.
              </p>
            ) : null}
            <Panel eyebrow="On this page" title={service ? `${service.name} in plain terms` : "What this page is for"}>
              <figure className="overflow-hidden rounded-3xl">
                <div className="relative h-64 sm:h-80">
                  <Image src={viewSrc(page.image)} alt={page.imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 60vw, 100vw" priority />
                </div>
                <figcaption className="bg-brand-50 px-4 py-3 text-sm text-brand-800/70">{page.imageAlt}</figcaption>
              </figure>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {strip.map((photo) => (
                  <figure key={photo.id} className="overflow-hidden rounded-2xl">
                    <div className="relative h-24 sm:h-32">
                      <Image src={photo.thumb} alt={photo.alt} fill className="object-cover" sizes="20vw" />
                    </div>
                  </figure>
                ))}
              </div>
              <div className="mt-5 space-y-4 text-base leading-8 text-brand-800/85">
                <p>
                  Sri Ganesha publishes {coverage.services} systems across {coverage.cities} Andhra cities, {coverage.areas} neighbourhoods and all {coverage.districts} districts. {coverage.photos} installation photographs sit with those pages so the opening — cable, mesh, duct, hanger or sports net — is visible before a visit is booked.
                </p>
                {city ? (
                  <p>
                    {city.name} is in {city.district} district, {city.region}. Housing here is {city.housing}. {city.climate} {city.visitNote}
                  </p>
                ) : (
                  <p>
                    A city page carries the climate and the visit rota. A neighbourhood page adds the street. A service page names the system. The written grade still follows a measurement of the opening you have.
                  </p>
                )}
                {service ? <p>{service.lede}</p> : null}
              </div>
            </Panel>
            {page.modules.map((module, index) => {
              if (module.type === "prose") {
                return (
                  <Panel key={`${module.title ?? "prose"}-${index}`} title={module.title}>
                    <div className="space-y-4 text-base leading-8 text-brand-800/85">
                      {module.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                      ))}
                    </div>
                  </Panel>
                );
              }
              if (module.type === "list") {
                return (
                  <Panel key={`${module.title}-${index}`} title={module.title}>
                    <CheckList items={module.items} />
                  </Panel>
                );
              }
              if (module.type === "steps") {
                return (
                  <Panel key={`${module.title}-${index}`} title={module.title}>
                    <ol className="grid gap-3">
                      {module.steps.map((step, stepIndex) => (
                        <li key={step.title} className="rounded-3xl bg-brand-50 p-4">
                          <p className="text-xs font-bold text-cta-600">0{stepIndex + 1}</p>
                          <h3 className="font-semibold text-brand-900">{step.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-brand-800/75">{step.text}</p>
                        </li>
                      ))}
                    </ol>
                  </Panel>
                );
              }
              if (module.type === "note") {
                return (
                  <section key={`${module.title}-${index}`} className="rounded-[1.75rem] bg-brand-900 p-6 text-white">
                    <h2 className="font-display text-xl font-bold">{module.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-white/75">{module.text}</p>
                  </section>
                );
              }
              if (module.type === "faqs") {
                return (
                  <Panel key={`${module.title}-${index}`} title={module.title}>
                    <FaqStatic items={module.items} />
                  </Panel>
                );
              }
              return <LinkCloud key={`${module.title}-${index}`} title={module.title} links={module.links.flatMap((link) => (link.href ? [{ href: link.href, label: link.label }] : []))} />;
            })}
            {service ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Panel eyebrow="Openings" title="Where this system is considered">
                  <CheckList items={service.where} />
                </Panel>
                <Panel eyebrow="Estimate" title="What moves the written figure">
                  <CheckList items={service.priceFactors} />
                </Panel>
              </div>
            ) : null}
            {service ? (
              <Panel eyebrow="Specification" title="Materials we are willing to name">
                <CheckList items={service.materials} />
                <p className="mt-4 text-sm leading-7 text-brand-800/75">
                  Problems this system is meant to answer: {service.problems.join(" ")} The visit confirms whether this is the right system for the opening, or whether a neighbouring service fits better.
                </p>
              </Panel>
            ) : null}
            {city ? (
              <Panel eyebrow={city.region} title={`How ${city.name} changes the specification`}>
                <p className="text-base leading-8 text-brand-800/85">{city.materialHint}</p>
                <p className="mt-3 text-sm leading-7 text-brand-800/75">{city.intro}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {city.areas.slice(0, 8).map((area) => (
                    <Link key={area.slug} href={areaPath(city.slug, area.slug)} className="rounded-full bg-brand-50 px-3 py-2 text-sm font-medium text-brand-900 ring-1 ring-brand-100 hover:ring-cta-500">
                      {area.name}
                    </Link>
                  ))}
                </div>
              </Panel>
            ) : null}
            <Panel eyebrow="Visit" title="Measurement first, then a written quote">
              <ol className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Photograph the opening", "One full frame, plus closer photos of the top and side surfaces that can take a hook or an anchor."],
                  ["We measure on site", "Width, height, returns, the wall or slab, and who actually uses the space — children, pets, birds, or play."],
                  ["The quote names the work", "System, grade, access, and what is included. A price that skips the opening is not treated as final."],
                ].map(([title, text], index) => (
                  <li key={title} className="rounded-3xl bg-brand-50 p-4">
                    <p className="font-display text-2xl font-extrabold text-cta-500">0{index + 1}</p>
                    <h3 className="mt-2 font-semibold text-brand-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-brand-800/75">{text}</p>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <QuotePanel service={page.quote.service} city={page.quote.city} />
            <div className="rounded-[1.75rem] bg-brand-900 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cta-500">This page</p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white/80">
                {service ? <li>{service.group} · {service.name}</li> : <li>{coverage.services} safety systems</li>}
                {city ? <li>{city.name}, {city.district}</li> : <li>All {coverage.districts} districts</li>}
                <li>{coverage.areas} neighbourhood notes on the map</li>
                {service ? <li><Link className="font-semibold text-cta-500" href={servicePath(service.slug)}>Full {service.name} page</Link></li> : null}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <SiteModules city={city} service={service} place={page.quote.city || city?.name} />
      <InstallationGallery
        photos={galleryCards(page.path, 8, page.params.service)}
        eyebrow="Installations"
        title={`Work like the openings we measure${page.quote.city ? ` in ${page.quote.city}` : ""}`}
        text="Photographs of invisible grills, balcony nets, ducts, hangers and sports nets from the same systems this page describes."
      />
      <CtaBand title="Book a measurement before a price" text="Tell us the town and the opening. We confirm Andhra Pradesh coverage and send a written quote after the visit." />
    </>
  );
}
