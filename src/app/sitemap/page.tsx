import type { Metadata } from "next";
import Link from "next/link";
import { SiteModules } from "@/components/SiteModules";
import { PageHero } from "@/components/ui";
import { publishedRecords } from "@/seo/indexable";
import { absoluteUrl } from "@/seo/urls";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Indexable pages for Sri Ganesha Home Safety Solutions. Review-only URLs are omitted.",
  alternates: { canonical: absoluteUrl("/sitemap") },
  robots: { index: true, follow: true },
};

const listed = new Set(["service", "state", "city", "guide"]);

export default function SitemapPage() {
  const records = publishedRecords();
  const counts = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.kind] = (acc[record.kind] ?? 0) + 1;
    return acc;
  }, {});
  const visible = records.filter((record) => listed.has(record.kind));
  const groups = ["service", "state", "city", "guide"] as const;
  return (
    <>
      <PageHero
        eyebrow="Index"
        title="HTML sitemap"
        text="Services, cities, and guides are linked here. Neighbourhood and service-combination URLs that passed the quality gate are listed in the XML sitemap, not repeated as one enormous page."
        crumbs={[{ href: "/", label: "Home" }, { label: "Sitemap" }]}
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <p className="text-sm leading-7 text-brand-800/80">
          {records.length} published URLs are in the XML index.{" "}
          <a className="font-semibold text-brand-900 underline" href="/sitemap.xml">
            Open sitemap.xml
          </a>
          . Counts: {Object.entries(counts).map(([kind, count]) => `${kind} ${count}`).join(", ") || "registry empty"}.
        </p>
        {groups.map((kind) => {
          const items = visible.filter((record) => record.kind === kind);
          if (!items.length) return null;
          return (
            <section key={kind}>
              <h2 className="font-display text-2xl font-bold capitalize">{kind.replace("-", " ")}</h2>
              <ul className="mt-3 columns-1 gap-x-8 text-sm sm:columns-2 lg:columns-3">
                {items.map((record) => (
                  <li key={record.path} className="mb-1.5 break-inside-avoid">
                    <Link href={record.path} className="hover:text-cta-600">
                      {record.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <SiteModules />
    </>
  );
}
