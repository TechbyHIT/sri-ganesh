import { listPages } from "@/lib/database/pages";
import Link from "next/link";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ cursor?: string }>;
}) {
  const { cursor } = await searchParams;
  const page = await listPages(cursor, 25);

  return (
    <article>
      <h1>Page records</h1>
      {page.database ? null : <p className="mt-3">Connect PostgreSQL to browse stored page records. Nothing is loaded into memory in bulk.</p>}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="border-b border-line p-2">Path</th>
              <th className="border-b border-line p-2">Status</th>
              <th className="border-b border-line p-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {page.items.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-line p-2">{item.path}</td>
                <td className="border-b border-line p-2">{item.publicationStatus}</td>
                <td className="border-b border-line p-2">{item.qualityScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {page.nextCursor ? (
        <p className="mt-4">
          <Link className="font-bold text-teal" href={`/admin/pages?cursor=${page.nextCursor}`}>
            Next page
          </Link>
        </p>
      ) : null}
    </article>
  );
}
