import { readArg } from "../src/lib/publishing/args";
import { noindexBelow } from "../src/lib/publishing/store";

const raw = readArg(process.argv, "quality-below") ?? "80";
const score = Number(raw);

if (!Number.isInteger(score) || score < 1 || score > 100) {
  console.error("--quality-below must be an integer from 1 to 100.");
  process.exit(1);
}

noindexBelow(score)
  .then((count) => {
    console.log(JSON.stringify({ noindexed: count, qualityBelow: score }));
  })
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
