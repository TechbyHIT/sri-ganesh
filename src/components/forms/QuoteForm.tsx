"use client";

import { useActionState } from "react";
import { submitQuote } from "@/app/contact/actions";

type Option = { slug: string; name: string };

export function QuoteForm({ services, cities, propertyTypes }: { services: Option[]; cities: Option[]; propertyTypes: Option[] }) {
  const [state, action, pending] = useActionState(submitQuote, null);

  return (
    <form action={action} className="mt-8 grid max-w-xl gap-4" noValidate>
      <p className="text-sm text-muted" role="status">
        {state?.message}
      </p>
      <label className="grid gap-1 font-bold">
        Name
        <input className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="name" autoComplete="name" required />
      </label>
      <label className="grid gap-1 font-bold">
        Phone number
        <input className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="phone" autoComplete="tel" inputMode="tel" required />
      </label>
      <label className="grid gap-1 font-bold">
        WhatsApp number
        <input className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="whatsapp" autoComplete="tel" inputMode="tel" />
      </label>
      <label className="grid gap-1 font-bold">
        Service
        <select className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="serviceSlug" required defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 font-bold">
        City
        <select className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="citySlug" required defaultValue="">
          <option value="" disabled>
            Select a city
          </option>
          {cities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 font-bold">
        Area
        <input className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="areaSlug" />
      </label>
      <label className="grid gap-1 font-bold">
        Property type
        <select className="min-h-11 rounded-xl border border-line bg-paper px-3 font-normal" name="propertyType" defaultValue="">
          <option value="">Not specified</option>
          {propertyTypes.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 font-bold">
        Message
        <textarea className="min-h-28 rounded-xl border border-line bg-paper px-3 py-2 font-normal" name="message" required />
      </label>
      <label className="flex min-h-11 items-start gap-3 font-normal">
        <input className="mt-1 size-5" type="checkbox" name="consent" required />
        <span>I agree that this message is stored so the business can reply about a measurement.</span>
      </label>
      <label className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        Company website
        <input tabIndex={-1} autoComplete="off" name="companyWebsite" />
      </label>
      <button className="button buttonPrimary" type="submit" disabled={pending}>
        {pending ? "Sending" : "Request a measurement"}
      </button>
    </form>
  );
}
