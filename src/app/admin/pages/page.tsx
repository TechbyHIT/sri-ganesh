import Link from "next/link";
import { readRegistry } from "@/seo/registry";
import { readStore } from "@/lib/store";
import { bulkStatusAction } from "../actions";
import { AdminTitle, Badge, Button, FlashMessage, inputClass, statusTone, type Flash } from "../ui";

const perPage = 100;

type Query = Flash & { kind?: string; status?: string; q?: string; page?: string };

export default async function AdminPages({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const registry = readRegistry();
  const records = registry?.records ?? [];
  const overrides = readStore("overrides");
  const edits = readStore("pageEdits");
  const kinds = [...new Set(records.map((record) => record.kind))].sort();
  const needle = (query.q ?? "").toLowerCase().trim();
  const filtered = records.filter((record) =>
    (!query.kind || record.kind === query.kind) &&
    (!query.status || (query.status === "override" ? Boolean(overrides[record.path]) : query.status === "edited" ? Boolean(edits[record.path]) : record.status === query.status)) &&
    (!needle || record.path.includes(needle) || record.title.toLowerCase().includes(needle)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const page = Math.min(pages, Math.max(1, Number(query.page) || 1));
  const shown = filtered.slice((page - 1) * perPage, page * perPage);
  const filterParams = new URLSearchParams(Object.entries({ kind: query.kind ?? "", status: query.status ?? "", q: query.q ?? "" }).filter(([, value]) => value));
  const pageHref = (target: number) => `/admin/pages?${new URLSearchParams([...filterParams, ["page", String(target)]]).toString()}`;
  const returnTo = `/admin/pages?${new URLSearchParams([...filterParams, ["page", String(page)]]).toString()}`;
  return (
    <>
      <AdminTitle
        title="SEO pages"
        text={`${records.length.toLocaleString("en-IN")} generated pages in the registry${registry ? ` (${registry.generatedAt.slice(0, 10)})` : ""}. Override the quality gate only when you have checked the page yourself.`}
        actions={<a className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-900 ring-1 ring-brand-100" href={`/api/admin/export?type=pages&${filterParams.toString()}`}>Export this view (CSV)</a>}
      />
      <FlashMessage flash={query} />
      <form className="grid gap-3 rounded-2xl border border-brand-100 bg-white p-4 sm:grid-cols-[1fr_180px_180px_auto]" method="get">
        <input name="q" defaultValue={query.q} placeholder="Path or title contains…" className={inputClass} />
        <select name="kind" defaultValue={query.kind ?? ""} className={inputClass}>
          <option value="">All types</option>
          {kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
        </select>
        <select name="status" defaultValue={query.status ?? ""} className={inputClass}>
          <option value="">Any status</option>
          <option value="publish">Published</option>
          <option value="review">Review (noindex)</option>
          <option value="override">Manually overridden</option>
          <option value="edited">Edited</option>
        </select>
        <Button>Filter</Button>
      </form>
      <form action={bulkStatusAction} className="space-y-3">
        <input type="hidden" name="returnTo" value={returnTo} />
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-brand-800/70">{filtered.length.toLocaleString("en-IN")} match · selected rows:</span>
          <Button tone="light" name="action" value="publish">Force publish</Button>
          <Button tone="light" name="action" value="review">Hold for review (noindex)</Button>
          <Button tone="danger" name="action" value="exclude">Unpublish (404)</Button>
          <Button tone="light" name="action" value="clear">Clear override</Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-brand-50 text-left text-xs uppercase tracking-wide text-brand-800/60">
              <tr><th className="w-8 px-3 py-3" /><th>Path</th><th>Type</th><th>Status</th><th>Score</th><th>Title</th><th>Updated</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-brand-100">
              {shown.map((record) => (
                <tr key={record.path} className="align-top hover:bg-brand-50/60">
                  <td className="px-3 py-2"><input type="checkbox" name="path" value={record.path} aria-label={`Select ${record.path}`} /></td>
                  <td className="py-2 font-mono text-xs"><a className="text-brand-900 hover:text-cta-600" href={record.path} target="_blank" rel="noopener">{record.path}</a></td>
                  <td className="py-2">{record.kind}</td>
                  <td className="py-2">
                    <Badge tone={statusTone[record.status]}>{record.status}</Badge>
                    {overrides[record.path] ? <span className="ml-1"><Badge>override: {overrides[record.path]}</Badge></span> : null}
                    {edits[record.path] ? <span className="ml-1"><Badge>edited</Badge></span> : null}
                  </td>
                  <td className="py-2">{record.score}</td>
                  <td className="max-w-xs py-2" title={record.reasons.join("\n")}>{record.title}</td>
                  <td className="py-2 text-xs">{record.updatedAt.slice(0, 10)}</td>
                  <td className="py-2 pr-3 text-right"><Link className="font-semibold text-cta-600" href={`/admin/pages/edit?path=${encodeURIComponent(record.path)}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>
      {pages > 1 ? (
        <nav aria-label="Pages" className="flex items-center justify-between text-sm font-semibold">
          {page > 1 ? <Link href={pageHref(page - 1)}>← Previous</Link> : <span />}
          <span className="text-brand-800/60">Page {page} of {pages}</span>
          {page < pages ? <Link href={pageHref(page + 1)}>Next →</Link> : <span />}
        </nav>
      ) : null}
    </>
  );
}
