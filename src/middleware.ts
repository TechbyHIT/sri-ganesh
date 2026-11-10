import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { legacyRedirect } from "@/seo/legacy";
import { adminCredentialsMatch, adminEnabled } from "@/lib/admin-auth";

function guardAdmin(request: NextRequest) {
  if (!adminEnabled()) return new NextResponse("Not found", { status: 404 });
  if (adminCredentialsMatch(request.headers.get("authorization"))) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Sri Ganesha admin", charset="UTF-8"' },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin")) return guardAdmin(request);
  const destination = legacyRedirect(pathname);
  if (!destination || destination === pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|sitemaps|robots.txt|gallery|media|brand).*)"],
};
