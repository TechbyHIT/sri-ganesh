import { sitemapIndex } from "@/seo/sitemaps";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(sitemapIndex(), {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  });
}
