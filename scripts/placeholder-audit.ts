import { staticPages } from "../src/lib/content/static-pages";
import { guides } from "../src/data/guides";
import { problems } from "../src/data/problems";
import { findPlaceholders } from "../src/lib/content/placeholders";
import { writeReport } from "./write-json";

const hits: { path: string; placeholders: string[] }[] = [];

for (const page of [...staticPages, ...guides.map((guide) => ({ path: `/guides/${guide.slug}`, title: guide.title, h1: guide.h1, description: guide.description, sections: guide.sections })), ...problems.map((problem) => ({ path: `/solutions/${problem.slug}`, title: problem.title, h1: problem.h1, description: problem.description, sections: problem.sections }))]) {
  const placeholders = findPlaceholders(`${page.title} ${page.h1} ${page.description} ${page.sections.map((section) => section.paragraphs.join(" ")).join(" ")}`);
  if (placeholders.length > 0) hits.push({ path: page.path, placeholders });
}

writeReport("placeholders.json", { hits });
if (hits.length > 0) {
  console.error(JSON.stringify(hits));
  process.exit(1);
}
console.log(JSON.stringify({ hits: 0 }));
