import fs from "fs";
import path from "path";
import { sourceCities as cities } from "../src/data/cities";
import { geoDistricts } from "../src/data/geo";
import { allLocalities } from "../src/lib/store";
import type { City } from "../src/data/cities";

const covered = new Set([
  "yelamanchili",
  "anantapuramu",
  "greater-visakhapatnam",
  "palasa-kasibugga",
  "mangalagiri-tadepalli",
]);

function squash(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

const citySlugs = new Set(cities.map((city) => city.slug));
const cityNames = new Set(cities.map((city) => squash(city.name)));

const villageCount = new Map<string, number>();
for (const row of allLocalities()) {
  if (row.kind !== "village") continue;
  const key = `${row.district}/${row.mandal}`;
  villageCount.set(key, (villageCount.get(key) ?? 0) + 1);
}

const label: Record<string, string> = {
  "municipal-corporation": "municipal corporation",
  municipality: "municipality",
  "nagar-panchayat": "nagar panchayat",
};

const towns: City[] = [];
for (const district of geoDistricts) {
  const hub = cities.find((city) => city.slug === district.hubCity);
  district.ulbs.forEach((ulb, index) => {
    if (covered.has(ulb.slug) || citySlugs.has(ulb.slug) || cityNames.has(squash(ulb.name))) return;
    const mandal = district.mandals.find((item) => item.slug === ulb.slug || squash(item.name) === squash(ulb.name));
    const villages = mandal ? villageCount.get(`${district.slug}/${mandal.slug}`) ?? 0 : 0;
    const kind = label[ulb.type] ?? "urban local body";
    const place = `${ulb.name} is a ${kind} in ${district.name} district, urban body ${index + 1} of ${district.ulbs.length}.`;
    const roll = villages
      ? `The Local Government Directory records ${villages} revenue villages in ${mandal?.name} mandal.`
      : `${ulb.name} is on the official municipal list for ${district.name}. Neighbourhood pages are added only after a measured visit.`;
    const from = hub ? `Measurement visits are planned from ${hub.name}. ${hub.visitNote}` : `Measurement visits are planned from ${district.headquarters}.`;
    towns.push({
      slug: ulb.slug,
      name: ulb.name,
      region: district.region,
      district: district.name,
      intro: `${place} ${roll} ${from}`,
      climate: hub?.climate ?? `${district.region} weather. The grade is chosen for this opening, not copied from a statewide chart.`,
      housing: `houses and low-rise buildings in this ${kind}`,
      materialHint: hub?.materialHint ?? "The quote names the steel grade, the mesh and the edge fixing after measurement.",
      visitNote: from,
      localities: mandal ? [`${mandal.name} mandal`, `${kind}`] : [kind, district.region],
      areas: [],
    });
  });
}

const body = towns
  .map((town) => {
    const fields = [
      ["slug", town.slug],
      ["name", town.name],
      ["region", town.region],
      ["district", town.district],
      ["intro", town.intro],
      ["climate", town.climate],
      ["housing", town.housing],
      ["materialHint", town.materialHint],
      ["visitNote", town.visitNote],
    ] as const;
    const lines = fields.map(([key, value]) => `    ${key}: ${JSON.stringify(value)},`).join("\n");
    const localities = town.localities.map((item) => JSON.stringify(item)).join(", ");
    return `  {\n${lines}\n    localities: [${localities}],\n    areas: [],\n  }`;
  })
  .join(",\n");

const file = `import type { City } from "./cities";

// Official urban local bodies that had no city page. Regenerated with scripts/build-ulb-towns.ts.
export const ulbTowns: City[] = [
${body}
];
`;

fs.writeFileSync(path.join(process.cwd(), "src", "data", "ulb-towns.ts"), file);
console.log(JSON.stringify({ added: towns.length, slugs: towns.map((town) => town.slug) }, null, 1));
