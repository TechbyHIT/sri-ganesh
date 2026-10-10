"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuColumn } from "@/lib/site-menu";

const links = [
  { href: "/", label: "Home" },
  { href: "/pricing-guide", label: "Prices" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function MobileMenu({
  services,
  areas,
}: {
  services: readonly MenuColumn[];
  areas: readonly MenuColumn[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className="min-[68rem]:hidden">
      <button
        className="inline-flex min-h-11 items-center rounded-full border border-[#d4b483] px-4 text-sm font-bold text-teal"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <button
          className="fixed inset-0 z-30 bg-navy/40"
          type="button"
          aria-label="Close menu"
          onClick={close}
        />
      ) : null}
      {open ? (
        <nav
          id="mobile-menu"
          className="fixed inset-x-3 top-20 z-40 max-h-[min(36rem,calc(100dvh-6rem))] overflow-y-auto rounded-2xl bg-paper p-4 shadow-lg"
          aria-label="Mobile"
        >
          <ul className="grid list-none p-0">
            {links.slice(0, 1).map((item) => (
              <li key={item.href}>
                <Link className="flex min-h-11 items-center rounded-full px-3 font-bold text-navy" href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <MenuGroup title="Services" indexHref="/services" indexLabel="All services" columns={services} onNavigate={close} />
          <MenuGroup title="Locations" indexHref="/locations" indexLabel="All locations" columns={areas} onNavigate={close} />
          <ul className="mt-2 grid list-none border-t border-line p-0 pt-2">
            {links.slice(1).map((item) => (
              <li key={item.href}>
                <Link className="flex min-h-11 items-center rounded-full px-3 font-bold text-navy" href={item.href} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

function MenuGroup({
  title,
  indexHref,
  indexLabel,
  columns,
  onNavigate,
}: {
  title: string;
  indexHref: string;
  indexLabel: string;
  columns: readonly MenuColumn[];
  onNavigate: () => void;
}) {
  return (
    <section className="mt-2 border-t border-line pt-3" aria-label={title}>
      <div className="flex items-baseline justify-between gap-3 px-3">
        <h2 className="text-sm font-extrabold tracking-[0.08em] text-navy uppercase">{title}</h2>
        <Link className="text-sm font-bold text-teal no-underline" href={indexHref} onClick={onNavigate}>
          {indexLabel}
        </Link>
      </div>
      <div className="mt-3 grid gap-4">
        {columns.map((column) => (
          <div key={column.title}>
            <Link className="px-3 text-[0.95rem] font-extrabold text-navy no-underline" href={column.href} onClick={onNavigate}>
              {column.title}
            </Link>
            {column.links.length > 0 ? (
              <ul className="mt-1 grid list-none p-0">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      className="flex min-h-9 items-center px-3 text-sm text-slate-500 no-underline"
                      href={link.href}
                      onClick={onNavigate}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
