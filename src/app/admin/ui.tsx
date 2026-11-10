import Link from "next/link";

export type Flash = { ok?: string; error?: string; detail?: string };

export function FlashMessage({ flash }: { flash: Flash }) {
  if (!flash.ok && !flash.error) return null;
  return (
    <div
      role="status"
      className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${flash.error ? "bg-red-50 text-red-900 ring-1 ring-red-200" : "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"}`}
    >
      <p className="font-semibold">{flash.error ?? flash.ok}</p>
      {flash.detail ? <p className="mt-2 text-xs opacity-80">{flash.detail}</p> : null}
    </div>
  );
}

export function AdminTitle({ title, text, actions }: { title: string; text?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-900">{title}</h1>
        {text ? <p className="mt-1 max-w-3xl text-sm leading-6 text-brand-800/70">{text}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cta-600">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-brand-900">{typeof value === "number" ? value.toLocaleString("en-IN") : value}</p>
      {note ? <p className="mt-1 text-xs text-brand-800/60">{note}</p> : null}
    </div>
  );
}

export function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-brand-100 bg-white p-5">
      {title ? <h2 className="mb-3 font-display text-lg font-bold text-brand-900">{title}</h2> : null}
      {children}
    </section>
  );
}

export function Button({ children, tone = "dark", name, value }: { children: React.ReactNode; tone?: "dark" | "gold" | "light" | "danger"; name?: string; value?: string }) {
  const tones = {
    dark: "bg-brand-900 text-white hover:bg-brand-800",
    gold: "bg-cta-500 text-brand-950 hover:bg-cta-600",
    light: "bg-white text-brand-900 ring-1 ring-brand-100 hover:ring-cta-500",
    danger: "bg-white text-red-700 ring-1 ring-red-200 hover:bg-red-50",
  };
  return (
    <button type="submit" name={name} value={value} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tones[tone]}`}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900 ring-1 ring-brand-100 hover:ring-cta-500">
      {children}
    </Link>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      {hint ? <span className="ml-2 text-xs text-brand-800/60">{hint}</span> : null}
      <div className="mt-1">{children}</div>
    </label>
  );
}

export const inputClass = "w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm text-brand-900 outline-none focus:border-cta-500 focus:ring-2 focus:ring-cta-500/30";

export const statusTone: Record<string, string> = {
  publish: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  exclude: "bg-red-50 text-red-800 ring-red-200",
};

export function Badge({ children, tone = "" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${tone || "bg-brand-50 text-brand-800 ring-brand-100"}`}>{children}</span>;
}
