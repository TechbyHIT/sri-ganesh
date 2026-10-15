import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InstallationGallery } from "@/components/InstallationGallery";
import { SiteModules } from "@/components/SiteModules";
import { CheckList, GoldLink, PageHero, Panel } from "@/components/ui";
import { cities } from "@/data/cities";
import { galleryCards, heroImage } from "@/data/gallery";
import { getLibraryItem, libraryGroupFor, libraryItems } from "@/data/library";
import { getService } from "@/data/services";
import { absoluteUrl } from "@/seo/urls";

type Params = { slug: string };

export function generateStaticParams() {
  return libraryItems.map((item) => ({ slug: item.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) return {};
  return { title: item.title, description: item.summary, alternates: { canonical: absoluteUrl(`/services/library/${slug}`) } };
}

export default async function LibraryDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = getLibraryItem(slug);
  if (!item) notFound();
  const group = libraryGroupFor(slug);
  const parent = getService(item.parent);
  const photo = heroImage(`library:${item.slug}`, item.photo);
  const hubs = ["visakhapatnam", "vijayawada", "guntur", "tirupati", "kakinada", "kurnool", "nellore", "rajahmundry"]
    .map((city) => cities.find((entry) => entry.slug === city))
    .filter((city) => city !== undefined);

  return (
    <>
      <PageHero
        eyebrow={group?.title ?? "Service library"}
        title={item.title}
        text={item.summary}
        image={photo}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { label: item.title },
        ]}
        actions={<GoldLink href={`/contact?service=${encodeURIComponent(item.title)}&need=photo`}>Send opening photos</GoldLink>}
      />
      <div className="bg-brand-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Panel eyebrow="This opening" title={item.title}>
            <div className="space-y-4 text-base leading-8 text-brand-800/85">
              {item.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Panel>
          <Panel title="What this page is for">
            <CheckList items={item.points} />
          </Panel>
          <Panel title="What should be in the written estimate">
            <CheckList
              items={[
                "Measured size and shape of this opening, not a statewide rate.",
                "Net or cable specification, including grade, aperture, or line count.",
                "Access, fixing surfaces, and any flap or release the household needs.",
                "Included fitting work, named separately from a different product on the same balcony.",
              ]}
            />
          </Panel>
          {group ? (
            <section>
              <h2 className="font-display text-2xl font-bold">Compare others in {group.title.toLowerCase()}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items
                  .filter((entry) => entry.slug !== item.slug)
                  .map((entry) => (
                    <Link key={entry.slug} href={`/services/library/${entry.slug}`} className="rounded-full bg-white px-3 py-2 text-sm font-medium ring-1 ring-brand-100 hover:ring-cta-500">
                      {entry.title}
                    </Link>
                  ))}
              </div>
            </section>
          ) : null}
        </div>
        <aside className="space-y-4">
          {parent ? (
            <Link href={`/services/${parent.slug}`} className="block rounded-3xl bg-brand-900 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-cta-500">Parent service</p>
              <p className="mt-2 font-display text-xl font-bold">{parent.name}</p>
              <p className="mt-2 text-sm text-white/75">{parent.summary}</p>
            </Link>
          ) : null}
          <div className="rounded-3xl bg-white p-5 ring-1 ring-brand-100">
            <p className="font-semibold">Photo estimate</p>
            <p className="mt-2 text-sm leading-6 text-brand-800/75">Send the city, a full photo of the opening, and closer photos of the fixing edges.</p>
            <Link href={`/contact?service=${encodeURIComponent(item.title)}&need=photo`} className="mt-4 inline-flex text-sm font-semibold text-cta-600">
              Send photos
            </Link>
          </div>
          <div>
            <p className="font-semibold">In these cities</p>
            <ul className="mt-2 space-y-1 text-sm">
              {hubs.map((city) => (
                <li key={city.slug}>
                  <Link href={`/services/${item.parent}/${city.slug}`} className="hover:text-cta-600">
                    {item.title} in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      </div>
      <SiteModules service={parent} />
      <InstallationGallery photos={galleryCards(item.slug, 8, item.photo)} title="Photographs of this kind of opening" />
    </>
  );
}
