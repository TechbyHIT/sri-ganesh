"use client";

import { useActionState } from "react";
import { submitQuote } from "@/app/contact/actions";

type Option = { slug: string; name: string };

const services = [
  { slug: "invisible-grills", name: "Invisible grills" },
  { slug: "balcony-safety-nets", name: "Balcony, pigeon, child, pet, or terrace nets" },
  { slug: "duct-area-nets", name: "Duct area nets" },
  { slug: "safety-spikes", name: "Bird spikes" },
  { slug: "cloth-hangers", name: "Cloth hangers, including pulley and wall brackets" },
  { slug: "sports-nets", name: "Sports nets or cricket practice nets" },
  { slug: "building-covering", name: "Temporary building covering" },
];

export function InspectionForm({ cities }: { cities: Option[] }) {
  const [state, action, pending] = useActionState(submitQuote, null);

  return (
    <form action={action} className="grid gap-4" noValidate>
      <p className="text-sm text-muted" role="status">
        {state?.message}
      </p>
      <label className="grid gap-1 font-bold">
        Full name
        <input className="min-h-11 rounded-2xl border border-line bg-paper px-3 font-normal" name="name" autoComplete="name" required />
      </label>
      <label className="grid gap-1 font-bold">
        Mobile number
        <input className="min-h-11 rounded-2xl border border-line bg-paper px-3 font-normal" name="phone" autoComplete="tel" inputMode="tel" required />
      </label>
      <label className="grid gap-1 font-bold">
        Service required
        <select className="min-h-11 rounded-2xl border border-line bg-paper px-3 font-normal" name="serviceSlug" required defaultValue="">
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
        City for the visit
        <select className="min-h-11 rounded-2xl border border-line bg-paper px-3 font-normal" name="citySlug" required defaultValue="vijayawada">
          {cities.map((city) => (
            <option key={city.slug} value={city.slug}>
              {city.name}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 font-bold">
        Message
        <textarea className="min-h-28 rounded-2xl border border-line bg-paper px-3 py-2 font-normal" name="message" required placeholder="Describe the opening and what you want it to do." />
      </label>
      <input type="hidden" name="whatsapp" value="" />
      <input type="hidden" name="areaSlug" value="" />
      <input type="hidden" name="propertyType" value="" />
      <label className="flex min-h-11 items-start gap-3 font-normal">
        <input className="mt-1 size-5" type="checkbox" name="consent" required />
        <span>I agree that this message is stored so the business can reply about a measurement.</span>
      </label>
      <label className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        Company website
        <input tabIndex={-1} autoComplete="off" name="companyWebsite" />
      </label>
      <button className="button buttonPrimary" type="submit" disabled={pending}>
        {pending ? "Sending" : "Request a free site inspection"}
      </button>
      <p className="text-sm text-muted">
        WhatsApp is shown after a business number is confirmed. Until then, this form is the way to ask for a visit.
      </p>
    </form>
  );
}
