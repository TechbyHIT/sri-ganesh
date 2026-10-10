import { readFileSync, writeFileSync } from "node:fs";

const verifiedAt = "2026-10-09";

const jobs = [
  {
    key: "ananthapuramu",
    mandalUrl: "https://ananthapuramu.ap.gov.in/mandals/",
    divisionUrl: "https://ananthapuramu.ap.gov.in/subdivision-blocks/",
  },
  {
    key: "annamayya",
    mandalUrl: "https://annamayya.ap.gov.in/mandals/",
    divisionUrl: "https://annamayya.ap.gov.in/revenue-division/",
    stripMandalPrefix: /^MRO\s+/i,
  },
  {
    key: "bapatla",
    mandalUrl: "https://bapatla.ap.gov.in/tehsil/",
  },
  {
    key: "eluru",
    mandalUrl: "https://eluru.ap.gov.in/tehsil/",
  },
  {
    key: "kakinada",
    mandalUrl: "https://kakinada.ap.gov.in/about-district/administrative-setup/mandal/",
    villageUrl: "https://kakinada.ap.gov.in/about-district/administrative-setup/village-panchayats/",
  },
  {
    key: "konaseema",
    mandalUrl: "https://konaseema.ap.gov.in/about-district/administrative-setup/mandals/",
    villageUrl: "https://konaseema.ap.gov.in/about-district/administrative-setup/village-panchayats/",
  },
  {
    key: "nandyal",
    mandalUrl: "https://nandyal.ap.gov.in/mandal/",
    divisionUrl: "https://nandyal.ap.gov.in/revenue-divisions/",
    villageUrl: "https://nandyal.ap.gov.in/village-panchayats/",
  },
  {
    key: "palnadu",
    mandalUrl: "https://palnadu.ap.gov.in/subdivision-blocks/",
    divisionUrl: "https://palnadu.ap.gov.in/tehsil/",
    villageUrl: "https://palnadu.ap.gov.in/village-panchayats/",
  },
  {
    key: "parvathipuram-manyam",
    mandalUrl: "https://parvathipurammanyam.ap.gov.in/tehsil/",
  },
  {
    key: "prakasam",
    mandalUrl: "https://prakasam.ap.gov.in/tehsil/",
    villageUrl: "https://prakasam.ap.gov.in/village-panchayats/",
  },
  {
    key: "sri-sathya-sai",
    mandalUrl: "https://srisathyasai.ap.gov.in/mandal/",
    divisionUrl: "https://srisathyasai.ap.gov.in/revenue-divisions/",
    villageUrl: "https://srisathyasai.ap.gov.in/village-panchayats/",
  },
  {
    key: "vizianagaram",
    mandalUrl: "https://vizianagaram.ap.gov.in/divisions-and-mandals/",
  },
  {
    key: "west-godavari",
    mandalUrl: "https://westgodavari.ap.gov.in/revenue-division/",
  },
];

const extraVillagePages = [
  ["tirupati", "https://tirupati.ap.gov.in/village-panchayats/"],
  ["ntr", "https://ntr.ap.gov.in/village-panchayats/"],
  ["guntur", "https://guntur.ap.gov.in/village-panchayats/"],
  ["anakapalli", "https://anakapalli.ap.gov.in/village-panchayats/"],
  ["east-godavari", "https://eastgodavari.ap.gov.in/village-panchayats/"],
  ["sps-nellore", "https://spsnellore.ap.gov.in/village-panchayats/"],
  ["kurnool", "https://kurnool.ap.gov.in/village-panchayats/"],
  ["srikakulam", "https://srikakulam.ap.gov.in/village-panchayats/"],
  ["visakhapatnam", "https://visakhapatnam.ap.gov.in/village-panchayats/"],
  ["krishna", "https://krishna.ap.gov.in/about_district/administrative-setup/village-panchayats/"],
  ["chittoor", "https://chittoor.ap.gov.in/village-panchayats/"],
];

function decode(value) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;|&#8212;|&ndash;|&mdash;/gi, "-")
    .replace(/&#038;|&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanName(value, stripPrefix) {
  let name = decode(value).replace(/^\d+\.\s*/, "").replace(/^\d+\s+/, "").trim();
  if (stripPrefix) {
    name = name.replace(stripPrefix, "").trim();
  }
  if (!name || !/[a-z]/i.test(name) || name.length > 80) {
    return "";
  }
  if (/tahsildar|phone|designation|officer|sl\.?\s*no|total/i.test(name)) {
    return "";
  }
  if (!/[a-z]/.test(name) && /[A-Z]/.test(name)) {
    name = name.toLowerCase().replace(/\b[a-z0-9]+/g, (word) =>
      word.length <= 3 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1),
    );
  }
  return name;
}

function norm(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseTables(html) {
  return [...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map((match) => {
    const spanLeft = [];
    const spanValue = [];
    const grid = [];
    for (const tr of match[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      const cells = [...tr[0].matchAll(/<t[dh]([^>]*)>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => ({
        attrs: cell[1],
        text: decode(cell[2]),
      }));
      const line = [];
      let index = 0;
      let column = 0;
      while (index < cells.length || spanLeft.some((left) => left > 0)) {
        if (column > 12) {
          break;
        }
        if ((spanLeft[column] ?? 0) > 0) {
          line[column] = spanValue[column];
          spanLeft[column] -= 1;
          column += 1;
          continue;
        }
        if (index >= cells.length) {
          break;
        }
        const cell = cells[index];
        index += 1;
        const span = Number(cell.attrs.match(/rowspan=["']?(\d+)/i)?.[1] ?? 1);
        line[column] = cell.text;
        spanLeft[column] = span > 1 ? span - 1 : 0;
        spanValue[column] = cell.text;
        column += 1;
      }
      if (line.some((cell) => cell && cell.trim())) {
        grid.push(line);
      }
    }
    return grid;
  });
}

function headerScore(cell) {
  return /mandal|village|panchayat|division/i.test(cell) && !/phone|mobile|email|officer/i.test(cell);
}

function pickColumn(header, must, prefer, reject) {
  const matches = header
    .map((cell, index) => ({ cell, index }))
    .filter((item) => must.test(item.cell) && !reject.test(item.cell));
  const preferred = matches.filter((item) => prefer.test(item.cell));
  return (preferred.at(-1) ?? matches.at(-1))?.index ?? -1;
}

function interpret(grid, stripMandalPrefix) {
  const headerAt = grid.findIndex((row) => row.filter(headerScore).length > 0);
  if (headerAt < 0) {
    return null;
  }
  const header = grid[headerAt];
  const mandalCol = pickColumn(header, /mandal/i, /name/i, /phone|no\.?\s*of|number|designation|officer|secretariat/i);
  const divisionCol = pickColumn(header, /division/i, /name|revenue division/i, /no\.?\s*of|number of|mandals included/i);
  const villageCol = pickColumn(
    header,
    /village|panchayat/i,
    /name/i,
    /no\.?\s*of|number of|secretariat|phone/i,
  );
  if (mandalCol < 0 && villageCol < 0 && divisionCol < 0) {
    return null;
  }
  const records = [];
  let division = "";
  for (const row of grid.slice(headerAt + 1)) {
    const rawDivision = divisionCol >= 0 ? cleanName(row[divisionCol] ?? "") : "";
    if (rawDivision) {
      division = rawDivision;
    }
    const mandal = mandalCol >= 0 ? cleanName(row[mandalCol] ?? "", stripMandalPrefix) : "";
    const village = villageCol >= 0 ? cleanName(row[villageCol] ?? "") : "";
    if (!mandal && !village && !rawDivision) {
      continue;
    }
    records.push({ division: rawDivision || division, mandal, village });
  }
  return {
    hasMandal: mandalCol >= 0,
    hasVillage: villageCol >= 0,
    hasDivision: divisionCol >= 0,
    records,
  };
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" }, redirect: "follow" });
  if (!response.ok) {
    return null;
  }
  return response.text();
}

function loadReserved() {
  const files = [
    "src/data/locations/districts.ts",
    "src/data/locations/revenue-divisions.ts",
    "src/data/locations/official-mandals.ts",
    "src/data/locations/mandals.ts",
    "src/data/locations/towns.ts",
    "src/data/locations/cities.ts",
    "src/data/locations/localities.ts",
    "src/data/locations.ts",
  ];
  const slugs = new Set();
  const ids = new Set();
  const mandalsByDistrict = new Map();
  const divisionsByDistrict = new Map();
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/\bslug:\s*"([^"]+)"/g)) {
      slugs.add(match[1]);
    }
    for (const match of text.matchAll(/\bid:\s*"([^"]+)"/g)) {
      ids.add(match[1]);
    }
  }
  const official = readFileSync("src/data/locations/official-mandals.ts", "utf8");
  for (const match of official.matchAll(
    /divisionId:\s*"([^"]+)",\s*districtId:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g,
  )) {
    const districtId = match[2];
    const list = mandalsByDistrict.get(districtId) ?? [];
    list.push({ id: `mandal-${districtId.replace("district-", "")}-${match[4]}`, name: match[3], slug: match[4], divisionId: match[1] });
    mandalsByDistrict.set(districtId, list);
  }
  const tirupati = readFileSync("src/data/locations/mandals.ts", "utf8");
  for (const match of tirupati.matchAll(/divisionId:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)"/g)) {
    const list = mandalsByDistrict.get("district-tirupati") ?? [];
    list.push({ id: `mandal-${match[3]}`, name: match[2], slug: match[3], divisionId: match[1] });
    mandalsByDistrict.set("district-tirupati", list);
  }
  const divisions = readFileSync("src/data/locations/official-mandals.ts", "utf8");
  for (const match of divisions.matchAll(/division\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g)) {
    const list = divisionsByDistrict.get(match[4]) ?? [];
    list.push({ id: match[1], name: match[2], slug: match[3] });
    divisionsByDistrict.set(match[4], list);
  }
  const originalDivisions = readFileSync("src/data/locations/revenue-divisions.ts", "utf8");
  for (const match of originalDivisions.matchAll(/division\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"/g)) {
    const list = divisionsByDistrict.get(match[4]) ?? [];
    list.push({ id: match[1], name: match[2], slug: match[3] });
    divisionsByDistrict.set(match[4], list);
  }
  const townFile = readFileSync("src/data/locations/towns.ts", "utf8");
  const townOverrides = new Map();
  for (const match of townFile.matchAll(/^\s+([^:\n]+): "([^"]+)",?$/gm)) {
    if (match[1].trim() !== "districtId") {
      townOverrides.set(match[1].trim(), match[2]);
    }
  }
  for (const match of townFile.matchAll(/"([^"]+)"/g)) {
    const name = match[1];
    if (name.startsWith("district-") || name.includes("http") || name.length > 80) {
      continue;
    }
    const slug = townOverrides.get(name) ?? slugify(name);
    if (slug) {
      slugs.add(slug);
      ids.add(`town-${slug}`);
    }
  }
  for (const key of [
    "alluri-sitharama-raju",
    "ananthapuramu",
    "annamayya",
    "anakapalli",
    "bapatla",
    "chittoor",
    "east-godavari",
    "eluru",
    "kakinada",
    "konaseema",
    "krishna",
    "kurnool",
    "nandyal",
    "ntr",
    "palnadu",
    "parvathipuram-manyam",
    "prakasam",
    "sri-sathya-sai",
    "sps-nellore",
    "srikakulam",
    "tirupati",
    "visakhapatnam",
    "vizianagaram",
    "west-godavari",
    "ysr-kadapa",
  ]) {
    slugs.add(key === "guntur" || key === "kakinada" || key === "tirupati" || key === "visakhapatnam" ? `${key}-district` : key);
    ids.add(`district-${key}`);
    ids.add("state-andhra-pradesh");
  }
  return { slugs, ids, mandalsByDistrict, divisionsByDistrict };
}

function uniqueSlug(slugs, base, suffixes) {
  if (!slugs.has(base)) {
    slugs.add(base);
    return base;
  }
  for (const suffix of suffixes) {
    const next = `${base}-${suffix}`;
    if (!slugs.has(next)) {
      slugs.add(next);
      return next;
    }
  }
  let n = 2;
  while (slugs.has(`${base}-${n}`)) {
    n += 1;
  }
  const next = `${base}-${n}`;
  slugs.add(next);
  return next;
}

function findByName(list, name) {
  const key = norm(name);
  return list.find((item) => norm(item.name) === key);
}

function levenshtein(left, right) {
  if (Math.abs(left.length - right.length) > 3) {
    return 99;
  }
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const current = row[j];
      row[j] = left[i - 1] === right[j - 1] ? previous : Math.min(previous, row[j], row[j - 1]) + 1;
      previous = current;
    }
  }
  return row[right.length];
}

function findClose(list, name) {
  const exact = findByName(list, name);
  if (exact) {
    return exact;
  }
  const key = norm(name);
  const ranked = list
    .map((item) => ({ item, distance: levenshtein(norm(item.name), key) }))
    .filter((entry) => entry.distance <= (key.length >= 12 ? 3 : 2));
  return ranked.length === 1 ? ranked[0].item : null;
}

const reserved = loadReserved();
const newDivisions = [];
const newMandals = [];
const newVillages = [];

function ensureDivision(districtKey, name, sourceUrl) {
  const districtId = `district-${districtKey}`;
  const existing = reserved.divisionsByDistrict.get(districtId) ?? [];
  const found = findClose(existing, name);
  if (found) {
    return found.id;
  }
  const base = slugify(name);
  if (!base) {
    return null;
  }
  const slug = uniqueSlug(reserved.slugs, `${districtKey}-${base}-division`, []);
  const id = `division-${districtKey}-${base}`;
  if (reserved.ids.has(id)) {
    return id;
  }
  reserved.ids.add(id);
  const record = { id, name, slug, districtId, sourceUrl };
  existing.push(record);
  reserved.divisionsByDistrict.set(districtId, existing);
  newDivisions.push(record);
  return id;
}

function ensureMandal(districtKey, name, divisionName, sourceUrl) {
  const districtId = `district-${districtKey}`;
  const existing = reserved.mandalsByDistrict.get(districtId) ?? [];
  const found = findClose(existing, name);
  if (found) {
    if (!found.divisionId && divisionName && newMandals.includes(found)) {
      found.divisionId = ensureDivision(districtKey, divisionName, sourceUrl);
    }
    return found;
  }
  const base = slugify(name);
  if (!base) {
    return null;
  }
  const divisionId = divisionName ? ensureDivision(districtKey, divisionName, sourceUrl) : null;
  const slug = uniqueSlug(reserved.slugs, base, [districtKey, `${districtKey}-mandal`]);
  const idBase = `mandal-${districtKey}-${slug}`;
  const id = reserved.ids.has(idBase) ? uniqueSlug(reserved.ids, idBase, [districtKey]) : idBase;
  reserved.ids.add(id);
  const record = { id, name, slug, districtId, divisionId, sourceUrl };
  existing.push(record);
  reserved.mandalsByDistrict.set(districtId, existing);
  newMandals.push(record);
  return record;
}

function addVillage(districtKey, mandalName, divisionName, villageName, sourceUrl) {
  const mandal = ensureMandal(districtKey, mandalName, divisionName, sourceUrl);
  if (!mandal) {
    return;
  }
  const base = slugify(villageName);
  if (!base) {
    return;
  }
  const slug = uniqueSlug(reserved.slugs, base, [mandal.slug, `${mandal.slug}-${districtKey}`]);
  const id = `village-${districtKey}-${mandal.slug}-${base}`;
  if (reserved.ids.has(id) || newVillages.some((item) => item.id === id)) {
    return;
  }
  reserved.ids.add(id);
  newVillages.push({
    id,
    name: villageName,
    slug,
    districtId: `district-${districtKey}`,
    mandalId: mandal.id,
    sourceUrl,
  });
}

async function absorb(districtKey, url, stripMandalPrefix, role) {
  const html = await fetchHtml(url);
  if (!html) {
    console.log(`miss ${role} ${districtKey} ${url}`);
    return;
  }
  const tables = parseTables(html).map((grid) => interpret(grid, stripMandalPrefix)).filter(Boolean);
  const useful = tables.filter((table) => table.records.length > 0 && (table.hasMandal || table.hasVillage || table.hasDivision));
  if (useful.length === 0) {
    console.log(`empty ${role} ${districtKey} ${url}`);
    return;
  }
  for (const table of useful) {
    if (role === "division" && table.hasDivision && !table.hasMandal && !table.hasVillage) {
      for (const row of table.records) {
        if (row.division) {
          ensureDivision(districtKey, row.division, url);
        }
      }
    }
    if (role === "mandal" && table.hasMandal && !table.hasVillage) {
      for (const row of table.records) {
        if (row.mandal) {
          ensureMandal(districtKey, row.mandal, row.division, url);
        }
      }
    }
    if (role === "village" && table.hasVillage && table.hasMandal) {
      for (const row of table.records) {
        if (row.mandal && row.village) {
          addVillage(districtKey, row.mandal, row.division, row.village, url);
        }
      }
    }
  }
  const mandalCount = newMandals.filter((item) => item.districtId === `district-${districtKey}`).length;
  const villageCount = newVillages.filter((item) => item.districtId === `district-${districtKey}`).length;
  console.log(`${role} ${districtKey} mandals ${mandalCount} villages ${villageCount}`);
}

for (const job of jobs) {
  if (job.divisionUrl) {
    await absorb(job.key, job.divisionUrl, job.stripMandalPrefix, "division");
  }
  await absorb(job.key, job.mandalUrl, job.stripMandalPrefix, "mandal");
  if (job.villageUrl) {
    await absorb(job.key, job.villageUrl, job.stripMandalPrefix, "village");
  }
}

for (const [key, url] of extraVillagePages) {
  await absorb(key, url, undefined, "village");
}

function quote(value) {
  return JSON.stringify(value);
}

const divisionSource = `import type { AdminLocation } from "@/data/types";

const verifiedAt = "${verifiedAt}";

function division(id: string, name: string, slug: string, districtId: string, sourceUrl: string): AdminLocation {
  return {
    id,
    name,
    slug,
    type: "revenue-division",
    parentId: districtId,
    districtId,
    mandalId: null,
    aliases: [],
    languageNames: {},
    sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
}

function mandal(input: {
  id: string;
  divisionId: string | null;
  districtId: string;
  name: string;
  slug: string;
  sourceUrl: string;
}): AdminLocation {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    type: "mandal",
    parentId: input.divisionId ?? input.districtId,
    districtId: input.districtId,
    mandalId: input.id,
    aliases: [],
    languageNames: {},
    sourceUrl: input.sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
}

/** Divisions and mandals from the district sites that were still missing on 9 October 2026. */
export const remainingRevenueDivisions: AdminLocation[] = [
${newDivisions
  .map((item) => `  division(${quote(item.id)}, ${quote(item.name)}, ${quote(item.slug)}, ${quote(item.districtId)}, ${quote(item.sourceUrl)}),`)
  .join("\n")}
];

export const remainingMandals: AdminLocation[] = [
${newMandals
  .map(
    (item) =>
      `  mandal({ id: ${quote(item.id)}, divisionId: ${item.divisionId ? quote(item.divisionId) : "null"}, districtId: ${quote(item.districtId)}, name: ${quote(item.name)}, slug: ${quote(item.slug)}, sourceUrl: ${quote(item.sourceUrl)} }),`,
  )
  .join("\n")}
];
`;

const villageSource = `import type { AdminLocation } from "@/data/types";

const verifiedAt = "${verifiedAt}";

function village(input: {
  id: string;
  districtId: string;
  mandalId: string;
  name: string;
  slug: string;
  sourceUrl: string;
}): AdminLocation {
  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    type: "village",
    parentId: input.mandalId,
    districtId: input.districtId,
    mandalId: input.mandalId,
    aliases: [],
    languageNames: {},
    sourceUrl: input.sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
}

/** Village and gram-panchayat names copied from official district tables. Not service areas. */
export const villages: AdminLocation[] = [
${newVillages
  .map(
    (item) =>
      `  village({ id: ${quote(item.id)}, districtId: ${quote(item.districtId)}, mandalId: ${quote(item.mandalId)}, name: ${quote(item.name)}, slug: ${quote(item.slug)}, sourceUrl: ${quote(item.sourceUrl)} }),`,
  )
  .join("\n")}
];
`;

writeFileSync("src/data/locations/remaining-areas.ts", divisionSource);
writeFileSync("src/data/locations/villages.ts", villageSource);
console.log(
  JSON.stringify(
    {
      divisions: newDivisions.length,
      mandals: newMandals.length,
      villages: newVillages.length,
    },
    null,
    2,
  ),
);
