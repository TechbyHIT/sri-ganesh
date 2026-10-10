import { readArg, requireLimit } from "../src/lib/publishing/args";
import { auditPages } from "../src/lib/publishing/store";

const status = readArg(process.argv, "status") ?? "review";
const limit = requireLimit(process.argv, 1000);

auditPages(status, limit)
  .then((rows) => {
    const blocked = rows.filter((row) => row.gaps.length > 0).length;
    console.log(JSON.stringify({ status, examined: rows.length, blocked, sample: rows.slice(0, 20) }));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
