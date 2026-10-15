import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { site } from "@/config/site";
import { SiteChrome } from "@/components/SiteChrome";
import { ServiceGrid } from "@/components/ServiceGrid";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Invisible Grills & Safety Nets in Andhra Pradesh | Sri Ganesha",
    template: "%s | Sri Ganesha Home Safety",
  },
  description: site.description,
  openGraph: {
    title: "Invisible Grills & Safety Nets in Andhra Pradesh",
    description: site.description,
    locale: "en_IN",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  description: site.description,
  email: site.email,
  areaServed: { "@type": "State", name: "Andhra Pradesh" },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  url: site.url,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body id="top" className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        <SiteChrome />
        <main id="content">{children}</main>
        <ServiceGrid />
        <Footer />
      </body>
    </html>
  );
}
