import fs from "fs";
import path from "path";
import { cities } from "@/data/cities";
import type { GeoDistrict, GeoFile, GeoRegion, UlbType } from "@/data/geo-types";
import { slugify } from "./slug";

const root = path.join(process.cwd(), "data", "locations", "ap");
export const rawDir = path.join(root, "raw");
export const districtsFile = path.join(root, "districts.json");

const expected = [
  "alluri-sitharama-raju", "anakapalli", "ananthapuramu", "annamayya", "bapatla", "chittoor", "konaseema",
  "east-godavari", "eluru", "guntur", "kakinada", "krishna", "kurnool", "markapuram", "nandyal", "ntr",
  "palnadu", "parvathipuram-manyam", "polavaram", "prakasam", "nellore", "sri-sathya-sai", "srikakulam",
  "tirupati", "visakhapatnam", "vizianagaram", "west-godavari", "ysr-kadapa",
];

const regions: Record<string, GeoRegion> = {
  srikakulam: "Uttarandhra", vizianagaram: "Uttarandhra", "parvathipuram-manyam": "Uttarandhra",
  "alluri-sitharama-raju": "Uttarandhra", visakhapatnam: "Uttarandhra", anakapalli: "Uttarandhra",
  polavaram: "Coastal Andhra", kakinada: "Coastal Andhra", konaseema: "Coastal Andhra", "east-godavari": "Coastal Andhra",
  eluru: "Coastal Andhra", "west-godavari": "Coastal Andhra", krishna: "Coastal Andhra", ntr: "Coastal Andhra",
  guntur: "Coastal Andhra", bapatla: "Coastal Andhra", palnadu: "Coastal Andhra", prakasam: "Coastal Andhra",
  markapuram: "Coastal Andhra", nellore: "Coastal Andhra",
  tirupati: "Rayalaseema", chittoor: "Rayalaseema", annamayya: "Rayalaseema", "ysr-kadapa": "Rayalaseema",
  ananthapuramu: "Rayalaseema", "sri-sathya-sai": "Rayalaseema", kurnool: "Rayalaseema", nandyal: "Rayalaseema",
};

// City page we schedule each district's visits from. Must be a slug in src/data/cities.
const hubs: Record<string, string> = {
  srikakulam: "srikakulam", vizianagaram: "vizianagaram", "parvathipuram-manyam": "parvathipuram",
  "alluri-sitharama-raju": "narsipatnam", visakhapatnam: "visakhapatnam", anakapalli: "anakapalle",
  polavaram: "rajahmundry", kakinada: "kakinada", konaseema: "amalapuram", "east-godavari": "rajahmundry",
  eluru: "eluru", "west-godavari": "bhimavaram", krishna: "machilipatnam", ntr: "vijayawada", guntur: "guntur",
  bapatla: "chirala", palnadu: "narasaraopet", prakasam: "ongole", markapuram: "ongole", nellore: "nellore",
  tirupati: "tirupati", chittoor: "chittoor", annamayya: "madanapalle", "ysr-kadapa": "kadapa",
  ananthapuramu: "anantapur", "sri-sathya-sai": "hindupur", kurnool: "kurnool", nandyal: "nandyal",
};

export type RawDistrict = {
  name: string;
  slug: string;
  headquarters: string;
  officialSite?: string;
  revenueDivisions?: { name: string; mandals: string[] }[];
  unassignedMandals?: string[];
  urbanLocalBodies?: { name: string; type: string }[];
  sources?: { url: string; title?: string; accessed?: string; covers?: string[] }[];
  notes?: string;
  verified?: boolean;
};

const ulbTypes = new Set<UlbType>(["municipal-corporation", "municipality", "nagar-panchayat"]);

function compile(raw: RawDistrict): { district: GeoDistrict; problems: string[] } {
  const problems: string[] = [];
  const slug = raw.slug;
  const seenMandals = new Map<string, string>();
  const divisions = (raw.revenueDivisions ?? []).map((division) => {
    const divisionSlug = slugify(division.name.replace(/\s+(revenue\s+)?division$/i, ""));
    const mandals: string[] = [];
    for (const name of division.mandals) {
      const mandalSlug = slugify(name);
      if (seenMandals.has(mandalSlug)) {
        problems.push(`${slug}: mandal ${name} listed twice (${seenMandals.get(mandalSlug)} and ${division.name})`);
        continue;
      }
      seenMandals.set(mandalSlug, division.name);
      mandals.push(mandalSlug);
    }
    return { slug: divisionSlug, name: division.name.replace(/\s+(revenue\s+)?division$/i, "").trim(), mandals };
  });
  const mandalNames = new Map<string, string>();
  for (const division of raw.revenueDivisions ?? []) for (const name of division.mandals) mandalNames.set(slugify(name), name.trim());
  for (const name of raw.unassignedMandals ?? []) {
    const mandalSlug = slugify(name);
    if (seenMandals.has(mandalSlug)) continue;
    seenMandals.set(mandalSlug, "");
    mandalNames.set(mandalSlug, name.trim());
  }
  const divisionOf = new Map<string, string>();
  for (const division of divisions) for (const mandal of division.mandals) divisionOf.set(mandal, division.slug);
  const mandals = [...mandalNames.entries()].map(([mandalSlug, name]) => ({
    slug: mandalSlug,
    name,
    division: divisionOf.get(mandalSlug) ?? null,
  }));
  const seenUlbs = new Set<string>();
  const ulbs = (raw.urbanLocalBodies ?? []).flatMap((ulb) => {
    const ulbSlug = slugify(ulb.name);
    if (seenUlbs.has(ulbSlug)) return [];
    seenUlbs.add(ulbSlug);
    const type = ulbTypes.has(ulb.type as UlbType) ? (ulb.type as UlbType) : "municipality";
    if (!ulbTypes.has(ulb.type as UlbType)) problems.push(`${slug}: unknown ULB type "${ulb.type}" for ${ulb.name}`);
    return [{ slug: ulbSlug, name: ulb.name.trim(), type }];
  });
  if (!mandals.length) problems.push(`${slug}: no mandals`);
  if (!divisions.length) problems.push(`${slug}: no revenue divisions`);
  const accessed = (raw.sources ?? []).map((source) => source.accessed ?? "").filter(Boolean).sort();
  return {
    problems,
    district: {
      slug,
      name: raw.name.trim(),
      headquarters: raw.headquarters.trim(),
      region: regions[slug],
      hubCity: hubs[slug],
      officialSite: raw.officialSite ?? "",
      divisions,
      mandals,
      ulbs,
      sources: (raw.sources ?? []).map((source) => ({
        url: source.url,
        title: source.title ?? source.url,
        accessed: source.accessed ?? "",
        covers: source.covers ?? [],
      })),
      notes: raw.notes ?? "",
      verified: Boolean(raw.verified),
      verifiedAt: accessed.at(-1) ?? "",
    },
  };
}

function norm(value: string) {
  return value.toLowerCase().replace(/\b(urban|rural|town|municipal corporation|municipality)\b/g, "").replace(/[^a-z]/g, "");
}

function close(left: string, right: string) {
  const a = norm(left);
  const b = norm(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  return short.length >= 5 && long.startsWith(short.slice(0, Math.max(5, short.length - 2))) && long.length - short.length <= 3;
}

export function readRawDistrict(slug: string): RawDistrict | undefined {
  const file = path.join(rawDir, `${slug}.json`);
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as RawDistrict) : undefined;
}

export function writeRawDistrict(raw: RawDistrict) {
  fs.writeFileSync(path.join(rawDir, `${raw.slug}.json`), `${JSON.stringify(raw, null, 2)}\n`);
}

export function buildGeo({ write }: { write: boolean }) {
  if (!fs.existsSync(rawDir)) throw new Error(`Missing ${rawDir}`);
  const files = fs.readdirSync(rawDir).filter((file) => file.endsWith(".json"));
  const problems: string[] = [];
  const districts: GeoDistrict[] = [];
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(rawDir, file), "utf8")) as RawDistrict;
    if (!expected.includes(raw.slug)) {
      problems.push(`${file}: unexpected district slug ${raw.slug}`);
      continue;
    }
    const compiled = compile(raw);
    problems.push(...compiled.problems);
    districts.push(compiled.district);
  }
  for (const slug of expected) if (!districts.some((district) => district.slug === slug)) problems.push(`missing district ${slug}`);
  for (const district of districts) {
    if (!cities.some((city) => city.slug === district.hubCity)) problems.push(`${district.slug}: hub city ${district.hubCity} not in cities`);
  }
  districts.sort((a, b) => expected.indexOf(a.slug) - expected.indexOf(b.slug));

  const placement = cities.map((city) => {
    const matches = districts.filter((district) =>
      district.mandals.some((mandal) => close(mandal.name, city.name)) || district.ulbs.some((ulb) => close(ulb.name, city.name)),
    );
    return { city: city.slug, name: city.name, stated: city.district, matched: matches.map((district) => district.name) };
  });
  const mismatched = placement.filter((row) => row.matched.length && !row.matched.some((name) => close(name, row.stated) || name.includes(row.stated) || row.stated.includes(name)));
  const unmatched = placement.filter((row) => !row.matched.length);

  const file: GeoFile = {
    state: { slug: "andhra-pradesh", name: "Andhra Pradesh" },
    generatedAt: new Date().toISOString(),
    reorganisation: "Andhra Pradesh G.O.Ms. No. 517 and related Revenue (Lands-IV) notifications of 30 December 2025, effective 31 December 2025 (28 districts).",
    districts,
  };
  const summary = {
    districts: districts.length,
    divisions: districts.reduce((sum, district) => sum + district.divisions.length, 0),
    mandals: districts.reduce((sum, district) => sum + district.mandals.length, 0),
    ulbs: districts.reduce((sum, district) => sum + district.ulbs.length, 0),
    verified: districts.filter((district) => district.verified).length,
  };
  const fatal = problems.some((problem) => problem.startsWith("missing district"));
  if (write && !fatal) fs.writeFileSync(districtsFile, `${JSON.stringify(file, null, 1)}\n`);
  return { file, summary, problems, mismatched, unmatched, fatal };
}
