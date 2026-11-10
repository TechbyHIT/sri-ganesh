import fs from "fs";
import path from "path";
import { getCatalog, resetSeoCaches, type Catalog } from "./catalog";
import { readRegistry, writeRegistry } from "./registry";
import { TEMPLATE_VERSION, type PageKind, type PageRecord } from "./types";

export type GenerationReport = {
  generatedAt: string;
  templateVersion: number;
  counts: { publish: number; review: number; exclude: number };
  byKind: Record<string, { publish: number; review: number }>;
  rejected: Catalog["rejected"];
  review: PageRecord[];
};

function toRecord(page: Catalog["pages"][number], prior: PageRecord | undefined, now: string): PageRecord {
  const changed = !prior || prior.inputHash !== page.inputHash || prior.status !== page.status;
  return {
    id: page.id,
    path: page.path,
    kind: page.kind,
    status: page.status,
    index: page.index,
    version: changed ? (prior?.version ?? 0) + 1 : prior.version,
    inputHash: page.inputHash,
    score: page.score,
    title: page.title,
    reasons: page.reasons,
    updatedAt: changed ? now : prior.updatedAt,
  };
}

export function generateRegistry({ write }: { write: boolean }) {
  resetSeoCaches();
  const catalog = getCatalog();
  const previous = new Map((readRegistry()?.records ?? []).map((record) => [record.id, record]));
  const now = new Date().toISOString();
  const records = catalog.pages.map((page) => toRecord(page, previous.get(page.id), now));
  const byKind: GenerationReport["byKind"] = {};
  for (const record of records) {
    const bucket = (byKind[record.kind as PageKind] ??= { publish: 0, review: 0 });
    if (record.status === "publish") bucket.publish += 1;
    else if (record.status === "review") bucket.review += 1;
  }
  const report: GenerationReport = {
    generatedAt: now,
    templateVersion: TEMPLATE_VERSION,
    counts: {
      publish: records.filter((record) => record.status === "publish").length,
      review: records.filter((record) => record.status === "review").length,
      exclude: catalog.rejected.length,
    },
    byKind,
    rejected: catalog.rejected.slice(0, 40),
    review: records.filter((record) => record.status === "review").slice(0, 20),
  };
  if (write) {
    writeRegistry({ generatedAt: now, templateVersion: TEMPLATE_VERSION, records });
    const reportDir = path.join(process.cwd(), "reports", "seo");
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(path.join(reportDir, "quality-report.json"), JSON.stringify(report, null, 2));
    resetSeoCaches();
  }
  return { catalog, records, report };
}
