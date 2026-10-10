export function imageSitemapXml(
  pages: { url: string; lastModified: Date; images: { loc: string; title: string }[] }[],
): string {
  const body = pages
    .map((page) => {
      const images = page.images
        .map(
          (image) =>
            `<image:image><image:loc>${escapeXml(image.loc)}</image:loc><image:title>${escapeXml(image.title)}</image:title></image:image>`,
        )
        .join("");
      return `<url><loc>${escapeXml(page.url)}</loc><lastmod>${page.lastModified.toISOString()}</lastmod>${images}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

export function sitemapXml(urls: { url: string; lastModified: Date }[]): string {
  const body = urls
    .map(
      (item) =>
        `<url><loc>${escapeXml(item.url)}</loc><lastmod>${item.lastModified.toISOString()}</lastmod></url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
