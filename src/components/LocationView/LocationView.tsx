import Link from "next/link";
import { ContactActions } from "@/components/seo/ContactActions";
import { PriceFactors } from "@/components/seo/PriceFactors";
import { QuickAnswer } from "@/components/seo/QuickAnswer";
import { howItWorks } from "@/data/homepage";
import { site } from "@/data/site";
import { JsonLd } from "@/components/seo/JsonLd";
import type { Location } from "@/data/locations";
import { getBreadcrumbLinks, getCityPageLinks, getLocalityPageLinks } from "@/lib/internal-links";
import { breadcrumbSchema, locationPageSchema } from "@/lib/schema";

export function LocationView({ location }: { location: Location }) {
  const breadcrumbs = getBreadcrumbLinks({ kind: "location", locationSlug: location.slug });
  const linkGroups =
    location.type === "locality" ? getLocalityPageLinks(location.slug) : getCityPageLinks(location.slug);
  const serviceLink = linkGroups.find((group) => group.id === "popular-services")?.links[0];

  return (
    <article className="container py-6 pb-14">
      <JsonLd data={[breadcrumbSchema(breadcrumbs), locationPageSchema(location)]} />
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
      <header>
        <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">
          {location.type === "locality" ? location.city : site.region}
        </p>
        <h1>
          {location.type === "locality"
            ? `Home safety in ${location.name}, ${location.city}`
            : `Home safety in ${location.name}`}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{location.description}</p>
        <ContactActions />
        {location.slug === "vijayawada" ? (
          <p className="mt-3 text-sm font-bold text-teal">Main city for this catalogue.</p>
        ) : null}
        {serviceLink ? (
          <p>
            <Link href={serviceLink.href}>{serviceLink.label}</Link>
          </p>
        ) : null}
      </header>

      <QuickAnswer
        title={`Which fittings are published for ${location.name}?`}
        text={
          serviceLink
            ? `${location.name} has published service pages. Start with ${serviceLink.label}. A place named on the homepage is not a service page until it appears in this list.`
            : `${location.description} Vijayawada is the primary city. A measurement is booked from the contact page, not from the town name alone.`
        }
      />

      <section className="mt-8" aria-labelledby="visit-steps-title">
        <h2 id="visit-steps-title">How a visit works</h2>
        <ol className="mt-4 grid list-none gap-3 p-0">
          {howItWorks.steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-line bg-paper p-4">
              <h3>
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <PriceFactors />

      {location.landmarks.length > 0 ? (
        <section className="mt-8 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline [&_ul]:mt-3 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-3 [&_ul]:p-0 min-[48rem]:[&_ul]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4" aria-labelledby="landmarks-title">
          <h2 id="landmarks-title">Known public places</h2>
          <ul>
            {location.landmarks.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {linkGroups.map((group) => (
        <section className="mt-8 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:font-bold [&_a]:text-teal [&_a]:no-underline [&_ul]:mt-3 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-3 [&_ul]:p-0 min-[48rem]:[&_ul]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4" aria-labelledby={`${group.id}-title`} key={group.id}>
          <h2 id={`${group.id}-title`}>{group.title}</h2>
          <ul>
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
    </article>
  );
}
