import fs from "node:fs";
import path from "node:path";

export function writeReport(name: string, value: unknown) {
  const directory = path.join(process.cwd(), "reports");
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, name), `${JSON.stringify(value, null, 2)}\n`);
}
