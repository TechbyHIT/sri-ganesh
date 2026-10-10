import Link from "next/link";
import { ContactActions } from "@/components/seo/ContactActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import type { PublishedMatrixPage } from "@/lib/url-matrix/published";

/**
 * Renders one approved service-and-place page from the business's own content.
 * Nothing here is generated from the place name. If a field is empty, its section is omitted.
 */
export function MatrixPage({ page }: { page: PublishedMatrixPage }) {
  const { approval, resolved } = page;
  const { entry, district, location } = resolved;
  const place = location ?? district;
  const content = approval.content;
  const title = `${entry.name} in ${place.name}`;
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: entry.canonicalPath, label: entry.name },
    { href: approval.path, label: place.name },
  ];
  const faqs = content.faqs.map((faq, index) => ({ id: `${entry.slug}-${index + 1}`, ...faq }));

  return (
    <article className="py-5 pb-12">
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs)]} />
      <div className="container">
        <nav aria-label="Breadcrumb">
          <ol className="mb-5 flex list-none flex-wrap gap-2 p-0 text-sm text-muted">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href}>
                {index === breadcrumbs.length - 1 ? (
                  <span aria-current="page">{crumb.label}</span>
                ) : (
                  <Link className="font-bold text-teal no-underline" href={crumb.href}>
                    {crumb.label}
                  </Link>
                )}
                {index === breadcrumbs.length - 1 ? null : <span aria-hidden="true"> / </span>}
              </li>
            ))}
          </ol>
        </nav>

        <header>
          <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">
            {district.name}, {site.region}
          </p>
          <h1>{title}</h1>
          <p className="mt-3 max-w-3xl text-lg text-muted">{content.introduction}</p>
          <ContactActions />
        </header>

        <section className="mt-10" aria-labelledby="coverage-title">
          <h2 id="coverage-title">Where we work</h2>
          <p>{content.verifiedCoverage}</p>
        </section>

        <section className="mt-10" aria-labelledby="fit-title">
          <h2 id="fit-title">Where it fits</h2>
          <ul className="mt-4 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
            {content.propertyTypes.map((item) => (
              <li key={item}>{item}</li>
            ))}
            {content.applications.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10" aria-labelledby="install-title">
          <h2 id="install-title">How it is installed</h2>
          <p>{content.installationDetails}</p>
          {content.materials.length > 0 ? (
            <ul className="mt-3 list-disc pl-5">
              {content.materials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>

        {content.projects.length > 0 ? (
          <section className="mt-10" aria-labelledby="projects-title">
            <h2 id="projects-title">Documented work</h2>
            <ul className="mt-4 grid list-none gap-3 p-0 [&_li]:rounded-2xl [&_li]:border [&_li]:border-line [&_li]:bg-paper [&_li]:p-4">
              {content.projects.map((project) => (
                <li key={project.title}>
                  <h3>{project.title}</h3>
                  <p>{project.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-10" aria-labelledby="care-title">
          <h2 id="care-title">Looking after it</h2>
          <p>{content.maintenance}</p>
        </section>

        <section className="mt-10" aria-labelledby="faq-title">
          <h2 id="faq-title">Questions</h2>
          <div className="mt-4 grid gap-3">
            {content.faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-line bg-paper p-4">
                <summary className="cursor-pointer font-bold">{faq.question}</summary>
                <p className="mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {content.relatedServicePaths.length > 0 ? (
          <nav className="mt-10" aria-label="Related pages">
            <h2>Related</h2>
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {content.relatedServicePaths.map((path) => (
                <li key={path}>
                  <Link className="inline-flex rounded-full border border-[#d4b483] bg-teal-soft px-3 py-1.5 text-sm font-semibold text-teal no-underline" href={path}>
                    {path.replace(/^\//, "").replace(/-/g, " ")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <p className="mt-10 text-sm text-muted">
          Coverage confirmed by {approval.coverage.confirmedBy} on {approval.coverage.confirmedOn}. Details checked on{" "}
          {content.source.verifiedOn}.
        </p>
      </div>
    </article>
  );
}
