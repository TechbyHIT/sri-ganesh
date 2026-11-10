import { chunkSize, parseChunk, urlset, urlsFor } from "@/seo/sitemaps";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ type: string }> }) {
  const { type } = await context.params;
  const chunk = parseChunk(type);
  if (!chunk) return new Response("Not found", { status: 404 });
  const urls = urlsFor(chunk.group).slice(chunk.index * chunkSize, (chunk.index + 1) * chunkSize);
  if (!urls.length && chunk.index > 0) return new Response("Not found", { status: 404 });
  return new Response(urlset(urls), {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
