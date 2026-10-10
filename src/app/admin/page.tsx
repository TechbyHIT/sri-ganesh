import { countPagesByStatus } from "@/lib/database/pages";
import { buildDraftRecords, countDraftsByType } from "@/lib/publishing/drafts";
import { getSitemapSegments } from "@/lib/sitemap-data";

export default async function AdminHomePage() {
  const drafts = countDraftsByType(buildDraftRecords());
  const database = await countPagesByStatus();
  const sitemapCount = getSitemapSegments().flat().length;

  return (
    <article>
      <h1>Publishing overview</h1>
      <p className="mt-3 max-w-3xl">
        Catalogue drafts are prepared from verified services, cities, localities, and existing pairings. They are not a 50,000-page publish.
      </p>
      <h2 className="mt-8">Drafts ready to load</h2>
      <ul className="mt-3 grid list-none gap-2 p-0">
        {Object.entries(drafts).map(([type, count]) => (
          <li key={type}>
            {type}: {count}
          </li>
        ))}
      </ul>
      <h2 className="mt-8">Database</h2>
      <p className="mt-3">
        {database
          ? `Stored rows by status: ${JSON.stringify(database.counts)}. Indexable rows: ${database.indexable}.`
          : "PostgreSQL is not connected. Counts above are catalogue drafts, not stored pages."}
      </p>
      <p className="mt-3">Live sitemap URLs: {sitemapCount}.</p>
    </article>
  );
}
