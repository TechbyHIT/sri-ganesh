"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type FindEntry = {
  href: string;
  label: string;
  kind: "Service" | "City";
};

export function QuickFind({ entries }: { entries: readonly FindEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = needle
      ? entries.filter((entry) => entry.label.toLowerCase().includes(needle))
      : entries;
    return pool.slice(0, 8);
  }, [entries, query]);

  return (
    <div className="relative hidden min-[68rem]:block">
      <button
        className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-teal"
        type="button"
        aria-expanded={open}
        aria-controls="quick-find"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Search"}
      </button>
      {open ? (
        <div
          id="quick-find"
          className="absolute right-0 z-40 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-line bg-paper p-3 shadow-lg"
          role="dialog"
          aria-label="Search services and cities"
        >
          <label className="grid gap-2 text-sm font-bold" htmlFor={inputId}>
            Quick find
            <input
              ref={inputRef}
              id={inputId}
              className="min-h-11 rounded-xl border border-line px-3 font-medium"
              type="search"
              value={query}
              placeholder="Services and cities"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <ul className="mt-2 grid list-none p-0">
            {results.length === 0 ? (
              <li className="px-2 py-3 text-sm text-muted">No matching service or city.</li>
            ) : (
              results.map((entry) => (
                <li key={`${entry.kind}-${entry.href}`}>
                  <Link
                    className="flex min-h-11 items-center justify-between gap-3 rounded-xl px-2 no-underline"
                    href={entry.href}
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-bold">{entry.label}</span>
                    <span className="text-xs font-extrabold tracking-wide text-teal uppercase">{entry.kind}</span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
