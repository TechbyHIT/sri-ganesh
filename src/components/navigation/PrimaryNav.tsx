"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MenuColumn } from "@/lib/site-menu";

type PanelId = "services" | "areas";

type NavItem = {
  href: string;
  label: string;
  panel?: PanelId;
};

function columnId(panel: PanelId, href: string): string {
  return `${panel}-${href.replace(/[^a-z0-9]+/gi, "-")}`;
}

const items: readonly NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services", panel: "services" },
  { href: "/locations", label: "Locations", panel: "areas" },
  { href: "/pricing-guide", label: "Prices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function PrimaryNav({
  services,
  areas,
}: {
  services: readonly MenuColumn[];
  areas: readonly MenuColumn[];
}) {
  const [open, setOpen] = useState<PanelId | null>(null);
  const closeTimer = useRef<number | null>(null);
  const columns = open === "services" ? services : open === "areas" ? areas : [];

  function show(panel: PanelId) {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }

    setOpen(panel);
  }

  function hideSoon() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
    }

    closeTimer.current = window.setTimeout(() => setOpen(null), 280);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(null);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  return (
    <>
      <nav className="hidden min-[68rem]:block" aria-label="Primary" onMouseLeave={hideSoon}>
        <ul className="flex list-none gap-1 p-0">
          {items.map((item) => (
            <li key={item.href} onMouseEnter={() => (item.panel ? show(item.panel) : setOpen(null))}>
              <Link
                className={`inline-flex min-h-11 items-center gap-1 px-2 text-[0.95rem] font-semibold no-underline ${
                  item.panel && open === item.panel ? "text-[#5c4318]" : "text-teal hover:text-[#5c4318]"
                }`}
                href={item.href}
                aria-expanded={item.panel ? open === item.panel : undefined}
                aria-controls={item.panel && open === item.panel ? `${item.panel}-menu` : undefined}
                onFocus={() => (item.panel ? show(item.panel) : setOpen(null))}
              >
                {item.label}
                {item.panel ? (
                  <span aria-hidden="true" className="text-[0.65rem]">
                    ▾
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {open ? (
        <div
          id={`${open}-menu`}
          className="absolute inset-x-0 top-full z-30 hidden px-4 pt-2 min-[68rem]:block"
          onMouseEnter={() => show(open)}
          onMouseLeave={hideSoon}
        >
          <div className="relative -mt-2 mx-auto w-[min(76rem,100%)] rounded-[1.75rem] border border-[#efe8da] bg-white px-8 py-8 shadow-[0_24px_70px_rgb(28_25_23_/_0.18)]">
            <div className="grid grid-cols-4 gap-x-10 gap-y-8">
              {columns.map((column) => (
                <section key={`${open}-${column.title}`} aria-labelledby={columnId(open, column.title)}>
                  <h2 id={columnId(open, column.title)} className="border-b border-[#f0ebe3] pb-2 text-[0.98rem] font-extrabold text-navy">
                    <Link className="text-navy no-underline hover:text-teal" href={column.href}>
                      {column.title}
                    </Link>
                  </h2>
                  {column.links.length > 0 ? (
                    <ul className="mt-1 grid list-none p-0">
                      {column.links.map((link) => (
                        <li key={`${column.title}-${link.label}`} className="border-b border-[#f6f3ee] last:border-b-0">
                          <Link className="block py-2.5 text-sm text-[#57534e] no-underline hover:text-teal" href={link.href}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
