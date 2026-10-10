import { requireBatchSize } from "../src/lib/publishing/args";
import { publishBatch } from "../src/lib/publishing/store";

const size = requireBatchSize(process.argv);

publishBatch(size)
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
