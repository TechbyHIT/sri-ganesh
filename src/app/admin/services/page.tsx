import { customServiceProblems } from "@/data/all-services";
import { services as builtIn } from "@/data/services";
import { readStore } from "@/lib/store";
import { servicePath } from "@/seo/urls";
import { deleteServiceAction, saveServiceAction } from "../actions";
import { AdminTitle, Badge, Button, Card, Field, FlashMessage, inputClass, type Flash } from "../ui";

export default async function AdminServices({ searchParams }: { searchParams: Promise<Flash & { edit?: string }> }) {
  const query = await searchParams;
  const custom = readStore("services");
  const editing = custom.find((service) => service.slug === query.edit);
  return (
    <>
      <AdminTitle
        title="Services"
        text="Built-in services are maintained in code with their own essays and photos. Add a custom service here only when it has its own real description, materials and price factors; it gets city pages after the next regeneration."
      />
      <FlashMessage flash={query} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={`Built-in (${builtIn.length})`}>
          <ul className="divide-y divide-brand-100 text-sm">
            {builtIn.map((service) => (
              <li key={service.slug} className="flex items-center justify-between py-2">
                <span className="font-medium text-brand-900">{service.name}</span>
                <a className="text-xs text-cta-600" href={servicePath(service.slug)} target="_blank" rel="noopener">{servicePath(service.slug)}</a>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={`Custom (${custom.length})`}>
          {custom.length ? (
            <ul className="divide-y divide-brand-100 text-sm">
              {custom.map((service) => {
                const problems = customServiceProblems(service);
                return (
                  <li key={service.slug} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span className="font-medium text-brand-900">{service.name}</span>
                    {problems.length ? <Badge tone="bg-amber-50 text-amber-800 ring-amber-200" >draft: {problems[0]}</Badge> : <Badge tone="bg-emerald-50 text-emerald-800 ring-emerald-200">live</Badge>}
                    <span className="flex gap-3">
                      <a className="text-cta-600" href={`/admin/services?edit=${service.slug}`}>Edit</a>
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="slug" value={service.slug} />
                        <Button tone="danger">Delete</Button>
                      </form>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-brand-800/70">No custom services yet.</p>
          )}
        </Card>
      </div>
      <Card title={editing ? `Edit ${editing.name}` : "Add a custom service"}>
        <form action={saveServiceAction} className="grid gap-4 md:grid-cols-2">
          <Field label="Name"><input name="name" required defaultValue={editing?.name} className={inputClass} /></Field>
          <Field label="Slug" hint="blank = from name"><input name="slug" defaultValue={editing?.slug} className={inputClass} /></Field>
          <Field label="Group">
            <select name="group" defaultValue={editing?.group ?? "Protection"} className={inputClass}>
              <option>Protection</option>
              <option>Bird control</option>
              <option>Utility</option>
            </select>
          </Field>
          <Field label="One-line summary"><input name="summary" defaultValue={editing?.summary} className={inputClass} /></Field>
          <div className="md:col-span-2">
            <Field label="Lede paragraph" hint="at least 40 words"><textarea name="lede" rows={3} defaultValue={editing?.lede} className={inputClass} /></Field>
          </div>
          <Field label="Problems it solves" hint="one per line"><textarea name="problems" rows={4} defaultValue={editing?.problems.join("\n")} className={inputClass} /></Field>
          <Field label="Benefits" hint="one per line"><textarea name="benefits" rows={4} defaultValue={editing?.benefits.join("\n")} className={inputClass} /></Field>
          <Field label="Where it is used" hint="one per line"><textarea name="where" rows={4} defaultValue={editing?.where.join("\n")} className={inputClass} /></Field>
          <Field label="Materials" hint="one per line"><textarea name="materials" rows={4} defaultValue={editing?.materials.join("\n")} className={inputClass} /></Field>
          <Field label="Price factors" hint="one per line"><textarea name="priceFactors" rows={4} defaultValue={editing?.priceFactors.join("\n")} className={inputClass} /></Field>
          <Field label="FAQs" hint="Question | Answer per line"><textarea name="faqs" rows={4} defaultValue={editing?.faqs.map((item) => `${item.q} | ${item.a}`).join("\n")} className={inputClass} /></Field>
          <div className="md:col-span-2"><Button tone="gold">Save service</Button></div>
        </form>
      </Card>
    </>
  );
}
