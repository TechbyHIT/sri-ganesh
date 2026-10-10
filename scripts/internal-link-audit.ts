import { findInvalidLinks, findOrphanPages } from "../src/lib/internal-links";
import { writeReport } from "./write-json";

const report = { invalid: findInvalidLinks(), orphans: findOrphanPages() };
writeReport("internal-links.json", report);

if (report.invalid.length > 0 || report.orphans.services.length > 0 || report.orphans.locations.length > 0 || report.orphans.serviceLocations.length > 0) {
  console.error(JSON.stringify(report));
  process.exit(1);
}

console.log(JSON.stringify(report));
