import type { ReactNode } from "react";
import Link from "next/link";
import type { StaticPage } from "@/lib/content/static-pages";

export function StaticArticle({ page, children }: { page: StaticPage; children?: ReactNode }) {
  return (
    <article className="container py-8 pb-16">
      <p className="text-[0.82rem] font-extrabold tracking-[0.08em] text-teal uppercase">{page.eyebrow}</p>
      <h1>{page.h1}</h1>
      <div className="mt-6 max-w-3xl space-y-8">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="mt-3 text-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
        {children}
      </div>
      <p className="mt-8">
        <Link className="inline-flex min-h-11 items-center font-bold text-teal no-underline" href="/contact">
          Ask for a measurement
        </Link>
      </p>
    </article>
  );
}
