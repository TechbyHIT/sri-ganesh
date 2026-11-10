import Link from "next/link";
import { allServices } from "@/data/all-services";
import { cities } from "@/data/cities";
import { promotedPlaces } from "@/data/places";
import { duplicateReport, lastContentChange, registrySummary } from "@/lib/admin";
import { locationCounts } from "@/lib/imports";
import { readStore, storeDir } from "@/lib/store";
import { sitemapFiles } from "@/seo/sitemaps";
import { regenerateAction } from "./actions";
import { AdminTitle, Button, Card, FlashMessage, Stat, type Flash } from "./ui";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Flash> }) {
  const flash = await searchParams;
  const registry = registrySummary();
  const locations = locationCounts();
  const services = allServices();
  const custom = readStore("services").length;
  const promoted = promotedPlaces().length;
  const overrides = Object.keys(readStore("overrides")).length;
  const edits = Object.keys(readStore("pageEdits")).length;
  const duplicates = duplicateReport();
  const changed = lastContentChange();
  const stale = Boolean(changed && registry.generatedAt && changed > registry.generatedAt);
  const sitemaps = sitemapFiles();
  return (
    <>
      <AdminTitle
        title="Dashboard"
        text="Location database, generated SEO pages and what is currently indexable. Pages publish only after the quality gate passes; everything else is served with noindex and kept out of the sitemaps."
        actions={
          <>
            <a className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900 ring-1 ring-brand-100" href="/api/admin/export?type=published">Export published URLs</a>
            <a className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900 ring-1 ring-brand-100" href="/api/admin/export?type=pages">Export all pages</a>
          </>
        }
      />
      <FlashMessage flash={flash} />
      {stale ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          Content was edited after the last registry generation ({changed.slice(0, 16).replace("T", " ")} UTC). Regenerate so sitemaps and index decisions catch up.
        </p>
      ) : null}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Generated pages" value={registry.total} note={registry.generatedAt ? `Registry ${registry.generatedAt.slice(0, 16).replace("T", " ")} UTC` : "Not generated yet"} />
        <Stat label="Published (indexable)" value={registry.published} />
        <Stat label="Held for review (noindex)" value={registry.review} />
        <Stat label="Sitemap files" value={sitemaps.length} note={sitemaps.map((file) => `${file.name}: ${file.size}`).join(" · ")} />
      </section>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Districts" value={locations.districts} note={`${locations.verifiedDistricts} fully verified`} />
        <Stat label="Revenue divisions" value={locations.divisions} />
        <Stat label="Mandals" value={locations.mandals} note={`${promoted} with local content`} />
        <Stat label="Urban local bodies" value={locations.ulbs} />
        <Stat label="Villages on record" value={locations.villages} />
        <Stat label="Colonies and localities" value={locations.localities} note={`plus ${cities.reduce((sum, city) => sum + city.areas.length, 0)} neighbourhood pages`} />
        <Stat label="Services" value={services.length} note={custom ? `${custom} custom` : "all built-in"} />
        <Stat label="Manual overrides · page edits" value={`${overrides} · ${edits}`} />
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Pages by type">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-brand-800/60">
              <tr><th className="py-2">Type</th><th>Published</th><th>Review</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {registry.byKind.map(([kind, counts]) => (
                <tr key={kind}>
                  <td className="py-2 font-medium text-brand-900">{kind}</td>
                  <td>{counts.publish.toLocaleString("en-IN")}</td>
                  <td>{counts.review.toLocaleString("en-IN")}</td>
                  <td className="text-right"><Link className="text-cta-600" href={`/admin/pages?kind=${kind}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Regenerate">
          <p className="text-sm leading-6 text-brand-800/75">
            Rebuilds every page from the location database, services and your edits, runs the quality gate, and rewrites the registry that drives index decisions and sitemaps. Takes about 20 seconds.
          </p>
          <form action={regenerateAction} className="mt-4">
            <Button tone="gold">Regenerate registry now</Button>
          </form>
          <p className="mt-4 text-xs leading-5 text-brand-800/60">Content store: {storeDir()}</p>
        </Card>
      </div>
      <Card title="Duplicate detection">
        <ul className="space-y-2 text-sm">
          <li><strong>Duplicate URLs:</strong> {duplicates.paths.length ? duplicates.paths.join("; ") : "none"}</li>
          <li><strong>Duplicate titles among published pages:</strong> {duplicates.titles.length ? duplicates.titles.slice(0, 10).join("; ") : "none"}</li>
          <li><strong>Place slug collisions:</strong> {duplicates.slugs.length ? duplicates.slugs.join("; ") : "none"}</li>
          <li><strong>Duplicate villages or localities:</strong> {duplicates.localities.length ? duplicates.localities.slice(0, 10).join("; ") : "none"}</li>
        </ul>
      </Card>
    </>
  );
}
