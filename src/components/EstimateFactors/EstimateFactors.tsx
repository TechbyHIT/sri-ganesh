import { estimateFactors } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";

export function EstimateFactors() {
  return (
    <section className="pb-14" aria-labelledby="estimate-title">
      <div className="container">
        <div className="rounded-3xl border border-line bg-paper p-6 min-[48rem]:p-8">
          <SectionHeading
            eyebrow={estimateFactors.eyebrow}
            title={estimateFactors.title}
            intro={estimateFactors.intro}
            titleId="estimate-title"
          />
          <ul className="mt-6 grid list-none gap-3 p-0 min-[48rem]:grid-cols-2">
            {estimateFactors.points.map((point) => (
              <li className="rounded-2xl bg-teal-soft px-4 py-3 font-bold" key={point}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
