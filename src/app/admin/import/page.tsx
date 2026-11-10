import { importAction } from "../actions";
import { AdminTitle, Button, Card, Field, FlashMessage, inputClass, type Flash } from "../ui";

const examples = {
  villages: "district,mandal,name,kind,source\nntr,Kanchikacherla,Paritala,village,https://ntr.ap.gov.in/...",
  localities: "district,mandal,name,kind,source\nvisakhapatnam,Madhurawada,Sai Priya Residency,apartment,\nntr,Vijayawada Central,Satyanarayanapuram,colony,",
  mandals: "district,division,mandal,source_url\nsri-sathya-sai,Kadiri,Talupula,https://srisathyasai.ap.gov.in/...",
};

export default async function AdminImport({ searchParams }: { searchParams: Promise<Flash> }) {
  const flash = await searchParams;
  return (
    <>
      <AdminTitle
        title="Import CSV"
        text="Rows are matched to the verified district and mandal list. Unknown districts or mandals are rejected, duplicates are skipped, and villages need an official source URL. Nothing is invented to fill gaps."
      />
      <FlashMessage flash={flash} />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card title="Upload">
          <form action={importAction} className="grid gap-4">
            <Field label="What are you importing?">
              <select name="type" className={inputClass} defaultValue="village">
                <option value="village">Villages (official list)</option>
                <option value="colony">Colonies</option>
                <option value="apartment">Apartment communities</option>
                <option value="locality">Residential localities</option>
                <option value="mandals">Mandals and revenue divisions (structural change)</option>
              </select>
            </Field>
            <Field label="CSV file" hint="UTF-8, first row is the header">
              <input type="file" name="file" accept=".csv,text/csv" className={inputClass} />
            </Field>
            <Field label="…or paste CSV">
              <textarea name="csv" rows={8} className={`${inputClass} font-mono text-xs`} />
            </Field>
            <div><Button tone="gold">Import</Button></div>
          </form>
        </Card>
        <div className="space-y-6">
          <Card title="Villages">
            <pre className="overflow-x-auto rounded-xl bg-brand-50 p-3 text-xs">{examples.villages}</pre>
            <p className="mt-2 text-xs leading-5 text-brand-800/70">The kind column is optional; the selected type is used when it is blank. District accepts the slug or the official name.</p>
          </Card>
          <Card title="Colonies, apartments, localities">
            <pre className="overflow-x-auto rounded-xl bg-brand-50 p-3 text-xs">{examples.localities}</pre>
            <p className="mt-2 text-xs leading-5 text-brand-800/70">Only add places you actually serve. These appear on the mandal page and in location search.</p>
          </Card>
          <Card title="Mandals">
            <pre className="overflow-x-auto rounded-xl bg-brand-50 p-3 text-xs">{examples.mandals}</pre>
            <p className="mt-2 text-xs leading-5 text-brand-800/70">Updates the district source files and rebuilds districts.json. Commit and redeploy for the change to reach the live site.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
