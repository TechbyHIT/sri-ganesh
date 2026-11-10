import Link from "next/link";
import { notFound } from "next/navigation";
import { cityForMandal, districtPath, getDistrict, mandalPath, ulbLabel, ulbsForMandal } from "@/data/geo";
import { placeContentFor, placeProblems } from "@/data/places";
import { localitiesIn, readStore } from "@/lib/store";
import { deleteLocalityAction } from "../../actions";
import { AdminTitle, Badge, Button, ButtonLink, Card, FlashMessage, type Flash } from "../../ui";

export default async function AdminDistrict({ params, searchParams }: { params: Promise<{ district: string }>; searchParams: Promise<Flash> }) {
  const { district: slug } = await params;
  const flash = await searchParams;
  const district = getDistrict(slug);
  if (!district) notFound();
  const localities = localitiesIn(district.slug);
  const storedIds = new Set(readStore("localities").map((row) => row.id));
  return (
    <>
      <AdminTitle
        title={`${district.name} district`}
        text={`HQ ${district.headquarters} · ${district.region} · ${district.divisions.length} revenue divisions · ${district.mandals.length} mandals · ${district.ulbs.length} urban local bodies`}
        actions={
          <>
            <ButtonLink href="/admin/locations">All districts</ButtonLink>
            <a href={districtPath(district.slug)} className="rounded-full bg-brand-900 px-4 py-2 text-sm font-semibold text-white" target="_blank" rel="noopener">Preview district page</a>
          </>
        }
      />
      <FlashMessage flash={flash} />
      {!district.verified ? (
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
          Not fully verified, so the district page stays noindex. {district.notes}
        </p>
      ) : null}
      {district.divisions.map((division) => (
        <Card key={division.slug} title={`${division.name} division`}>
          <MandalTable districtSlug={district.slug} mandalSlugs={division.mandals} />
        </Card>
      ))}
      {district.mandals.some((mandal) => !mandal.division) ? (
        <Card title="Mandals awaiting division confirmation">
          <MandalTable districtSlug={district.slug} mandalSlugs={district.mandals.filter((mandal) => !mandal.division).map((mandal) => mandal.slug)} />
        </Card>
      ) : null}
      <Card title="Urban local bodies">
        <p className="text-sm text-brand-800/80">{district.ulbs.map((ulb) => `${ulb.name} (${ulbLabel[ulb.type].toLowerCase()})`).join(", ") || "None recorded."}</p>
      </Card>
      <Card title={`Villages, colonies and localities (${localities.length})`}>
        <p className="mb-3 text-sm text-brand-800/70">Add more with <Link className="font-semibold text-cta-600" href="/admin/import">CSV import</Link>. Only rows you imported can be removed here; the official dataset is edited in the repository.</p>
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-brand-100">
              {localities.slice(0, 500).map((row) => (
                <tr key={row.id}>
                  <td className="py-1.5 font-medium text-brand-900">{row.name}</td>
                  <td>{row.kind}</td>
                  <td>{district.mandals.find((mandal) => mandal.slug === row.mandal)?.name}</td>
                  <td>{row.verified ? <Badge tone="bg-emerald-50 text-emerald-800 ring-emerald-200">official</Badge> : <Badge>unverified</Badge>}</td>
                  <td className="text-right">
                    {storedIds.has(row.id) ? (
                      <form action={deleteLocalityAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <input type="hidden" name="returnTo" value={`/admin/locations/${district.slug}`} />
                        <Button tone="danger">Remove</Button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {localities.length > 500 ? <p className="mt-2 text-xs text-brand-800/60">Showing the first 500.</p> : null}
        </div>
      </Card>
      <Card title="Sources">
        <ul className="space-y-1 text-sm">
          {district.sources.map((source) => (
            <li key={source.url}>
              <a className="text-brand-900 underline" href={source.url} target="_blank" rel="noopener">{source.title}</a>
              <span className="text-brand-800/60"> · {source.accessed} · {source.covers.join(", ")}</span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function MandalTable({ districtSlug, mandalSlugs }: { districtSlug: string; mandalSlugs: string[] }) {
  const district = getDistrict(districtSlug)!;
  return (
    <table className="w-full text-sm">
      <thead className="text-left text-xs uppercase tracking-wide text-brand-800/60">
        <tr><th className="py-2">Mandal</th><th>Town page / ULB</th><th>Villages</th><th>Local content</th><th /></tr>
      </thead>
      <tbody className="divide-y divide-brand-100">
        {mandalSlugs.map((slug) => {
          const mandal = district.mandals.find((item) => item.slug === slug);
          if (!mandal) return null;
          const content = placeContentFor(district.slug, mandal.slug);
          const town = cityForMandal(district, mandal);
          const ulbs = ulbsForMandal(district, mandal);
          const problems = content ? placeProblems(content) : [];
          return (
            <tr key={slug}>
              <td className="py-2 font-medium text-brand-900">{mandal.name}</td>
              <td className="text-brand-800/80">{[town ? `page: ${town.name}` : "", ...ulbs.map((ulb) => ulbLabel[ulb.type])].filter(Boolean).join(" · ") || "—"}</td>
              <td>{localitiesIn(district.slug, mandal.slug).filter((row) => row.kind === "village").length}</td>
              <td>
                {content?.enabled && !problems.length ? (
                  <Badge tone="bg-emerald-50 text-emerald-800 ring-emerald-200">live</Badge>
                ) : content ? (
                  <Badge tone="bg-amber-50 text-amber-800 ring-amber-200">draft</Badge>
                ) : (
                  <Badge>directory only</Badge>
                )}
              </td>
              <td className="space-x-3 text-right">
                <Link className="font-semibold text-cta-600" href={`/admin/locations/${district.slug}/${mandal.slug}`}>Edit</Link>
                <a className="text-brand-800/70" href={mandalPath(district.slug, mandal.slug)} target="_blank" rel="noopener">Preview</a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
