import { readArg, requireLimit } from "../src/lib/publishing/args";
import { createPageRecords } from "../src/lib/publishing/store";

const type = readArg(process.argv, "type");
const limit = requireLimit(process.argv, 1000);

createPageRecords(type, limit)
  .then((result) => {
    console.log(JSON.stringify({ type: type ?? "all", ...result }));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
