import { PUBLISHING } from "../src/config/publishing";
import { buildDraftRecords } from "../src/lib/publishing/drafts";
import { wordCount } from "../src/lib/seo/similarity";
import { writeReport } from "./write-json";

const rows = buildDraftRecords().map((record) => ({
  path: record.path,
  pageType: record.pageType,
  words: wordCount(record.body),
  minimum: record.minimumWordCount,
  ready: wordCount(record.body) >= record.minimumWordCount && record.qualityScore >= PUBLISHING.qualityMinimum,
}));

const report = {
  records: rows.length,
  belowMinimum: rows.filter((row) => row.words < row.minimum).length,
  ready: rows.filter((row) => row.ready).length,
  sample: rows.slice(0, 30),
};

writeReport("content-quality.json", report);
console.log(JSON.stringify({ records: report.records, belowMinimum: report.belowMinimum, ready: report.ready }));
