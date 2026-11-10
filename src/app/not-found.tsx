import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { NotFoundBody } from "@/components/NotFoundBody";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SiteChrome />
      <main id="content">
        <NotFoundBody />
      </main>
      <Footer />
    </>
  );
}
