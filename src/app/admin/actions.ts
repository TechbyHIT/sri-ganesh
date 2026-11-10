"use server";

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { customServiceProblems } from "@/data/all-services";
import { getMandal } from "@/data/geo";
import type { LocalityKind } from "@/data/geo-types";
import { placeProblems } from "@/data/places";
import type { Service } from "@/data/services";
import { lines, requireAdmin, text } from "@/lib/admin";
import { importLocalities, importMandals, type ImportResult } from "@/lib/imports";
import { slugify } from "@/lib/slug";
import { readStore, uploadsDir, writeStore, type PageEdit, type PlaceContent } from "@/lib/store";
import { resetSeoCaches } from "@/seo/catalog";
import { generateRegistry } from "@/seo/generate";
import type { FaqItem, PageStatus } from "@/seo/types";

function refreshSite() {
  resetSeoCaches();
  revalidatePath("/", "layout");
}

function back(target: string, params: Record<string, string>): never {
  const query = new URLSearchParams(params).toString();
  redirect(`${target}${target.includes("?") ? "&" : "?"}${query}`);
}

function parseFaqs(value: FormDataEntryValue | null): FaqItem[] {
  return lines(value).flatMap((line) => {
    const [q, ...rest] = line.split("|");
    const a = rest.join("|").trim();
    return q?.trim() && a ? [{ q: q.trim(), a }] : [];
  });
}

export async function regenerateAction() {
  await requireAdmin();
  const { report } = generateRegistry({ write: true });
  refreshSite();
  back("/admin", { ok: `Registry regenerated: ${report.counts.publish} published, ${report.counts.review} held for review, ${report.counts.exclude} rejected.` });
}

export async function bulkStatusAction(form: FormData) {
  await requireAdmin();
  const paths = form.getAll("path").map(String).filter((value) => value.startsWith("/"));
  const action = text(form.get("action"));
  const returnTo = text(form.get("returnTo")) || "/admin/pages";
  if (!paths.length) back(returnTo, { error: "Select at least one page." });
  const overrides = readStore("overrides");
  for (const value of paths) {
    if (action === "clear") delete overrides[value];
    else if (["publish", "review", "exclude"].includes(action)) overrides[value] = action as PageStatus;
  }
  writeStore("overrides", overrides);
  refreshSite();
  back(returnTo, { ok: `${paths.length} page${paths.length === 1 ? "" : "s"} updated (${action}). Regenerate the registry to update the sitemaps.` });
}

export async function savePageEditAction(form: FormData) {
  await requireAdmin();
  const target = text(form.get("path"));
  if (!target.startsWith("/")) back("/admin/pages", { error: "Missing page path." });
  const edit: PageEdit = {
    title: text(form.get("title")) || undefined,
    description: text(form.get("description")) || undefined,
    h1: text(form.get("h1")) || undefined,
    intro: text(form.get("intro")) || undefined,
    image: text(form.get("image")) || undefined,
    imageAlt: text(form.get("imageAlt")) || undefined,
    faqs: parseFaqs(form.get("faqs")),
    updatedAt: new Date().toISOString(),
  };
  if (edit.title && edit.title.length > 70) back(`/admin/pages/edit?path=${encodeURIComponent(target)}`, { error: "Title should stay under 70 characters." });
  if (edit.image && !edit.imageAlt) back(`/admin/pages/edit?path=${encodeURIComponent(target)}`, { error: "Describe the image in the alt text." });
  const edits = readStore("pageEdits");
  const empty = !edit.title && !edit.description && !edit.h1 && !edit.intro && !edit.image && !edit.faqs?.length;
  if (empty) delete edits[target];
  else edits[target] = edit;
  writeStore("pageEdits", edits);
  refreshSite();
  back(`/admin/pages/edit?path=${encodeURIComponent(target)}`, { ok: empty ? "Edits cleared." : "Saved. The page re-checks against the quality gate on its next view." });
}

export async function savePlaceAction(form: FormData) {
  await requireAdmin();
  const district = text(form.get("district"));
  const mandal = text(form.get("mandal"));
  const found = getMandal(district, mandal);
  const target = `/admin/locations/${district}/${mandal}`;
  if (!found) back("/admin/locations", { error: "Unknown mandal." });
  const key = `mandal:${district}:${mandal}`;
  const place: PlaceContent = {
    key,
    district,
    mandal,
    slug: slugify(text(form.get("slug")) || found.mandal.name),
    name: text(form.get("name")) || found.mandal.name,
    intro: text(form.get("intro")),
    housing: text(form.get("housing")),
    climate: text(form.get("climate")),
    materialHint: text(form.get("materialHint")),
    visitNote: text(form.get("visitNote")),
    localities: lines(form.get("localities")),
    photos: form.getAll("photos").map(String),
    services: form.getAll("services").map(String),
    enabled: form.get("enabled") === "on",
    updatedAt: new Date().toISOString(),
  };
  const places = readStore("places");
  const clash = Object.values(places).find((item) => item.slug === place.slug && item.key !== key);
  const problems = [...placeProblems(place), ...(clash ? [`Slug ${place.slug} is already used by ${clash.key}`] : [])];
  places[key] = { ...place, enabled: place.enabled && !problems.length };
  writeStore("places", places);
  refreshSite();
  if (problems.length) back(target, { error: `Saved as a draft. Pages are not generated until: ${problems.join("; ")}.` });
  back(target, { ok: place.enabled ? "Saved. Service pages for this mandal now exist; regenerate the registry so the quality gate can publish them." : "Saved as a draft." });
}

export async function importAction(form: FormData) {
  await requireAdmin();
  const type = text(form.get("type"));
  const file = form.get("file");
  const pasted = text(form.get("csv"));
  const content = file instanceof File && file.size ? await file.text() : pasted;
  if (!content) back("/admin/import", { error: "Choose a CSV file or paste CSV text." });
  if (content.length > 15_000_000) back("/admin/import", { error: "File is larger than 15 MB. Split it by district." });
  let result: ImportResult;
  if (type === "mandals") result = importMandals(content);
  else result = importLocalities(content, (["village", "colony", "apartment", "locality"].includes(type) ? type : "locality") as LocalityKind);
  refreshSite();
  const summary = `${result.added} added, ${result.duplicates} duplicates skipped, ${result.errors.length} rejected.`;
  const detail = [
    ...result.errors.slice(0, 12).map((error) => `Line ${error.line}: ${error.reason}`),
    ...(result.errors.length > 12 ? [`…and ${result.errors.length - 12} more rejected rows`] : []),
    ...result.notes,
  ].join("\n");
  back("/admin/import", { [result.errors.length && !result.added ? "error" : "ok"]: summary, ...(detail ? { detail } : {}) });
}

export async function deleteLocalityAction(form: FormData) {
  await requireAdmin();
  const id = text(form.get("id"));
  const returnTo = text(form.get("returnTo")) || "/admin/locations";
  writeStore("localities", readStore("localities").filter((row) => row.id !== id));
  refreshSite();
  back(returnTo, { ok: "Locality removed." });
}

export async function saveServiceAction(form: FormData) {
  await requireAdmin();
  const service: Service = {
    slug: slugify(text(form.get("slug")) || text(form.get("name"))),
    name: text(form.get("name")),
    group: (["Protection", "Bird control", "Utility"].includes(text(form.get("group"))) ? text(form.get("group")) : "Protection") as Service["group"],
    summary: text(form.get("summary")),
    lede: text(form.get("lede")),
    problems: lines(form.get("problems")),
    benefits: lines(form.get("benefits")),
    where: lines(form.get("where")),
    materials: lines(form.get("materials")),
    priceFactors: lines(form.get("priceFactors")),
    faqs: parseFaqs(form.get("faqs")),
    intents: [],
  };
  const problems = customServiceProblems(service);
  const list = readStore("services").filter((item) => item.slug !== service.slug);
  list.push(service);
  writeStore("services", list);
  refreshSite();
  if (problems.length) back("/admin/services", { error: `Saved as a draft, not live until fixed: ${problems.join("; ")}.` });
  back("/admin/services", { ok: `${service.name} saved. Regenerate the registry to create and gate its city pages.` });
}

export async function deleteServiceAction(form: FormData) {
  await requireAdmin();
  const slug = text(form.get("slug"));
  writeStore("services", readStore("services").filter((item) => item.slug !== slug));
  refreshSite();
  back("/admin/services", { ok: "Custom service removed." });
}

const imageTypes: Record<string, string> = { "image/webp": ".webp", "image/jpeg": ".jpg", "image/png": ".png", "image/avif": ".avif" };

export async function uploadImageAction(form: FormData) {
  await requireAdmin();
  const file = form.get("file");
  const alt = text(form.get("alt"));
  if (!(file instanceof File) || !file.size) back("/admin/images", { error: "Choose an image." });
  if (!imageTypes[file.type]) back("/admin/images", { error: "Use WebP, JPEG, PNG or AVIF." });
  if (file.size > 4_000_000) back("/admin/images", { error: "Keep images under 4 MB. Resize before uploading." });
  if (alt.length < 15) back("/admin/images", { error: "Write alt text that describes the installation (at least 15 characters)." });
  const id = randomUUID().slice(0, 12);
  const name = `${slugify(text(form.get("service")) || "project")}-${id}${imageTypes[file.type]}`;
  fs.mkdirSync(uploadsDir(), { recursive: true });
  fs.writeFileSync(path.join(uploadsDir(), name), Buffer.from(await file.arrayBuffer()));
  writeStore("uploads", [
    ...readStore("uploads"),
    { id, file: name, alt, service: text(form.get("service")), place: text(form.get("place")), createdAt: new Date().toISOString() },
  ]);
  back("/admin/images", { ok: "Image uploaded." });
}

export async function deleteImageAction(form: FormData) {
  await requireAdmin();
  const id = text(form.get("id"));
  const uploads = readStore("uploads");
  const found = uploads.find((item) => item.id === id);
  if (found) {
    const file = path.join(uploadsDir(), path.basename(found.file));
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  writeStore("uploads", uploads.filter((item) => item.id !== id));
  refreshSite();
  back("/admin/images", { ok: "Image removed." });
}
