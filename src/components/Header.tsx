"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { site, telHref, whatsappHref } from "@/config/site";
import { HeroSearch, type SearchOption } from "./HeroSearch";

type LinkItem = { href: string; label: string };

function Logo() {
  return (
    <Link href="/" className="min-w-0 shrink" aria-label="Sri Ganesha Home Safety Solutions home">
      <img src="/brand/logo-header.webp" alt="Sri Ganesha Home Safety Solutions" width={989} height={268} className="h-11 w-auto max-w-[9.75rem] object-contain object-left sm:h-14 sm:max-w-[16rem] lg:h-16 lg:max-w-[19rem]" />
    </Link>
  );
}

export function Header({
  topLine,
  groups,
  regions,
  hubs,
  popular,
  search,
}: {
  topLine: string;
  groups: { name: string; items: LinkItem[] }[];
  regions: { name: string; cities: LinkItem[] }[];
  hubs: (LinkItem & { areas: LinkItem[] })[];
  popular: LinkItem[];
  search: SearchOption[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const quoteText = "Hello Sri Ganesha Home Safety Solutions, I would like a free measurement in Andhra Pradesh.";
  const wa = whatsappHref(quoteText);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  function go(href: string) {
    setMobile(false);
    setOpen(null);
    router.push(href);
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <p className="truncate text-white/80">
            {topLine}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            {site.phoneDisplay ? (
              <a href={telHref()} className="font-semibold hover:text-cta-500">
                {site.phoneDisplay}
              </a>
            ) : (
              <Link href="/contact" className="font-semibold hover:text-cta-500">
                Book a visit
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="relative border-b border-brand-100/80 bg-white" onMouseLeave={() => setOpen(null)}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <Link href="/" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-900/85 hover:text-cta-600">
              Home
            </Link>
            <div onMouseEnter={() => setOpen("services")}>
              <button type="button" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-900/85 hover:text-cta-600" aria-expanded={open === "services"} onClick={() => setOpen((value) => (value === "services" ? null : "services"))}>
                Services
              </button>
              {open === "services" ? (
                <div className="nav-panel absolute left-1/2 top-full z-50 hidden max-h-[75vh] w-[min(68rem,calc(100vw-2rem))] -translate-x-1/2 overflow-auto px-3 pt-3 lg:block">
                  <ServiceSheet groups={groups} popular={popular} onNavigate={go} />
                </div>
              ) : null}
            </div>
            <div onMouseEnter={() => setOpen("areas")}>
              <button type="button" className="rounded-full px-3 py-2 text-sm font-semibold text-brand-900/85 hover:text-cta-600" aria-expanded={open === "areas"} onClick={() => setOpen((value) => (value === "areas" ? null : "areas"))}>
                Locations
              </button>
              {open === "areas" ? (
                <div className="nav-panel absolute left-1/2 top-full z-50 hidden max-h-[75vh] w-[min(68rem,calc(100vw-2rem))] -translate-x-1/2 overflow-auto px-3 pt-3 lg:block">
                  <AreaSheet regions={regions} hubs={hubs} onNavigate={go} />
                </div>
              ) : null}
            </div>
            {[
              ["/about", "About"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact Us"],
              ["/blog", "Guides"],
              ["/faq", "FAQ"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-full px-3 py-2 text-sm font-semibold text-brand-900/85 hover:text-cta-600">
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-brand-100 text-sm font-semibold text-brand-900"
              aria-label="Search services and cities"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((value) => !value)}
            >
              ⌕
            </button>
            <a href={wa || "/contact"} className="grid h-11 w-11 place-items-center rounded-full bg-success-500 text-white" aria-label="WhatsApp">
              <WaIcon />
            </a>
            <a href={telHref()} className="grid h-11 w-11 place-items-center rounded-full bg-cta-500 text-brand-950" aria-label={site.phoneDisplay ? `Call ${site.phoneDisplay}` : "Call"}>
              <PhoneIcon />
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-brand-100 lg:hidden"
              aria-label={mobile ? "Close menu" : "Open menu"}
              aria-expanded={mobile}
              onClick={() => setMobile((value) => !value)}
            >
              <span className="text-lg">{mobile ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
        {searchOpen ? (
          <div className="border-t border-brand-100 bg-white px-4 py-3 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <HeroSearch id="header-search" light options={search} />
            </div>
          </div>
        ) : null}
        <MobileDrawer open={mobile} groups={groups} regions={regions} wa={wa} onClose={() => setMobile(false)} onNavigate={go} />
      </div>
    </header>
  );
}

function MobileDrawer({
  open,
  groups,
  regions,
  wa,
  onClose,
  onNavigate,
}: {
  open: boolean;
  groups: { name: string; items: LinkItem[] }[];
  regions: { name: string; cities: LinkItem[] }[];
  wa: string;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const [panel, setPanel] = useState<"services" | "areas">("services");
  const [openName, setOpenName] = useState(groups[0]?.name ?? "");
  if (!open) return null;

  const sections =
    panel === "services"
      ? groups.map((group) => ({ name: group.name, viewAll: group.items[0]?.href ?? "/services", items: group.items }))
      : regions.map((region) => ({ name: region.name, viewAll: "/locations", items: region.cities }));

  function choose(next: "services" | "areas") {
    setPanel(next);
    setOpenName(next === "services" ? groups[0]?.name ?? "" : regions[0]?.name ?? "");
  }

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <button type="button" className="absolute inset-0 bg-brand-900/60" aria-label="Close menu backdrop" onClick={onClose} />
      <div id="mobile-menu" className="absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col bg-brand-900 text-white shadow-card">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <p className="font-display text-base font-bold tracking-wide">Sri Ganesha</p>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15" aria-label="Close menu" onClick={onClose}>
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {[
                ["/gallery", "Gallery"],
                ["/about", "About"],
                ["/blog", "Guides"],
                ["/faq", "FAQ"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }} className="block rounded-xl px-3 py-3 text-base font-semibold text-white hover:bg-white/10">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button type="button" className={`rounded-xl px-3 py-3 text-sm font-semibold ${panel === "services" ? "bg-cta-500 text-brand-950" : "bg-white/10 text-white"}`} onClick={() => choose("services")}>
              Services
            </button>
            <button type="button" className={`rounded-xl px-3 py-3 text-sm font-semibold ${panel === "areas" ? "bg-cta-500 text-brand-950" : "bg-white/10 text-white"}`} onClick={() => choose("areas")}>
              Locations
            </button>
          </div>
          <div className="mt-3">
            {sections.map((section) => {
              const expanded = openName === section.name;
              return (
                <div key={section.name} className="border-b border-white/10">
                  <button type="button" className="flex w-full items-center justify-between px-1 py-3 text-left text-sm font-semibold text-white" aria-expanded={expanded} onClick={() => setOpenName(expanded ? "" : section.name)}>
                    <span>{section.name}</span>
                    <span aria-hidden className="text-cta-500">{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded ? (
                    <ul className="grid gap-0.5 pb-3">
                      <li>
                        <Link href={section.viewAll} onClick={(event) => { event.preventDefault(); onNavigate(section.viewAll); }} className="block rounded-lg px-2 py-2 text-sm font-semibold text-cta-500">
                          View all
                        </Link>
                      </li>
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={(event) => { event.preventDefault(); onNavigate(item.href); }} className="block rounded-lg px-2 py-2 text-sm text-white/80 hover:bg-white/10">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
        <div className="border-t border-white/10 p-4">
          <Link href="/contact?need=photo" onClick={(event) => { event.preventDefault(); onNavigate("/contact?need=photo"); }} className="block rounded-full bg-cta-500 py-3 text-center text-sm font-semibold text-brand-950">
            Get a photo estimate
          </Link>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <a href={telHref()} className="rounded-full border border-white/20 py-3 text-center text-sm font-semibold text-white">
              Call
            </a>
            <a href={wa || "/contact"} className="rounded-full bg-success-500 py-3 text-center text-sm font-semibold text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceSheet({
  groups,
  popular,
  onNavigate,
}: {
  groups: { name: string; items: LinkItem[] }[];
  popular: LinkItem[];
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-4 sm:grid-cols-3 lg:grid-cols-4 lg:p-6">
        {groups.map((group) => (
          <div key={group.name} className="min-w-0">
            <p className="border-b border-brand-100 pb-2 font-display text-sm font-bold text-brand-900">{group.name}</p>
            <ul className="mt-2 space-y-1.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={(event) => { event.preventDefault(); onNavigate(item.href); }} className="block py-1 text-sm leading-5 text-brand-800/80 hover:text-brand-900">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {popular.length ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2 lg:px-6">
          {popular.map((link) => (
            <Link key={link.href} href={link.href} onClick={(event) => { event.preventDefault(); onNavigate(link.href); }} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-900">
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="mx-3 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f8f1dc] px-4 py-3 lg:mx-4">
        <p className="text-sm font-medium text-brand-900">Need help choosing the right solution?</p>
        <Link href="/services" onClick={(event) => { event.preventDefault(); onNavigate("/services"); }} className="text-sm font-semibold text-cta-600">
          View all services →
        </Link>
      </div>
    </div>
  );
}

function AreaSheet({
  regions,
  hubs,
  onNavigate,
}: {
  regions: { name: string; cities: LinkItem[] }[];
  hubs: (LinkItem & { areas: LinkItem[] })[];
  onNavigate: (href: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card">
      <div className="grid gap-6 p-4 sm:grid-cols-3 lg:p-6">
        {regions.map((region) => (
          <div key={region.name}>
            <p className="border-b border-brand-100 pb-2 font-display text-sm font-bold text-brand-900">{region.name}</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {region.cities.map((city) => (
                <li key={city.href}>
                  <Link href={city.href} onClick={(event) => { event.preventDefault(); onNavigate(city.href); }} className="block text-sm leading-5 text-brand-800/80 hover:text-brand-900">
                    {city.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-brand-100 px-4 py-4 sm:grid-cols-3 lg:px-6">
        {hubs.map((city) => (
          <div key={city.href}>
            <Link href={city.href} onClick={(event) => { event.preventDefault(); onNavigate(city.href); }} className="font-display text-sm font-bold text-brand-900">
              {city.label}
            </Link>
            <ul className="mt-1 space-y-1">
              {city.areas.map((area) => (
                <li key={area.href}>
                  <Link href={area.href} onClick={(event) => { event.preventDefault(); onNavigate(area.href); }} className="text-sm text-brand-800/75 hover:text-brand-900">
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f8f1dc] px-4 py-3 lg:mx-4">
        <p className="text-sm font-medium text-brand-900">Need a town that is not listed?</p>
        <Link href="/locations" onClick={(event) => { event.preventDefault(); onNavigate("/locations"); }} className="text-sm font-semibold text-cta-600">
          All Andhra Pradesh →
        </Link>
      </div>
    </div>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 14.15c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.3-1.64-.59-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.28.64-.41 1.02-.41.13 0 .24 0 .35.01.31.01.47.03.68.52.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.37-.42.49-.14.14-.28.29-.12.56.16.28.72 1.18 1.54 1.91 1.06.94 1.95 1.23 2.23 1.37.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.59.75 1.86.89.27.14.45.21.52.32.07.12.07.68-.17 1.36z" />
    </svg>
  );
}

export function FloatActions() {
  const wa = whatsappHref("Hello Sri Ganesha, I need a safety installation quote in Andhra Pradesh.");
  return (
    <>
      <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2">
        <a href={wa || "/contact"} className="grid h-12 w-12 place-items-center rounded-full bg-success-500 text-white shadow-card" aria-label="WhatsApp">
          <WaIcon />
        </a>
        <a href={telHref()} className="grid h-12 w-12 place-items-center rounded-full bg-cta-500 text-brand-950 shadow-card" aria-label="Call">
          <PhoneIcon />
        </a>
      </div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
      <path d="M6.6 3.8c.4-.4 1-.5 1.5-.3l2.2.9c.5.2.8.7.8 1.2l-.1 2.4c0 .4-.2.8-.6 1l-1.3.7a12.6 12.6 0 0 0 5.6 5.6l.7-1.3c.2-.4.6-.6 1-.6l2.4-.1c.5 0 1 .3 1.2.8l.9 2.2c.2.5.1 1.1-.3 1.5l-1.5 1.5c-.4.4-1 .6-1.6.5C10.2 19.6 4.4 13.8 3.3 6.9c-.1-.6.1-1.2.5-1.6l1.5-1.5z" />
    </svg>
  );
}
