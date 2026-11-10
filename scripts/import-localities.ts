import fs from "fs";
import type { LocalityKind } from "../src/data/geo-types";
import { importLocalities } from "../src/lib/imports";

const [file, ...flags] = process.argv.slice(2);
const kindFlag = flags.find((flag) => flag.startsWith("--kind="))?.slice(7) ?? "village";
const target = flags.includes("--store") ? "store" : "official";

if (!file || !fs.existsSync(file)) {
  console.error("Usage: npm run locations:import -- <file.csv> [--kind=village|colony|apartment|locality] [--store]");
  console.error("Columns: district,mandal,name,kind,source. Default target is data/locations/ap/localities.json (committed).");
  process.exit(1);
}

const result = importLocalities(fs.readFileSync(file, "utf8"), kindFlag as LocalityKind, target);
for (const error of result.errors.slice(0, 40)) console.warn(`line ${error.line}: ${error.reason}`);
if (result.errors.length > 40) console.warn(`…and ${result.errors.length - 40} more`);
console.log(JSON.stringify({ target, added: result.added, duplicates: result.duplicates, rejected: result.errors.length }));
