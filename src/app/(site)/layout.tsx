import { Footer } from "@/components/Footer";
import { ServiceGrid } from "@/components/ServiceGrid";
import { SiteChrome } from "@/components/SiteChrome";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteChrome />
      <main id="content">{children}</main>
      <ServiceGrid />
      <Footer />
    </>
  );
}
