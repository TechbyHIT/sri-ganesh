import type { NextConfig } from "next";
import { allRedirects } from "./src/lib/routing/redirects";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return allRedirects();
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-inline'",
              "connect-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
