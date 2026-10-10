import { site } from "@/data/site";
import { servicePath } from "@/lib/paths";
import { generateCanonicalUrl } from "@/lib/seo";
import { getAllServices } from "@/lib/services";
import { sitemapFiles, urlsForGroup } from "@/lib/sitemap/groups";
import { imageSitemapXml, sitemapXml } from "@/lib/sitemap/xml";

export function generateStaticParams() {
  return sitemapFiles().map((item) => ({ file: item.file }));
}

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const match = sitemapFiles().find((item) => item.file === file);

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  if (match.group === "images") {
    const updated = new Date(site.contentUpdated);
    const pages = getAllServices()
      .filter((service) => service.indexable)
      .map((service) => ({
        url: generateCanonicalUrl(servicePath(service.slug)),
        lastModified: updated,
        images: [
          {
            loc: generateCanonicalUrl(service.heroImage.src),
            title: service.heroImage.alt,
          },
        ],
      }));

    return new Response(imageSitemapXml(pages), {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  const urls = match.group === "blog" ? [] : urlsForGroup(match.group);
  return new Response(sitemapXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
