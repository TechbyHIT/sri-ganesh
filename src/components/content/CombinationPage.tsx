import Image from "next/image";
import Link from "next/link";
import { ContactActions } from "@/components/seo/ContactActions";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import { Faq } from "@/components/Faq/Faq";
import { BreadcrumbNav } from "@/components/seo/BreadcrumbNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { PRICING_STATEMENT } from "@/config/seo";
import type { Location } from "@/data/locations";
import type { Service } from "@/data/services";
import { serviceLocationBreadcrumbs } from "@/lib/breadcrumbs";
import type { PageContent } from "@/lib/content";
import { getServiceLocationLinks } from "@/lib/internal-links";
import { locationCityPath, servicePath } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, serviceLocationSchema } from "@/lib/schema";
import { getServiceLocation } from "@/lib/locations";

export function CombinationPage({
  service,
  location,
  content,
}: {
  service: Service;
  location: Location;
  content: PageContent;
}) {
  const relation = getServiceLocation(service.slug, location.slug);
  const breadcrumbs = serviceLocationBreadcrumbs(service, location);
  const links = getServiceLocationLinks(service.slug, location.slug);
  const faqs = content.faqs.map((faq, index) => ({
    id: `${content.id}-faq-${index + 1}`,
    question: faq.question,
    answer: faq.answer,
  }));
  const place = location.type === "locality" ? `${location.name}, ${location.city}` : location.name;

  return (
    <article className="py-6 pb-16">
      <JsonLd
        data={[
          breadcrumbSchema(breadcrumbs),
          relation ? serviceLocationSchema(service, location, relation) : undefined,
          faqSchema(faqs),
        ]}
      />
      <div className="container">
        <BreadcrumbNav items={breadcrumbs} />
        <header className="grid items-center gap-6 min-[64rem]:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">{place}</p>
            <h1>{content.h1}</h1>
            <p className="mt-3 max-w-xl text-lg text-muted">{content.introduction}</p>
            <ContactActions />
          </div>
          <Image
            className="h-auto w-full rounded-2xl"
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            width={service.heroImage.width}
            height={service.heroImage.height}
            preload
            fetchPriority="high"
            sizes="(max-width: 960px) 100vw, 40rem"
          />
        </header>

        <QuickAnswer title={`What is installed in ${place}?`} text={content.introduction} />

        <section className="mt-10 max-w-3xl">
          <h2>What is installed in {place}</h2>
          <p className="mt-3">{content.overview}</p>
          <p className="mt-3">{content.localInformation}</p>
          <p className="mt-3">{location.description}</p>
        </section>

        <section className="mt-10">
          <h2>Where it is used</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
            {content.applications.map((item) => (
              <li key={item} className="rounded-2xl border border-line bg-paper p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2>Benefits</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
            {content.benefits.map((item) => (
              <li key={item} className="rounded-2xl border border-line bg-paper p-4">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2>Installation</h2>
          <ol className="mt-4 grid list-none gap-3 p-0">
            {content.installation.map((step, index) => (
              <li key={step.title} className="rounded-2xl bg-teal-soft p-4">
                <h3>
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2>Price factors</h2>
          <p className="mt-3">{PRICING_STATEMENT}</p>
        </section>

        <section className="mt-10">
          <h2>Related pages</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
            <li>
              <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 font-bold text-teal no-underline" href={servicePath(service.slug)}>
                {service.name}
              </Link>
            </li>
            <li>
              <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 font-bold text-teal no-underline" href={location.type === "locality" ? locationCityPath(location.citySlug) : locationCityPath(location.slug)}>
                Home safety in {location.type === "locality" ? location.city : location.name}
              </Link>
            </li>
            {links.slice(0, 6).map((link) => (
              <li key={link.href}>
                <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 font-bold text-teal no-underline" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Faq items={faqs} title={`Questions about ${service.name} in ${place}`} intro="These answers are written for this service and this place." embedded />
      </div>
    </article>
  );
}
