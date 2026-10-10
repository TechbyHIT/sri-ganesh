import { getFaqs } from "@/lib/content";
import { SectionHeading } from "@/components/SectionHeading/SectionHeading";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type FaqProps = {
  items?: FaqItem[];
  title?: string;
  intro?: string;
  embedded?: boolean;
};

export function Faq({
  items,
  title = "Questions before a site visit",
  intro = "Straight answers about coverage, measurement, and how the products differ.",
  embedded = false,
}: FaqProps) {
  const faqs = items ?? getFaqs({ scope: "home" });

  if (faqs.length === 0) {
    return null;
  }

  const content = (
    <>
      <SectionHeading
        eyebrow="FAQ"
        title={title}
        intro={intro}
        titleId={embedded ? "page-faq-title" : "faq-title"}
      />
      <div className="mt-6 grid gap-3">
        {faqs.map((faq) => (
          <details className="rounded-2xl border border-line bg-paper px-4 py-1" key={faq.id}>
            <summary className="min-h-11 cursor-pointer py-3 font-extrabold">{faq.question}</summary>
            <p className="pb-4 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </>
  );

  if (embedded) {
    return <div className="pb-14">{content}</div>;
  }

  return (
    <section className="pb-14" aria-labelledby="faq-title">
      <div className="container">{content}</div>
    </section>
  );
}
