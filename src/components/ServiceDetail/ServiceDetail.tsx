import Image from "next/image";
import Link from "next/link";
import { ContactActions } from "@/components/seo/ContactActions";
import { PriceFactors } from "@/components/seo/PriceFactors";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import { whyChooseUs } from "@/data/homepage";
import { site } from "@/data/site";
import { Faq } from "@/components/Faq/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Service } from "@/data/services";
import { getBreadcrumbLinks, getServicePageLinks } from "@/lib/internal-links";
import { getServiceFAQs } from "@/lib/services";
import { getCatalogEntriesForPath, getCatalogLinksForService } from "@/lib/service-catalog";
import { servicePath } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";

export function ServiceDetail({ service }: { service: Service }) {
  const faqs = getServiceFAQs(service.slug);
  const breadcrumbs = getBreadcrumbLinks({ kind: "service", serviceSlug: service.slug });
  const linkGroups = getServicePageLinks(service.slug);
  const areaLink = linkGroups.find((group) => group.id === "service-areas")?.links[0];
  const faq = faqSchema(faqs);
  const phone = site.phoneDisplay && site.phoneTel;
  const coveredRequests = getCatalogEntriesForPath(servicePath(service.slug)).filter((item) => item.name !== service.name);
  const relatedRequests = getCatalogLinksForService(service.slug);

  return (
    <article className="py-5 pb-12">
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faq, serviceSchema(service)]} />
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className="mb-5 flex list-none flex-wrap gap-2 p-0 text-sm text-muted [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline">
            {breadcrumbs.map((crumb, index) => {
              const last = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.href}>
                  {last ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  )}
                  {last ? null : <span aria-hidden="true"> / </span>}
                </li>
              );
            })}
          </ol>
        </nav>

        <header className="grid items-center gap-6 min-[64rem]:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">{site.region}</p>
            <h1>{service.name}</h1>
            <p className="mt-3 max-w-xl text-lg text-muted">{service.shortDescription}</p>
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

        <nav className="mt-8" aria-label="On this page">
          <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">On this page</p>
          <ul className="mt-2 flex list-none flex-wrap gap-2 p-0">
            {[
              ["intro-title", "Overview"],
              ["benefits-title", "Benefits"],
              ["features-title", "Materials"],
              ["applications-title", "Where it fits"],
              ["process-title", "Installation"],
              ["page-faq-title", "FAQs"],
            ].map(([id, label]) => (
              <li key={id}>
                <a className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 font-bold no-underline" href={`#${id}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <QuickAnswer title={`What is ${service.name.toLowerCase()}?`} text={service.shortDescription} />

        <section className="mt-10" aria-labelledby="intro-title">
          <h2 id="intro-title">What this work is</h2>
          <p>{service.description}</p>
          {areaLink ? (
            <p>
              <Link href={areaLink.href}>{areaLink.label}</Link>
            </p>
          ) : null}
        </section>

        {service.slug === "invisible-grills" || service.slug === "balcony-safety-nets" ? (
          <section className="mt-10" aria-labelledby="compare-title">
            <h2 id="compare-title">Safety net or invisible grill</h2>
            <p className="mt-3 max-w-3xl">The opening decides. A mesh closes the gap. Wires leave more of the view. Neither one is a bird spike, and neither one is a sports net.</p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <caption className="sr-only">Difference between a balcony safety net and an invisible grill</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th className="py-3 pr-4" scope="col">Question</th>
                    <th className="py-3 pr-4" scope="col">Balcony safety net</th>
                    <th className="py-3" scope="col">Invisible grill</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <th className="py-3 pr-4" scope="row">What you see</th>
                    <td className="py-3 pr-4 text-muted">A taut mesh</td>
                    <td className="py-3 text-muted">Slim spaced wires</td>
                  </tr>
                  <tr className="border-b border-line">
                    <th className="py-3 pr-4" scope="row">Usual reason</th>
                    <td className="py-3 pr-4 text-muted">Close the gap for children, pets, or stored items</td>
                    <td className="py-3 text-muted">Keep the balcony visually open</td>
                  </tr>
                  <tr>
                    <th className="py-3 pr-4" scope="row">Read next</th>
                    <td className="py-3 pr-4">
                      <Link className="font-bold text-teal no-underline" href="/guides/balcony-safety-net-or-grill">Net or grill guide</Link>
                    </td>
                    <td className="py-3">
                      <Link className="font-bold text-teal no-underline" href="/services/invisible-grills">Invisible grills</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <PriceFactors />

        <section className="mt-10" aria-labelledby="benefits-title">
          <h2 id="benefits-title">Benefits of {service.name}</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
            {service.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="features-title">
          <h2 id="features-title">Features of {service.name}</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
            {service.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="applications-title">
          <h2 id="applications-title">Where it is used</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
            {service.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </section>

        {coveredRequests.length > 0 || relatedRequests.length > 0 ? (
          <section className="mt-10" aria-labelledby="requests-title">
            <h2 id="requests-title">Requests this page answers</h2>
            {coveredRequests.length > 0 ? (
              <>
                <p>People ask for this work under different names. These all mean the fitting described on this page:</p>
                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                  {coveredRequests.map((item) => (
                    <li key={item.id} className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm">
                      {item.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {relatedRequests.length > 0 ? (
              <>
                <p className="mt-4">Nearby requests that have their own page:</p>
                <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
                  {relatedRequests.map((item) => (
                    <li key={item.href}>
                      <Link className="inline-flex rounded-full border border-[#d4b483] bg-teal-soft px-3 py-1.5 text-sm font-semibold text-teal no-underline" href={item.href}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </section>
        ) : null}

        {service.galleryImages.length > 0 ? (
          <section className="mt-10" aria-labelledby="gallery-title">
            <h2 id="gallery-title">How the fitting is arranged</h2>
            <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
              {service.galleryImages.map((image) => (
                <li key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    fetchPriority="low"
                    sizes="(max-width: 720px) 100vw, 32rem"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="process-title">
          <h2 id="process-title">How {service.name} is installed</h2>
          <ol className="mt-4 grid list-none gap-3 p-0 min-[64rem]:grid-cols-2 [&_li]:grid [&_li]:grid-cols-[auto_1fr] [&_li]:gap-3 [&_li]:rounded-2xl [&_li]:bg-teal-soft [&_li]:p-4 [&_span]:grid [&_span]:h-10 [&_span]:w-10 [&_span]:place-items-center [&_span]:rounded-full [&_span]:bg-navy [&_span]:font-extrabold [&_span]:text-white">
            {service.installationProcess.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10" aria-labelledby="why-title">
          <h2 id="why-title">Why choose {site.name}</h2>
          <p>
            {service.name} is quoted from the opening we measure. {whyChooseUs.intro}
          </p>
          <ul className="mt-4 grid list-none gap-3 p-0 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
            {whyChooseUs.points.map((point) => (
              <li key={point.title}>
                <strong>{point.title}. </strong>
                {point.text}
              </li>
            ))}
          </ul>
        </section>

        <Faq
          embedded
          items={faqs}
          title={`Questions about ${service.name}`}
          intro="Answers for this service only. Prices are not listed because every opening is measured first."
        />

        {linkGroups.map((group) => (
          <section className="mt-10" aria-labelledby={`${group.id}-title`} key={group.id}>
            <h2 id={`${group.id}-title`}>{group.title}</h2>
            <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2 [&_a]:block [&_a]:min-h-11 [&_a]:rounded-2xl [&_a]:border [&_a]:border-line [&_a]:bg-paper [&_a]:p-4 [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline">
              {group.links.map((item) => (
                <li key={`${group.id}-${item.href}`}>
                  <Link href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-10 rounded-2xl bg-navy p-6 text-[#f7f3ea] [&_.button]:mt-4" aria-labelledby="visit-title">
          <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">Next step</p>
          <h2 id="visit-title">Book a {service.name.toLowerCase()} visit</h2>
          <p>
            Tell us the city in {site.region} and whether the work is for an apartment, a house, or a building under repair. We measure before we quote. There is no flat price for every opening.
          </p>
          <a className="button buttonPrimary" href="#contact">
            Contact for this service
          </a>
        </section>

        <section className="mt-4 scroll-mt-28 rounded-2xl border border-line bg-paper p-5" id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <p>
            Ask for {service.name}. Include the city, the number of openings, and a short note about who uses the space. Measurement comes before any installation date.
          </p>
          {phone || site.email ? (
            <ul className="mt-4 grid list-none gap-3 p-0 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
              {phone ? (
                <li>
                  <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a>
                </li>
              ) : null}
              {site.email ? (
                <li>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
              ) : null}
            </ul>
          ) : (
            <p>
              A phone number and email will appear here when they are added to the site details. Until then, use the quote band below and name {service.name} plus your city.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
