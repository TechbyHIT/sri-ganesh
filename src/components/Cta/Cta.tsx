import Link from "next/link";
import { cta } from "@/data/site";

export function Cta() {
  return (
    <section className="scroll-mt-24 bg-navy py-14 text-[#f7f3ea]" id={cta.id} aria-labelledby="cta-title">
      <div className="container grid gap-6 md:grid-cols-[1.4fr_auto] md:items-end">
        <div>
          <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-saffron uppercase">{cta.eyebrow}</p>
          <h2 className="mt-2 text-[clamp(1.8rem,4vw,2.7rem)] leading-tight font-extrabold tracking-tight" id="cta-title">
            {cta.title}
          </h2>
          <p className="mt-3 max-w-xl text-white/85">{cta.text}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link className="button buttonPrimary" href={cta.primary.href}>
            {cta.primary.label}
          </Link>
          <Link className="button buttonOnDark" href={cta.secondary.href}>
            {cta.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
