import Link from "next/link";
import { benefits } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";
import { getServices } from "@/lib/content";
import { servicePath } from "@/lib/paths";

export function Benefits() {
  const items = getServices();

  return (
    <section className="pb-14" aria-labelledby="benefits-title">
      <div className="container">
        <SectionHeading
          eyebrow={benefits.eyebrow}
          title={benefits.title}
          intro={benefits.intro}
          titleId="benefits-title"
        />
        <ul className="mt-6 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
          {items.map((service) => (
            <li key={service.slug}>
              <Link className="block min-h-11 rounded-2xl border border-line bg-paper p-4 no-underline" href={servicePath(service.slug)}>
                <h3 className="font-extrabold tracking-tight">{service.name}</h3>
                <p className="mt-1 text-muted">{service.benefits[0]}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
