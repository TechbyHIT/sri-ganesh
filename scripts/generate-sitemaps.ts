import { sitemapFiles, urlsForGroup } from "../src/lib/sitemap/groups";
import { writeReport } from "./write-json";

const summary = sitemapFiles().map((item) => ({
  file: item.file,
  urls: item.group === "images" || item.group === "blog" ? 0 : urlsForGroup(item.group).length,
}));

writeReport("sitemap-summary.json", { summary });
console.log(JSON.stringify(summary));
