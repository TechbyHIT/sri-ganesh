import { notFound } from "next/navigation";
import { allServices } from "@/data/all-services";
import { cityForMandal, getMandal, hubCityOf, mandalPath } from "@/data/geo";
import { minimumPlaceWords, placeContentFor, placeProblems } from "@/data/places";
import { readStore } from "@/lib/store";
import { serviceCityPath } from "@/seo/urls";
import { savePlaceAction } from "../../../actions";
import { AdminTitle, Button, ButtonLink, Card, Field, FlashMessage, inputClass, type Flash } from "../../../ui";

export default async function AdminMandal({ params, searchParams }: { params: Promise<{ district: string; mandal: string }>; searchParams: Promise<Flash> }) {
  const { district: districtSlug, mandal: mandalSlug } = await params;
  const flash = await searchParams;
  const found = getMandal(districtSlug, mandalSlug);
  if (!found) notFound();
  const { district, mandal, division } = found;
  const content = placeContentFor(district.slug, mandal.slug);
  const hub = hubCityOf(district);
  const town = cityForMandal(district, mandal);
  const services = allServices();
  const uploads = readStore("uploads");
  const chosen = new Set(content?.services ?? []);
  const photos = new Set(content?.photos ?? []);
  const problems = content ? placeProblems(content) : [];
  return (
    <>
      <AdminTitle
        title={`${mandal.name} mandal`}
        text={`${district.name} district${division ? ` · ${division.name} revenue division` : ""}. Without local content this is a noindex directory page. Write what you genuinely know about homes here and enable it to generate service pages for this mandal.`}
        actions={
          <>
            <ButtonLink href={`/admin/locations/${district.slug}`}>Back to {district.name}</ButtonLink>
            <a href={mandalPath(district.slug, mandal.slug)} target="_blank" rel="noopener" className="rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white">Preview page</a>
          </>
        }
      />
      <FlashMessage flash={flash} />
      {town ? (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-800 ring-1 ring-brand-100">
          {town.name} already has a full town page. Only add mandal content if you can describe the rest of the mandal differently from the town.
        </p>
      ) : null}
      {problems.length ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">Not generating pages yet: {problems.join("; ")}.</p>
      ) : null}
      <form action={savePlaceAction} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <input type="hidden" name="district" value={district.slug} />
        <input type="hidden" name="mandal" value={mandal.slug} />
        <Card title="Local content">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Display name"><input name="name" defaultValue={content?.name ?? mandal.name} className={inputClass} /></Field>
              <Field label="URL slug" hint="used in /services/{service}/{slug}"><input name="slug" defaultValue={content?.slug ?? mandal.slug} className={inputClass} /></Field>
            </div>
            <Field label="Local introduction" hint={`at least ${minimumPlaceWords.intro} words, specific to this mandal`}>
              <textarea name="intro" rows={5} defaultValue={content?.intro} className={inputClass} placeholder="What the housing and openings are actually like here, which parts of the mandal you have worked in, what families ask for." />
            </Field>
            <Field label="Housing" hint="e.g. independent houses, G+2 rentals, a few new apartment blocks">
              <input name="housing" defaultValue={content?.housing} className={inputClass} />
            </Field>
            <Field label="Climate note" hint={`optional — defaults to the ${hub?.name ?? "hub"} note`}>
              <textarea name="climate" rows={2} defaultValue={content?.climate} className={inputClass} placeholder={hub?.climate} />
            </Field>
            <Field label="Material note" hint="optional — what the quote should name here">
              <textarea name="materialHint" rows={2} defaultValue={content?.materialHint} className={inputClass} placeholder={hub?.materialHint} />
            </Field>
            <Field label="Visit note" hint={`at least ${minimumPlaceWords.visitNote} words — how visits are actually scheduled`}>
              <textarea name="visitNote" rows={2} defaultValue={content?.visitNote} className={inputClass} placeholder={hub?.visitNote} />
            </Field>
            <Field label="Colonies and localities you serve" hint="one per line">
              <textarea name="localities" rows={4} defaultValue={content?.localities.join("\n")} className={inputClass} />
            </Field>
          </div>
        </Card>
        <div className="space-y-6">
          <Card title="Publish">
            <label className="flex items-center gap-2 text-sm font-semibold text-brand-900">
              <input type="checkbox" name="enabled" defaultChecked={content?.enabled} /> Generate pages for this mandal
            </label>
            <p className="mt-2 text-xs leading-5 text-brand-800/60">Pages still pass through the quality gate. Thin or duplicate text stays noindex.</p>
            <div className="mt-4"><Button tone="gold">Save</Button></div>
          </Card>
          <Card title="Services offered here">
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {services.map((service) => (
                <label key={service.slug} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="services" value={service.slug} defaultChecked={!content || chosen.has(service.slug)} />
                  {service.name}
                  {content?.enabled && !problems.length && chosen.has(service.slug) ? (
                    <a className="ml-auto text-xs text-cta-600" href={serviceCityPath(service.slug, content.slug)} target="_blank" rel="noopener">view</a>
                  ) : null}
                </label>
              ))}
            </div>
          </Card>
          <Card title="Project photos from this mandal">
            {uploads.length ? (
              <div className="grid grid-cols-2 gap-2">
                {uploads.map((upload) => (
                  <label key={upload.id} className="block text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/media/${upload.file}`} alt={upload.alt} className="h-20 w-full rounded-lg object-cover" loading="lazy" />
                    <span className="mt-1 flex items-center gap-1"><input type="checkbox" name="photos" value={upload.id} defaultChecked={photos.has(upload.id)} /> use</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-800/70">Upload genuine project photos under Images first.</p>
            )}
          </Card>
        </div>
      </form>
    </>
  );
}
