import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { Analytics } from "@/components/analytics/Analytics";
import { Cta } from "@/components/Cta/Cta";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { FloatingActions } from "@/components/home/FloatingActions";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/data/site";
import { organizationSchema } from "@/lib/schema";
import "@/lib/validate-seo";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Segoe UI", "sans-serif"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
  },
  twitter: {
    card: "summary",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.language} className={manrope.variable}>
      <body>
        <JsonLd data={organizationSchema()} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Cta />
        <Footer />
        <FloatingActions />
        <Analytics />
      </body>
    </html>
  );
}
