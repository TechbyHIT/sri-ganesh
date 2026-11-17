import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { site } from "@/config/site";
import { heroImage } from "@/data/gallery";
import { absoluteUrl } from "@/seo/urls";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Invisible Grills & Safety Nets in Andhra Pradesh | Sri Ganesha",
    template: "%s | Sri Ganesha",
  },
  description: site.description,
  openGraph: {
    title: "Invisible Grills & Safety Nets in Andhra Pradesh",
    description: site.description,
    locale: "en_IN",
    type: "website",
    siteName: site.name,
    url: site.url,
    images: [{ url: absoluteUrl(heroImage("site-share", "invisible-grills")), alt: "Invisible grills and safety nets in Andhra Pradesh" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invisible Grills & Safety Nets in Andhra Pradesh",
    description: site.description,
    images: [absoluteUrl(heroImage("site-share", "invisible-grills"))],
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/brand/logo-header.webp`,
    email: site.email,
    ...(site.phoneTel ? { contactPoint: { "@type": "ContactPoint", telephone: site.phoneTel, contactType: "customer service", areaServed: "IN-AP" } } : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    email: site.email,
    ...(site.phoneTel ? { telephone: site.phoneTel } : {}),
    areaServed: { "@type": "State", name: "Andhra Pradesh" },
    address: {
      "@type": "PostalAddress",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    parentOrganization: { "@id": `${site.url}/#organization` },
    url: site.url,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: site.url,
    inLanguage: "en-IN",
    publisher: { "@id": `${site.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/locations/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        {process.env.NODE_ENV === "development" ? (
          <script
            id="ignore-cursor-browser-attrs"
            dangerouslySetInnerHTML={{
              __html: `(function(){var skip="data-cursor-ref";var desc=Object.getOwnPropertyDescriptor(Element.prototype,"attributes");if(!desc||!desc.get)return;function visible(map){var items=[];for(var i=0;i<map.length;i++)if(map[i].name!==skip)items.push(map[i]);return items;}Object.defineProperty(Element.prototype,"attributes",{configurable:true,enumerable:desc.enumerable,get:function(){var map=desc.get.call(this);return new Proxy(map,{get:function(target,prop,receiver){if(prop==="length")return visible(target).length;if(String(prop).charAt(0)>="0"&&String(prop).charAt(0)<="9")return visible(target)[Number(prop)];if(prop==="item")return function(index){return visible(target)[index]||null};var value=Reflect.get(target,prop,receiver);return typeof value==="function"?value.bind(target):value;}});}});var getAttribute=Element.prototype.getAttribute;Element.prototype.getAttribute=function(name){if(name===skip)return null;return getAttribute.call(this,name);};})();`,
            }}
          />
        ) : null}
      </head>
      <body id="top" className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
