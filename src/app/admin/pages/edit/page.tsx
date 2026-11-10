import Link from "next/link";
import { pageAt } from "@/seo/catalog";
import { recordAt } from "@/seo/indexable";
import { readStore } from "@/lib/store";
import { savePageEditAction } from "../../actions";
import { AdminTitle, Badge, Button, ButtonLink, Card, Field, FlashMessage, inputClass, statusTone, type Flash } from "../../ui";

export default async function AdminPageEdit({ searchParams }: { searchParams: Promise<Flash & { path?: string }> }) {
  const query = await searchParams;
  const path = query.path ?? "";
  const page = path ? pageAt(path) : undefined;
  if (!page) {
    return (
      <>
        <AdminTitle title="Edit page" />
        <p className="text-sm">No generated page at <code>{path || "(none)"}</code>. <Link className="text-cta-600" href="/admin/pages">Back to pages</Link></p>
      </>
    );
  }
  const edit = readStore("pageEdits")[path];
  const record = recordAt(path);
  const uploads = readStore("uploads");
  return (
    <>
      <AdminTitle
        title="Edit page"
        text={path}
        actions={
          <>
            <ButtonLink href="/admin/pages">All pages</ButtonLink>
            <a className="rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white" href={path} target="_blank" rel="noopener">Preview</a>
          </>
        }
      />
      <FlashMessage flash={query} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card title="Metadata and content">
          <form action={savePageEditAction} className="grid gap-4">
            <input type="hidden" name="path" value={path} />
            <Field label="SEO title" hint={`now ${page.title.length} characters; under 60 is safest`}>
              <input name="title" defaultValue={edit?.title} placeholder={page.title} maxLength={70} className={inputClass} />
            </Field>
            <Field label="Meta description" hint="about 140–160 characters">
              <textarea name="description" rows={3} defaultValue={edit?.description} placeholder={page.description} maxLength={200} className={inputClass} />
            </Field>
            <Field label="H1 heading">
              <input name="h1" defaultValue={edit?.h1} placeholder={page.h1} className={inputClass} />
            </Field>
            <Field label="Local note" hint="shown first on the page; blank line between paragraphs">
              <textarea name="intro" rows={6} defaultValue={edit?.intro} className={inputClass} placeholder="Something you genuinely know about this place or service: a common opening type, a society rule, a recent job (no customer names without permission)." />
            </Field>
            <Field label="Extra FAQs" hint="one per line: Question | Answer">
              <textarea name="faqs" rows={4} defaultValue={edit?.faqs?.map((item) => `${item.q} | ${item.a}`).join("\n")} className={inputClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hero image">
                <select name="image" defaultValue={edit?.image ?? ""} className={inputClass}>
                  <option value="">Automatic (from gallery)</option>
                  {uploads.map((upload) => <option key={upload.id} value={`/media/${upload.file}`}>{upload.alt.slice(0, 60)}</option>)}
                </select>
              </Field>
              <Field label="Image alt text">
                <input name="imageAlt" defaultValue={edit?.imageAlt} placeholder={page.imageAlt} className={inputClass} />
              </Field>
            </div>
            <p className="text-xs text-brand-800/60">Leave every field blank and save to remove all edits for this page.</p>
            <div><Button tone="gold">Save edits</Button></div>
          </form>
        </Card>
        <div className="space-y-6">
          <Card title="Quality gate">
            <p className="text-sm">Live status: <Badge tone={statusTone[page.status]}>{page.status}</Badge> · index: {page.index ? "yes" : "no"} · score {page.score}</p>
            {record ? <p className="mt-1 text-xs text-brand-800/60">Registry: {record.status}, version {record.version}, updated {record.updatedAt.slice(0, 10)}</p> : null}
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-brand-800/80">
              {page.reasons.map((reason) => <li key={reason}>{reason}</li>)}
            </ul>
          </Card>
          <Card title="Search preview">
            <p className="truncate text-xs text-emerald-800">{page.canonical}</p>
            <p className="mt-1 text-base font-semibold text-blue-800">{page.title} | Sri Ganesha Home Safety</p>
            <p className="mt-1 text-sm text-brand-800/80">{page.description}</p>
          </Card>
        </div>
      </div>
    </>
  );
}
