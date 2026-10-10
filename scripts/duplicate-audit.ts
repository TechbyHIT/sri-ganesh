import { detectDuplicateContent, publishedContentPages } from "../src/lib/content";
import { buildDraftRecords } from "../src/lib/publishing/drafts";
import { similarityScore } from "../src/lib/seo/similarity";
import { writeReport } from "./write-json";

const catalogue = detectDuplicateContent(publishedContentPages());
const drafts = buildDraftRecords();
const flagged: { left: string; right: string; score: number }[] = [];

for (let left = 0; left < drafts.length; left += 1) {
  for (let right = left + 1; right < drafts.length; right += 1) {
    const score = similarityScore(drafts[left]?.body ?? "", drafts[right]?.body ?? "");
    if (score > 0.7) {
      flagged.push({ left: drafts[left]?.path ?? "", right: drafts[right]?.path ?? "", score });
    }
  }
}

const report = { catalogueMatches: catalogue, draftMatches: flagged };
writeReport("duplicate-content.json", report);

if (catalogue.length > 0) {
  console.error("Catalogue duplicate content is above the existing threshold.");
  process.exit(1);
}

console.log(JSON.stringify({ catalogueMatches: catalogue.length, draftMatches: flagged.length }));
