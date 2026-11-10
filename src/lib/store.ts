import fs from "fs";
import path from "path";
import type { Locality } from "@/data/geo-types";
import type { Service } from "@/data/services";
import type { FaqItem, PageStatus } from "@/seo/types";

export type PlaceContent = {
  key: string;
  district: string;
  mandal: string;
  slug: string;
  name: string;
  intro: string;
  housing: string;
  climate: string;
  materialHint: string;
  visitNote: string;
  localities: string[];
  photos: string[];
  services: string[];
  enabled: boolean;
  updatedAt: string;
};

export type PageEdit = {
  title?: string;
  description?: string;
  h1?: string;
  intro?: string;
  image?: string;
  imageAlt?: string;
  faqs?: FaqItem[];
  updatedAt: string;
};

export type UploadRecord = {
  id: string;
  file: string;
  alt: string;
  service: string;
  place: string;
  createdAt: string;
};

type StoreShape = {
  places: Record<string, PlaceContent>;
  localities: Locality[];
  pageEdits: Record<string, PageEdit>;
  overrides: Record<string, PageStatus>;
  services: Service[];
  uploads: UploadRecord[];
};

const files: { [K in keyof StoreShape]: string } = {
  places: "places.json",
  localities: "localities.json",
  pageEdits: "page-edits.json",
  overrides: "overrides.json",
  services: "services.json",
  uploads: "uploads.json",
};

const empty: StoreShape = { places: {}, localities: [], pageEdits: {}, overrides: {}, services: [], uploads: [] };

export function storeDir() {
  return process.env.CONTENT_DIR ? path.resolve(process.env.CONTENT_DIR) : path.join(process.cwd(), "data", "store");
}

export function uploadsDir() {
  return path.join(storeDir(), "uploads");
}

const cache = new Map<string, { mtime: number; value: unknown }>();
let revision = 0;

export function storeRevision() {
  let stamp = revision;
  for (const name of Object.values(files)) {
    const file = path.join(storeDir(), name);
    if (fs.existsSync(file)) stamp += fs.statSync(file).mtimeMs;
  }
  return stamp;
}

export function readStore<K extends keyof StoreShape>(key: K): StoreShape[K] {
  const file = path.join(storeDir(), files[key]);
  if (!fs.existsSync(file)) return structuredClone(empty[key]);
  const mtime = fs.statSync(file).mtimeMs;
  const hit = cache.get(file);
  if (hit && hit.mtime === mtime) return hit.value as StoreShape[K];
  const value = JSON.parse(fs.readFileSync(file, "utf8")) as StoreShape[K];
  cache.set(file, { mtime, value });
  return value;
}

export function writeStore<K extends keyof StoreShape>(key: K, value: StoreShape[K]) {
  const dir = storeDir();
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, files[key]);
  const temp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value, null, 1));
  fs.renameSync(temp, file);
  cache.delete(file);
  revision += 1;
}

export function storeSnapshot() {
  return Object.fromEntries((Object.keys(files) as (keyof StoreShape)[]).map((key) => [key, readStore(key)])) as StoreShape;
}

let officialLocalities: { mtime: number; rows: Locality[] } | null = null;

export function officialLocalitiesFile() {
  return path.join(process.cwd(), "data", "locations", "ap", "localities.json");
}

export function allLocalities(): Locality[] {
  const file = officialLocalitiesFile();
  let official: Locality[] = [];
  if (fs.existsSync(file)) {
    const mtime = fs.statSync(file).mtimeMs;
    if (!officialLocalities || officialLocalities.mtime !== mtime) {
      officialLocalities = { mtime, rows: JSON.parse(fs.readFileSync(file, "utf8")) as Locality[] };
    }
    official = officialLocalities.rows;
  }
  return [...official, ...readStore("localities")];
}

export function localitiesIn(district: string, mandal?: string) {
  return allLocalities().filter((row) => row.district === district && (!mandal || row.mandal === mandal));
}
