import { buildDraftRecords, countDraftsByType } from "../src/lib/publishing/drafts";
import { getPrisma } from "../src/lib/prisma";
import { countStoredPages } from "../src/lib/publishing/store";

const drafts = countDraftsByType(buildDraftRecords());

async function main() {
  if (!getPrisma()) {
    console.log(JSON.stringify({ database: false, drafts, stored: null }));
    return;
  }

  const stored = await countStoredPages();
  console.log(JSON.stringify({ database: true, drafts, stored }));
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
