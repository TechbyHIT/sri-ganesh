import path from "path";
import { buildGeo, districtsFile } from "../src/lib/geo-build";

const checkOnly = process.argv.includes("--check");
const { file, summary, problems, mismatched, unmatched, fatal } = buildGeo({ write: !checkOnly });

console.log(JSON.stringify(summary));
for (const district of file.districts) {
  console.log(`${district.name.padEnd(30)} divisions=${district.divisions.length} mandals=${district.mandals.length} ulbs=${district.ulbs.length} verified=${district.verified}`);
}
if (problems.length) console.log(`Problems:\n- ${problems.join("\n- ")}`);
if (mismatched.length) console.log(`City pages whose stated district differs from the official mandal/ULB match:\n${mismatched.map((row) => `- ${row.name}: stated ${row.stated}, matched ${row.matched.join(" / ")}`).join("\n")}`);
if (unmatched.length) console.log(`City pages with no mandal/ULB name match (check manually): ${unmatched.map((row) => row.name).join(", ")}`);
if (!checkOnly && !fatal) console.log(`Wrote ${path.relative(process.cwd(), districtsFile)}`);
if (fatal) process.exitCode = 1;
