import Image from "next/image";
import Link from "next/link";
import { QuickFind, type FindEntry } from "@/components/navigation/QuickFind";
import { MobileMenu } from "@/components/navigation/MobileMenu";
import { PrimaryNav } from "@/components/navigation/PrimaryNav";
import { site } from "@/data/site";
import { getPublishedCities, getServices } from "@/lib/content";
import { cityAnchor, servicePath } from "@/lib/paths";
import { areaMenuColumns, serviceMenuColumns } from "@/lib/site-menu";

function findEntries(): FindEntry[] {
  return [
    ...getServices().map((service) => ({
      href: servicePath(service.slug),
      label: service.name,
      kind: "Service" as const,
    })),
    ...getPublishedCities().map((city) => ({
      href: cityAnchor(city.slug),
      label: city.name,
      kind: "City" as const,
    })),
  ];
}

export function Header() {
  const phone = site.phoneDisplay && site.phoneTel;
  const whatsappDigits = site.whatsapp.replace(/\D/g, "");
  const services = serviceMenuColumns();
  const areas = areaMenuColumns();

  return (
    <div className="sticky top-0 z-20">
      <div className="bg-[#141210] text-[#f4efe6]">
        <div className="container flex min-h-9 items-center justify-between gap-4 text-[0.78rem]">
          <p className="truncate">Invisible grills and safety nets · Vijayawada first</p>
          {phone || site.email ? (
            <p className="hidden shrink-0 items-center gap-4 sm:flex">
              {site.email ? <a className="no-underline hover:text-saffron" href={`mailto:${site.email}`}>{site.email}</a> : null}
              {phone ? <a className="no-underline hover:text-saffron" href={`tel:${site.phoneTel}`}>{site.phoneDisplay}</a> : null}
            </p>
          ) : null}
        </div>
      </div>
      <header className="relative border-b border-[#efe8da] bg-white">
        <div className="container flex min-h-[4.5rem] items-center gap-3 py-2 min-[68rem]:min-h-[5.25rem] min-[68rem]:gap-6 min-[68rem]:py-0">
          <Link className="mr-auto flex min-w-0 items-center gap-3 no-underline" href="/">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#d4b483] bg-white p-0.5 shadow-[0_0_0_3px_#f6f0e4] min-[68rem]:size-[3.6rem]">
              <Image
                src="/brand/mark.svg"
                alt=""
                width={48}
                height={48}
                loading="eager"
                sizes="48px"
                className="size-9 rounded-[0.65rem] min-[68rem]:size-11"
              />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate text-[1.02rem] font-extrabold tracking-[0.14em] text-ink uppercase min-[68rem]:text-[1.22rem] min-[68rem]:tracking-[0.18em]">
                Sri Ganesha
              </span>
              <span className="mt-1.5 block h-px w-28 bg-[#d4b483] min-[68rem]:w-40" />
              <span className="mt-1.5 block truncate text-[0.6rem] font-semibold tracking-[0.16em] text-teal uppercase min-[68rem]:text-[0.68rem]">
                Home safety solutions
              </span>
            </span>
          </Link>
          <MobileMenu services={services} areas={areas} />
          <PrimaryNav services={services} areas={areas} />
          <QuickFind entries={findEntries()} />
          {whatsappDigits ? (
            <a
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#25d366] text-white no-underline"
              href={`https://wa.me/${whatsappDigits}`}
              aria-label="WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          ) : null}
          {phone ? (
            <a className="button buttonPrimary hidden px-5 text-sm min-[68rem]:inline-flex" href={`tel:${site.phoneTel}`}>
              Call now
            </a>
          ) : (
            <Link className="button buttonPrimary hidden px-5 text-sm min-[68rem]:inline-flex" href="/#inspect">
              Book a visit
            </Link>
          )}
        </div>
      </header>
      {phone ? (
        <a
          className="flex h-10 items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-3 text-sm font-extrabold text-ink no-underline min-[68rem]:hidden"
          href={`tel:${site.phoneTel}`}
        >
          Vijayawada local team · Call {site.phoneDisplay}
        </a>
      ) : (
        <Link
          className="flex h-10 items-center justify-center bg-gradient-to-r from-[#f3e6c8] via-[#d4b483] to-[#b08948] px-3 text-sm font-extrabold text-ink no-underline min-[68rem]:hidden"
          href="/#inspect"
        >
          Vijayawada fittings · Book a site inspection
        </Link>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.41a10 10 0 0 0 4.65 1.18h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 13.9c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.14-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.16-1.54-1.16-2.94s.73-2.08 1-2.37c.24-.26.64-.38 1.02-.38.12 0 .23 0 .33.01.3.01.44.03.64.49.24.57.82 1.98.89 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.26.71 1.17 1.53 1.9 1.05.93 1.94 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.69-.8.88-1.08.19-.26.38-.22.64-.13.26.1 1.66.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}
