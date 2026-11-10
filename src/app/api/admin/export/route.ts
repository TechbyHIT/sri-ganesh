import { geoDistricts } from "@/data/geo";
import { adminCredentialsMatch } from "@/lib/admin-auth";
import { toCsv } from "@/lib/csv";
import { allLocalities, readStore } from "@/lib/store";
import { readRegistry } from "@/seo/registry";
import { absoluteUrl } from "@/seo/urls";

export const dynamic = "force-dynamic";

function exportFor(type: string, params: URLSearchParams): [string, string] | undefined {
  if (type === "pages" || type === "published") {
    const overrides = readStore("overrides");
    const edits = readStore("pageEdits");
    const q = (params.get("q") ?? "").toLowerCase();
    const kind = params.get("kind");
    const status = params.get("status");
    const matchesStatus = (record: { path: string; status: string }) =>
      !status || (status === "override" ? Boolean(overrides[record.path]) : status === "edited" ? Boolean(edits[record.path]) : record.status === status);
    const records = (readRegistry()?.records ?? []).filter((record) =>
      (type === "pages" || (record.status === "publish" && record.index)) &&
      (!kind || record.kind === kind) &&
      matchesStatus(record) &&
      (!q || record.path.includes(q) || record.title.toLowerCase().includes(q)),
    );
    return [
      `${type}.csv`,
      toCsv(
        ["url", "path", "kind", "status", "index", "score", "title", "override", "updated_at"],
        records.map((record) => [absoluteUrl(record.path), record.path, record.kind, record.status, String(record.index), String(record.score), record.title, overrides[record.path] ?? "", record.updatedAt]),
      ),
    ];
  }
  if (type === "locations") {
    const rows = geoDistricts.flatMap((district) =>
      district.mandals.map((mandal) => [
        district.slug,
        district.name,
        district.divisions.find((division) => division.slug === mandal.division)?.name ?? "",
        mandal.slug,
        mandal.name,
        String(district.verified),
        district.verifiedAt,
      ]),
    );
    return ["locations.csv", toCsv(["district_slug", "district", "revenue_division", "mandal_slug", "mandal", "district_verified", "verified_at"], rows)];
  }
  if (type === "localities") {
    return [
      "localities.csv",
      toCsv(
        ["id", "district", "mandal", "name", "kind", "verified", "source"],
        allLocalities().map((row) => [row.id, row.district, row.mandal, row.name, row.kind, String(row.verified), row.source]),
      ),
    ];
  }
  return undefined;
}

export function GET(request: Request) {
  if (!adminCredentialsMatch(request.headers.get("authorization"))) return new Response("Not found", { status: 404 });
  const url = new URL(request.url);
  const result = exportFor(url.searchParams.get("type") ?? "", url.searchParams);
  if (!result) return new Response("Unknown export type", { status: 400 });
  const [name, body] = result;
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
