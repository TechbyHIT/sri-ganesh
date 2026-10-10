import Link from "next/link";
import { seo } from "@/data/seo";
import { site } from "@/data/site";
import { getServices } from "@/lib/content";
import { servicePath } from "@/lib/paths";
import { categoryPath, getCatalogCategories, getPublicCatalogEntries } from "@/lib/service-catalog";

export function ServiceIndex() {
  const services = getServices();
  const categories = getCatalogCategories();

  return (
    <div className="container py-8 pb-14">
      <p className="text-sm font-bold text-muted">Home / Service library</p>
      <header className="mt-4">
        <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">{site.region}</p>
        <h1 className="mt-2 max-w-[16ch] text-[clamp(2rem,5vw,3.6rem)] leading-none font-extrabold tracking-tight">{seo.servicesIndex.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{seo.servicesIndex.description}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="button buttonPrimary" href="#service-library">
            Explore services
          </Link>
          <Link className="button buttonGhost" href="/contact">
            Contact
          </Link>
        </div>
      </header>
      <ul className="mt-8 grid list-none gap-4 p-0 min-[48rem]:grid-cols-2" id="service-library">
        {services.map((service, index) => (
          <li key={service.slug}>
            <Link className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-paper p-5 no-underline" href={servicePath(service.slug)}>
              <span className="text-[0.82rem] font-extrabold tracking-wide text-saffron-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="text-xl font-extrabold tracking-tight">{service.name}</h2>
              <p className="text-muted">{service.shortDescription}</p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12" aria-labelledby="catalog-title">
        <h2 id="catalog-title" className="text-2xl font-extrabold tracking-tight">
          What people ask for, and where it is answered
        </h2>
        <p className="mt-2 max-w-3xl text-muted">
          Requests arrive under many names. Each one below opens the page that already covers that work. There is no separate page per phrase.
        </p>
        <div className="mt-6 grid gap-6 min-[48rem]:grid-cols-2 min-[68rem]:grid-cols-4">
          {categories.map((category) => {
            const entries = getPublicCatalogEntries(category.id);

            return (
              <section key={category.id} aria-labelledby={`catalog-${category.id}`}>
                <h3 id={`catalog-${category.id}`} className="border-b border-[#f0ebe3] pb-2 text-[0.98rem] font-extrabold">
                  <Link className="text-navy no-underline hover:text-teal" href={categoryPath(category)}>
                    {category.name}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted">{category.summary}</p>
                <ul className="mt-1 grid list-none p-0">
                  {entries.map((item) => (
                    <li key={item.id} className="border-b border-[#f6f3ee] last:border-b-0">
                      <Link className="block py-2 text-sm text-[#57534e] no-underline hover:text-teal" href={item.canonicalPath}>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
}
