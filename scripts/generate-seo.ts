import { pageText } from "../src/seo/quality";
import { generateRegistry } from "../src/seo/generate";
import type { Catalog } from "../src/seo/catalog";

const checkOnly = process.argv.includes("--check");

function assertRepresentative(catalog: Catalog) {
  const byId = new Map(catalog.pages.map((page) => [page.id, page]));
  const vizag = byId.get("service-city:invisible-grills:visakhapatnam");
  const kurnool = byId.get("service-city:invisible-grills:kurnool");
  if (!vizag || vizag.status !== "publish") throw new Error("Visakhapatnam invisible grills should publish");
  if (!kurnool || kurnool.status !== "publish") throw new Error("Kurnool invisible grills should publish");
  const vizagText = pageText(vizag);
  const kurnoolText = pageText(kurnool);
  if (!/salt|SS316/i.test(vizagText)) throw new Error("Visakhapatnam page is missing the coastal material fact");
  if (!/UV|SS304/i.test(kurnoolText)) throw new Error("Kurnool page is missing the inland material fact");
  if (vizag.skeleton === kurnool.skeleton) throw new Error("City pages collapsed to the same skeleton");
  const cricketArea = catalog.rejected.find((item) => item.path === "/services/cricket-nets/visakhapatnam/madhurawada");
  if (!cricketArea) throw new Error("Cricket nets in Madhurawada should be rejected for lack of local overlap");
  const publishedBare = catalog.pages.find((page) =>
    page.kind === "mandal" &&
    !page.params.city &&
    page.status === "publish" &&
    !page.modules.some((module) => module.type === "list" && module.title.startsWith("Villages in")),
  );
  if (publishedBare) throw new Error(`Mandal directory page without a village list was published: ${publishedBare.path}`);
  const titles = new Set<string>();
  for (const page of catalog.pages.filter((item) => item.status === "publish")) {
    if (titles.has(page.title)) throw new Error(`Duplicate title: ${page.title}`);
    titles.add(page.title);
  }
}

const started = Date.now();
const { catalog, report } = generateRegistry({ write: !checkOnly });
assertRepresentative(catalog);
console.log(JSON.stringify(report.counts));
console.log(JSON.stringify(report.byKind, null, 1));
console.log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
