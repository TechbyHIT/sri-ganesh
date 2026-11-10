import Link from "next/link";
import { LocationSearchForm } from "./LocationSearchForm";

export function NotFoundBody() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cta-600">404</p>
      <h1 className="mt-3 font-display text-4xl font-bold">That page is not on the Andhra Pradesh map</h1>
      <p className="mt-3 text-sm leading-7 text-brand-800/75">Search for your district, mandal or town, or send the town name with a visit request.</p>
      <div className="mt-6 text-left">
        <LocationSearchForm />
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/locations" className="rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white">
          Locations
        </Link>
        <Link href="/contact" className="rounded-full bg-cta-500 px-5 py-3 text-sm font-semibold text-brand-950">
          Contact
        </Link>
      </div>
    </div>
  );
}
