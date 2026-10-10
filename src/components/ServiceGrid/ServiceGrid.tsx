import Link from "next/link";
import { featuredServiceSlugs, serviceGrid } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { getServices } from "@/lib/content";
import { servicePath } from "@/lib/paths";

export function ServiceGrid() {
  const items = getServices();
  const featuredSet = new Set<string>(featuredServiceSlugs);
  const featured = featuredServiceSlugs
    .map((slug) => items.find((service) => service.slug === slug))
    .filter((service) => service !== undefined);
  const more = items.filter((service) => !featuredSet.has(service.slug));

  return (
    <>
      <section className="pb-12" aria-labelledby="services-title" id="installation-services">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={serviceGrid.eyebrow}
              title={serviceGrid.title}
              intro={serviceGrid.intro}
              titleId="services-title"
            />
            <Link className="inline-flex min-h-11 items-center font-extrabold text-teal no-underline" href="/services">
              All installation services
            </Link>
          </div>
          <ol className="mt-6 grid list-none gap-4 p-0 min-[48rem]:grid-cols-3">
            {featured.map((service, index) => (
              <li key={service.slug}>
                <Link className="flex h-full flex-col gap-3 rounded-2xl border border-line bg-paper p-5 no-underline" href={servicePath(service.slug)}>
                  <span className="text-[0.82rem] font-extrabold tracking-wide text-saffron-deep">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-extrabold tracking-tight">{service.name}</h3>
                  <p className="text-muted">{service.shortDescription}</p>
                  <span className="mt-auto font-extrabold text-teal">Explore {service.name}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="pb-14" aria-labelledby="more-services-title">
        <div className="container">
          <SectionHeading
            eyebrow={serviceGrid.moreEyebrow}
            title={serviceGrid.moreTitle}
            intro={serviceGrid.moreIntro}
            titleId="more-services-title"
          />
          <ul className="mt-6 grid list-none gap-3 p-0 min-[40rem]:grid-cols-2 min-[64rem]:grid-cols-3">
            {more.map((service) => (
              <li key={service.slug}>
                <Link className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-paper p-4 no-underline" href={servicePath(service.slug)}>
                  <h3 className="text-lg font-extrabold tracking-tight">{service.name}</h3>
                  <p className="text-sm text-muted">{service.shortDescription}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
