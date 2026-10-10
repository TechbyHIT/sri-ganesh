import type { AdminLocation } from "@/data/types";
import { allAdminLocations } from "@/lib/location-validation";
import { toLocationSlug } from "@/lib/location-slugs";

export type ImportRow = {
  name: string;
  type: string;
  parentSlug: string;
  officialId?: string;
  /** Alternate spellings separated by semicolons. */
  aliases?: string;
  source?: string;
  verifiedOn?: string;
};

export type ImportIssue = {
  row: number;
  name: string;
  severity: "error" | "warning";
  code: string;
  message: string;
};

export type AcceptedRow = ImportRow & { slug: string; parentType: string };

export type ImportReport = {
  rows: number;
  accepted: AcceptedRow[];
  rejected: number;
  errors: number;
  warnings: number;
  issues: ImportIssue[];
};

const ALLOWED_PARENTS: Record<string, readonly string[]> = {
  district: ["state"],
  mandal: ["district", "revenue-division"],
  city: ["district"],
  town: ["mandal", "district"],
  village: ["mandal"],
  ward: ["city"],
  locality: ["city"],
};

/** Minimal RFC 4180 reader: quoted fields, doubled quotes, CRLF. */
export function parseCsv(text: string): Record<string, string>[] {
  const records: string[][] = [];
  let field = "";
  let record: string[] = [];
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      record.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }
      record.push(field);
      field = "";
      if (record.some((value) => value.trim() !== "")) {
        records.push(record);
      }
      record = [];
    } else {
      field += char;
    }
  }

  record.push(field);
  if (record.some((value) => value.trim() !== "")) {
    records.push(record);
  }

  const [header = [], ...body] = records;
  const keys = header.map((key) => key.trim());
  return body.map((values) => Object.fromEntries(keys.map((key, column) => [key, (values[column] ?? "").trim()])));
}

export function parseImportFile(name: string, text: string): ImportRow[] {
  const raw = name.toLowerCase().endsWith(".json") ? (JSON.parse(text) as unknown) : parseCsv(text);

  if (!Array.isArray(raw)) {
    throw new Error("A JSON import must be an array of rows.");
  }

  return raw.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      name: String(row.name ?? "").trim(),
      type: String(row.type ?? "").trim().toLowerCase(),
      parentSlug: String(row.parentSlug ?? "").trim(),
      officialId: row.officialId ? String(row.officialId).trim() : undefined,
      aliases: row.aliases ? String(row.aliases) : undefined,
      source: row.source ? String(row.source).trim() : undefined,
      verifiedOn: row.verifiedOn ? String(row.verifiedOn).trim() : undefined,
    };
  });
}

/**
 * Checks proposed location rows against the current tree. Writes nothing.
 * Errors reject a row. Warnings need a person to look but do not block it.
 */
export function validateLocationImport(rows: readonly ImportRow[], existing: readonly AdminLocation[] = allAdminLocations()): ImportReport {
  const bySlug = new Map(existing.map((place) => [place.slug, place]));
  const slugs = new Set(existing.map((place) => place.slug));
  const siblingKeys = new Set(existing.map((place) => `${place.parentId ?? ""}|${place.type}|${toLocationSlug(place.name)}`));
  const officialIds = new Set<string>();
  const accepted: AcceptedRow[] = [];
  const issues: ImportIssue[] = [];
  const add = (row: number, name: string, severity: "error" | "warning", code: string, message: string) =>
    issues.push({ row, name, severity, code, message });

  rows.forEach((row, index) => {
    const number = index + 2;
    const before = issues.filter((issue) => issue.severity === "error").length;
    const slug = toLocationSlug(row.name);
    const allowed = ALLOWED_PARENTS[row.type];

    if (!row.name || !slug) {
      add(number, row.name, "error", "name", "Name is empty or has no usable letters.");
    }

    if (!allowed) {
      add(number, row.name, "error", "type", `Unknown type "${row.type}".`);
    }

    const parent = bySlug.get(row.parentSlug);

    if (!parent) {
      add(number, row.name, "error", "parent-missing", `Parent "${row.parentSlug}" is not in the location data or an earlier row.`);
    } else if (allowed && !allowed.includes(parent.type)) {
      add(number, row.name, "error", "parent-type", `A ${row.type} cannot sit under a ${parent.type}. Allowed: ${allowed.join(", ")}.`);
    }

    if (row.officialId) {
      if (officialIds.has(row.officialId)) {
        add(number, row.name, "error", "official-id", `Official ID ${row.officialId} appears twice.`);
      }
      officialIds.add(row.officialId);
    }

    if (parent && siblingKeys.has(`${parent.id}|${row.type}|${slug}`)) {
      add(number, row.name, "error", "duplicate", `"${row.name}" already exists under ${parent.name}.`);
    } else if (slug && slugs.has(slug)) {
      add(number, row.name, "error", "slug-collision", `Slug "${slug}" is used by another place. Use a disambiguated slug such as "${slug}-${row.parentSlug}".`);
    }

    for (const alias of (row.aliases ?? "").split(";").map((item) => item.trim()).filter(Boolean)) {
      const aliasSlug = toLocationSlug(alias);

      if (aliasSlug && aliasSlug !== slug && slugs.has(aliasSlug)) {
        add(number, row.name, "warning", "alias-collision", `Alias "${alias}" matches the slug of another place.`);
      }
    }

    if (!row.source) {
      add(number, row.name, "warning", "source", "No official source named. Official data only.");
    }

    if (!row.verifiedOn || !/^\d{4}-\d{2}-\d{2}$/.test(row.verifiedOn)) {
      add(number, row.name, "warning", "verified-on", "Verification date is missing or not YYYY-MM-DD.");
    }

    const failed = issues.filter((issue) => issue.severity === "error").length > before;

    if (!failed && parent) {
      accepted.push({ ...row, slug, parentType: parent.type });
      slugs.add(slug);
      siblingKeys.add(`${parent.id}|${row.type}|${slug}`);
      bySlug.set(slug, {
        ...parent,
        id: `import-${slug}`,
        name: row.name,
        slug,
        type: row.type as AdminLocation["type"],
        parentId: parent.id,
      });
    }
  });

  const errors = issues.filter((issue) => issue.severity === "error").length;
  return {
    rows: rows.length,
    accepted,
    rejected: rows.length - accepted.length,
    errors,
    warnings: issues.length - errors,
    issues,
  };
}
