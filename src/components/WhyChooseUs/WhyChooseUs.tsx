import { whyChooseUs } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";

export function WhyChooseUs() {
  return (
    <section className="py-10" aria-labelledby="why-title">
      <div className="container">
        <SectionHeading
          eyebrow={whyChooseUs.eyebrow}
          title={whyChooseUs.title}
          intro={whyChooseUs.intro}
          titleId="why-title"
        />
        <ul className="mt-6 grid list-none gap-3 p-0 min-[48rem]:grid-cols-3">
          {whyChooseUs.points.map((point) => (
            <li className="rounded-2xl border border-line bg-paper p-4" key={point.title}>
              <h3 className="font-extrabold tracking-tight">{point.title}</h3>
              <p className="mt-2 text-muted">{point.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
