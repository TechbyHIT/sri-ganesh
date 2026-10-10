import { howItWorks } from "@/data/homepage";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";

export function HowItWorks() {
  return (
    <section className="pb-12" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} titleId="process-title" />
        <ol className="mt-6 grid list-none gap-4 p-0 min-[64rem]:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <li className="rounded-2xl border border-line bg-paper p-5" key={step.title}>
              <span className="text-[0.82rem] font-extrabold tracking-wide text-saffron-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-extrabold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
