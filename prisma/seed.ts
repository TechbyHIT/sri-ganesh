import { createPageRecords } from "../src/lib/publishing/store";

createPageRecords(undefined, 5000)
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
