import fs from "fs";
import { districtByName, geoDistricts, getDistrict } from "@/data/geo";
import type { GeoDistrict, Locality, LocalityKind } from "@/data/geo-types";
import { csvRecords } from "./csv";
import { buildGeo, readRawDistrict, writeRawDistrict } from "./geo-build";
import { slugify } from "./slug";
import { allLocalities, officialLocalitiesFile, readStore, writeStore } from "./store";

export type ImportResult = {
  added: number;
  duplicates: number;
  errors: { line: number; reason: string }[];
  notes: string[];
};

const kinds = new Set<LocalityKind>(["village", "colony", "apartment", "locality"]);

function resolveDistrict(value: string) {
  return getDistrict(slugify(value)) ?? districtByName(value);
}

function resolveMandal(district: GeoDistrict, value: string) {
  const key = slugify(value);
  return district.mandals.find((mandal) => mandal.slug === key || slugify(mandal.name) === key);
}

export function localityKey(row: Pick<Locality, "district" | "mandal" | "slug" | "kind">) {
  return `${row.district}:${row.mandal}:${row.kind}:${row.slug}`;
}

function readOfficial(): Locality[] {
  const file = officialLocalitiesFile();
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as Locality[]) : [];
}

export function importLocalities(text: string, fallbackKind: LocalityKind, target: "store" | "official" = "store"): ImportResult {
  const result: ImportResult = { added: 0, duplicates: 0, errors: [], notes: [] };
  const records = csvRecords(text);
  if (!records.length) return { ...result, errors: [{ line: 1, reason: "No rows found. The first line must be a header: district,mandal,name,kind,source" }] };
  const existing = new Set(allLocalities().map(localityKey));
  const stored = target === "official" ? readOfficial() : readStore("localities");
  const now = new Date().toISOString();
  for (const { line, values } of records) {
    const district = resolveDistrict(values.district ?? "");
    if (!district) {
      result.errors.push({ line, reason: `Unknown district "${values.district ?? ""}"` });
      continue;
    }
    const mandal = resolveMandal(district, values.mandal ?? "");
    if (!mandal) {
      result.errors.push({ line, reason: `"${values.mandal ?? ""}" is not a mandal of ${district.name} in the verified list` });
      continue;
    }
    const name = (values.name ?? values.village ?? values.locality ?? "").replace(/\s+/g, " ").trim();
    if (name.length < 2) {
      result.errors.push({ line, reason: "Missing name" });
      continue;
    }
    const kind = (values.kind || fallbackKind) as LocalityKind;
    if (!kinds.has(kind)) {
      result.errors.push({ line, reason: `Kind must be village, colony, apartment or locality` });
      continue;
    }
    const source = values.source ?? values.source_url ?? "";
    if (kind === "village" && !/^https?:\/\//.test(source)) {
      result.errors.push({ line, reason: "Villages need an official source URL so the record can be verified" });
      continue;
    }
    const row: Locality = {
      id: `${district.slug}:${mandal.slug}:${kind}:${slugify(name)}`,
      slug: slugify(name),
      name,
      kind,
      district: district.slug,
      mandal: mandal.slug,
      source,
      verified: /^https?:\/\/[^/]*(\.gov\.in|\.nic\.in)\//.test(source),
      createdAt: now,
    };
    const key = localityKey(row);
    if (existing.has(key)) {
      result.duplicates += 1;
      continue;
    }
    existing.add(key);
    stored.push(row);
    result.added += 1;
  }
  if (result.added && target === "official") {
    stored.sort((a, b) => a.id.localeCompare(b.id));
    fs.writeFileSync(officialLocalitiesFile(), `${JSON.stringify(stored, null, 1)}\n`);
  } else if (result.added) writeStore("localities", stored);
  return result;
}

export function importMandals(text: string): ImportResult {
  const result: ImportResult = { added: 0, duplicates: 0, errors: [], notes: [] };
  const records = csvRecords(text);
  if (!records.length) return { ...result, errors: [{ line: 1, reason: "No rows found. The first line must be a header: district,division,mandal,source_url" }] };
  const touched = new Map<string, NonNullable<ReturnType<typeof readRawDistrict>>>();
  for (const { line, values } of records) {
    const district = resolveDistrict(values.district ?? "");
    if (!district) {
      result.errors.push({ line, reason: `Unknown district "${values.district ?? ""}"` });
      continue;
    }
    const source = values.source_url ?? values.source ?? "";
    if (!/^https?:\/\//.test(source)) {
      result.errors.push({ line, reason: "An official source URL is required for every mandal" });
      continue;
    }
    const mandalName = (values.mandal ?? "").replace(/\s+/g, " ").trim();
    const divisionName = (values.division ?? "").replace(/\s+(revenue\s+)?division$/i, "").trim();
    if (!mandalName) {
      result.errors.push({ line, reason: "Missing mandal name" });
      continue;
    }
    const raw = touched.get(district.slug) ?? readRawDistrict(district.slug);
    if (!raw) {
      result.errors.push({ line, reason: `No source file for ${district.name}` });
      continue;
    }
    touched.set(district.slug, raw);
    const all = [...(raw.revenueDivisions ?? []).flatMap((division) => division.mandals), ...(raw.unassignedMandals ?? [])];
    if (all.some((name) => slugify(name) === slugify(mandalName))) {
      result.duplicates += 1;
      continue;
    }
    if (divisionName) {
      raw.revenueDivisions ??= [];
      let division = raw.revenueDivisions.find((item) => slugify(item.name) === slugify(divisionName));
      if (!division) {
        division = { name: divisionName, mandals: [] };
        raw.revenueDivisions.push(division);
        result.notes.push(`New revenue division ${divisionName} added to ${district.name}`);
      }
      division.mandals.push(mandalName);
    } else {
      raw.unassignedMandals = [...(raw.unassignedMandals ?? []), mandalName];
    }
    raw.sources = [...(raw.sources ?? [])];
    if (!raw.sources.some((item) => item.url === source)) {
      raw.sources.push({ url: source, title: `Mandal import: ${source}`, accessed: new Date().toISOString().slice(0, 10), covers: ["mandals"] });
    }
    result.added += 1;
  }
  if (result.added) {
    for (const raw of touched.values()) writeRawDistrict(raw);
    const built = buildGeo({ write: true });
    result.notes.push(...built.problems);
    result.notes.push("The district file was rebuilt. Commit data/locations/ap and redeploy so the new mandals are compiled into the site.");
  }
  return result;
}

export function locationCounts() {
  const localities = allLocalities();
  return {
    districts: geoDistricts.length,
    divisions: geoDistricts.reduce((sum, district) => sum + district.divisions.length, 0),
    mandals: geoDistricts.reduce((sum, district) => sum + district.mandals.length, 0),
    ulbs: geoDistricts.reduce((sum, district) => sum + district.ulbs.length, 0),
    villages: localities.filter((row) => row.kind === "village").length,
    localities: localities.filter((row) => row.kind !== "village").length,
    verifiedDistricts: geoDistricts.filter((district) => district.verified).length,
  };
}
