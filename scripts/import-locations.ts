import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseImportFile, validateLocationImport } from "../src/lib/location-import";

const args = process.argv.slice(2);
const fileArg = args.find((arg) => arg.startsWith("--file="))?.slice("--file=".length);

if (args.includes("--write")) {
  throw new Error(
    "This command validates only. Location data files are produced by the official-source importers (import:lgd) so every record keeps its source and verification date.",
  );
}

if (!fileArg) {
  throw new Error("Pass --file=path/to/locations.csv (or .json). Columns: name,type,parentSlug,officialId,aliases,source,verifiedOn.");
}

const rows = parseImportFile(fileArg, readFileSync(fileArg, "utf-8"));
const report = validateLocationImport(rows);
const directory = path.join(process.cwd(), "reports");
mkdirSync(directory, { recursive: true });

writeFileSync(path.join(directory, "location-import-report.json"), `${JSON.stringify(report, null, 2)}\n`);
const csv = [
  "row,name,severity,code,message",
  ...report.issues.map((issue) =>
    [issue.row, issue.name, issue.severity, issue.code, issue.message].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
  ),
];
writeFileSync(path.join(directory, "location-import-report.csv"), `${csv.join("\n")}\n`);

console.log(JSON.stringify({ rows: report.rows, accepted: report.accepted.length, rejected: report.rejected, errors: report.errors, warnings: report.warnings }, null, 2));
console.log("Dry run only. No location data was changed. Reports: reports/location-import-report.json and .csv");
process.exit(report.errors > 0 ? 1 : 0);
