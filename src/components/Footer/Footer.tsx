import Image from "next/image";
import Link from "next/link";
import { featuredServiceSlugs } from "@/data/homepage";
import { site } from "@/data/site";
import { getPublishedCities, getServices } from "@/lib/content";
import { cityAnchor, servicePath } from "@/lib/paths";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Installation gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/services", label: "All services" },
  { href: "/faq", label: "FAQ" },
  { href: "/pricing-guide", label: "Pricing and installation" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const;

export function Footer() {
  const phone = site.phoneDisplay && site.phoneTel;
  const popular = featuredServiceSlugs
    .map((slug) => getServices().find((service) => service.slug === slug))
    .filter((service) => service !== undefined);
  const cities = [...getPublishedCities()].sort((left, right) => {
    if (left.slug === "vijayawada") return -1;
    if (right.slug === "vijayawada") return 1;
    return left.name.localeCompare(right.name);
  });

  return (
    <footer className="bg-navy px-0 py-12 text-[#f7f3ea]">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 min-[64rem]:grid-cols-4">
          <div>
            <Link className="flex items-start gap-3 text-inherit no-underline" href="/">
              <Image className="size-11 shrink-0" src="/brand/mark.svg" alt="" width={44} height={44} sizes="44px" fetchPriority="low" />
              <span>
                <span className="text-[1.05rem] font-extrabold tracking-tight">
                  <span className="text-[#f3e6c8]">Sri </span>
                  <span className="text-[#d4b483]">Ganesha</span>
                </span>
                <p className="text-sm font-bold tracking-[0.08em] text-white/70 uppercase">Safety nets & invisible grills</p>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-white/80">
              Measured balcony nets, invisible grills, cloth hangers, and related fittings. Vijayawada is the main city. Other pages cover published cities in {site.region}.
            </p>
            {phone || site.email ? (
              <p className="mt-3 grid gap-1">
                {phone ? <a href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a> : null}
                {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : null}
              </p>
            ) : (
              <p className="mt-3 text-sm text-white/70">Phone and email are added here when they are confirmed.</p>
            )}
          </div>
          <nav aria-label="Popular services">
            <h2 className="mb-3 text-[0.82rem] font-extrabold tracking-[0.08em] text-saffron uppercase">Popular services</h2>
            <ul className="grid list-none gap-1 p-0">
              {popular.map((service) => (
                <li key={service.slug}>
                  <Link className="inline-flex min-h-11 items-center no-underline" href={servicePath(service.slug)} prefetch={false}>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Service cities">
            <h2 className="mb-3 text-[0.82rem] font-extrabold tracking-[0.08em] text-saffron uppercase">Service cities</h2>
            <ul className="grid list-none gap-1 p-0">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link className="inline-flex min-h-11 items-center no-underline" href={cityAnchor(city.slug)} prefetch={false}>
                    {city.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="inline-flex min-h-11 items-center no-underline" href="/locations" prefetch={false}>
                  Browse all service areas
                </Link>
              </li>
            </ul>
          </nav>
          <nav aria-label="Company">
            <h2 className="mb-3 text-[0.82rem] font-extrabold tracking-[0.08em] text-saffron uppercase">Company and help</h2>
            <ul className="grid list-none gap-1 p-0">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link className="inline-flex min-h-11 items-center no-underline" href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 border-t border-white/15 pt-4 text-sm text-white/70">
          {site.name}. No office address is listed until one is confirmed.
        </p>
        <p className="mt-2 text-sm text-white/70">
          <Link href="/html-sitemap">HTML sitemap</Link>
          {" · "}
          <Link href="/sitemap.xml">XML sitemap</Link>
          {" · "}
          <Link href="/privacy-policy">Privacy</Link>
          {" · "}
          <Link href="/terms-and-conditions">Terms</Link>
          {" · "}
          Designed by <a href="https://techbyhit.com">TechByHit.com</a>
        </p>
      </div>
    </footer>
  );
}
