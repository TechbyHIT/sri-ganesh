import Image from "next/image";
import Link from "next/link";
import { cardImage } from "@/data/gallery";
import { services } from "@/data/services";
import { SectionTitle } from "./ui";

export function ServiceGrid() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Services"
          title="Systems we measure and fit"
          text="Each one is specified after the opening is seen. Sub-pages cover balconies, windows, apartments, pets and the main city-level searches."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.slug} className="flex flex-col overflow-hidden rounded-3xl border border-brand-100 bg-white">
              <div className="relative h-48">
                <Image src={cardImage(`home-service:${service.slug}`, service.slug)} alt={service.name} fill className="object-cover" sizes="(min-width: 1280px) 33vw, 100vw" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-cta-600">{service.group}</p>
                <h2 className="mt-2 font-display text-xl font-bold">
                  <Link href={`/services/${service.slug}`}>{service.name}</Link>
                </h2>
                <p className="mt-2 text-sm leading-6 text-brand-800/75">{service.summary}</p>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-800/80">
                  {service.benefits.slice(0, 3).map((benefit) => (
                    <li key={benefit}>✓ {benefit}</li>
                  ))}
                </ul>
                <Link href={`/services/${service.slug}`} className="mt-4 text-sm font-semibold text-brand-900">
                  Explore {service.name.toLowerCase()} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
