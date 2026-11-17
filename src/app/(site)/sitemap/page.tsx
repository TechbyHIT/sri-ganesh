import type { Metadata } from "next";
import Link from "next/link";
import { SiteModules } from "@/components/SiteModules";
import { PageHero } from "@/components/ui";
import { publishedRecords } from "@/seo/indexable";
import { sitemapFiles } from "@/seo/sitemaps";
import { staticMetadata } from "@/seo/metadata";

export const metadata: Metadata = staticMetadata({
  title: "Sitemap",
  description: "Indexable services, districts, cities and guides for Sri Ganesha Home Safety Solutions across Andhra Pradesh. Review-only URLs are omitted.",
  path: "/sitemap",
});

const listed = new Set(["service", "state", "district", "city", "guide"]);

export default function SitemapPage() {
  const records = publishedRecords();
  const files = sitemapFiles();
  const xmlCount = files.reduce((sum, file) => sum + file.size, 0);
  const visible = records.filter((record) => listed.has(record.kind));
  const groups = ["service", "state", "district", "city", "guide"] as const;
  return (
    <>
      <PageHero
        eyebrow="Index"
        title="HTML sitemap"
        text="Services, districts, cities, and guides are linked here. Villages, neighbourhoods, and service combinations are listed in the XML sitemaps."
        crumbs={[{ href: "/", label: "Home" }, { label: "Sitemap" }]}
      />
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <p className="text-sm leading-7 text-brand-800/80">
          {xmlCount.toLocaleString("en-IN")} URLs are in the XML sitemaps.{" "}
          <a className="font-semibold text-brand-900 underline" href="/sitemap.xml">
            Open sitemap.xml
          </a>
          . {files.map((file) => `${file.name} ${file.size.toLocaleString("en-IN")}`).join(", ")}.
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
