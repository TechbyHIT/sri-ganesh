import Link from "next/link";
import { geo, geoDistricts, hubCityOf } from "@/data/geo";
import { promotedPlaces } from "@/data/places";
import { allLocalities } from "@/lib/store";
import { AdminTitle, Badge, FlashMessage, type Flash } from "../ui";

export default async function AdminLocations({ searchParams }: { searchParams: Promise<Flash> }) {
  const flash = await searchParams;
  const localities = allLocalities();
  const promoted = promotedPlaces();
  return (
    <>
      <AdminTitle
        title="Locations"
        text={`Andhra Pradesh → districts → revenue divisions → mandals. Structure follows ${geo.reorganisation} District files compiled ${geo.generatedAt.slice(0, 10)}.`}
      />
      <FlashMessage flash={flash} />
      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-brand-50 text-left text-xs uppercase tracking-wide text-brand-800/60">
            <tr>
              <th className="px-4 py-3">District</th>
              <th>Region</th>
              <th>Hub</th>
              <th>Divisions</th>
              <th>Mandals</th>
              <th>ULBs</th>
              <th>Villages / localities</th>
              <th>Local content</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {geoDistricts.map((district) => {
              const rows = localities.filter((row) => row.district === district.slug);
              return (
                <tr key={district.slug} className="hover:bg-brand-50/60">
                  <td className="px-4 py-3 font-semibold"><Link className="text-brand-900 hover:text-cta-600" href={`/admin/locations/${district.slug}`}>{district.name}</Link></td>
                  <td>{district.region}</td>
                  <td>{hubCityOf(district)?.name ?? "—"}</td>
                  <td>{district.divisions.length}</td>
                  <td>{district.mandals.length}</td>
                  <td>{district.ulbs.length}</td>
                  <td>{rows.filter((row) => row.kind === "village").length} / {rows.filter((row) => row.kind !== "village").length}</td>
                  <td>{promoted.filter((place) => place.district === district.name).length}</td>
                  <td>{district.verified ? <Badge tone="bg-emerald-50 text-emerald-800 ring-emerald-200">verified {district.verifiedAt}</Badge> : <Badge tone="bg-amber-50 text-amber-800 ring-amber-200">needs check</Badge>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
