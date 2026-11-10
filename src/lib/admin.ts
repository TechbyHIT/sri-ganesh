import { headers } from "next/headers";
import { cities } from "@/data/cities";
import { readRegistry } from "@/seo/registry";
import { adminCredentialsMatch } from "./admin-auth";
import { localityKey } from "./imports";
import { allLocalities, readStore, storeDir } from "./store";
import fs from "fs";
import path from "path";

export async function requireAdmin() {
  const list = await headers();
  if (!adminCredentialsMatch(list.get("authorization"))) throw new Error("Not authorised");
}

export function lines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function text(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export function registrySummary() {
  const registry = readRegistry();
  const records = registry?.records ?? [];
  const byKind = new Map<string, { publish: number; review: number }>();
  for (const record of records) {
    const bucket = byKind.get(record.kind) ?? { publish: 0, review: 0 };
    if (record.status === "publish" && record.index) bucket.publish += 1;
    else bucket.review += 1;
    byKind.set(record.kind, bucket);
  }
  return {
    generatedAt: registry?.generatedAt ?? "",
    total: records.length,
    published: records.filter((record) => record.status === "publish" && record.index).length,
    review: records.filter((record) => record.status === "review").length,
    byKind: [...byKind.entries()].sort((a, b) => b[1].publish - a[1].publish),
  };
}

export function lastContentChange() {
  const dir = storeDir();
  if (!fs.existsSync(dir)) return "";
  const stamps = fs.readdirSync(dir).filter((file) => file.endsWith(".json")).map((file) => fs.statSync(path.join(dir, file)).mtime.toISOString());
  return stamps.sort().at(-1) ?? "";
}

export function duplicateReport() {
  const records = readRegistry()?.records ?? [];
  const paths = new Map<string, number>();
  const titles = new Map<string, string[]>();
  for (const record of records) {
    paths.set(record.path, (paths.get(record.path) ?? 0) + 1);
    if (record.status === "publish" && record.index) titles.set(record.title, [...(titles.get(record.title) ?? []), record.path]);
  }
  const placeSlugs = new Map<string, string[]>();
  for (const city of cities) placeSlugs.set(city.slug, [`city:${city.slug}`]);
  for (const place of Object.values(readStore("places"))) placeSlugs.set(place.slug, [...(placeSlugs.get(place.slug) ?? []), place.key]);
  const localityKeys = new Map<string, number>();
  for (const row of allLocalities()) localityKeys.set(localityKey(row), (localityKeys.get(localityKey(row)) ?? 0) + 1);
  return {
    paths: [...paths.entries()].filter(([, count]) => count > 1).map(([value, count]) => `${value} (${count}×)`),
    titles: [...titles.entries()].filter(([, list]) => list.length > 1).map(([title, list]) => `${title}: ${list.join(", ")}`),
    slugs: [...placeSlugs.entries()].filter(([, owners]) => owners.length > 1).map(([slug, owners]) => `${slug}: ${owners.join(", ")}`),
    localities: [...localityKeys.entries()].filter(([, count]) => count > 1).map(([key, count]) => `${key} (${count}×)`),
  };
}
