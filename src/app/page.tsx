import { HomeLanding } from "@/components/home/HomeLanding";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeFaqs } from "@/data/home-landing";
import { services } from "@/data/services";
import { breadcrumbSchema, faqSchema, homeLocalBusinessSchema, serviceSchema, websiteSchema } from "@/lib/schema";
import { getHomeMetadata } from "@/lib/seo";

export const metadata = getHomeMetadata();

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          websiteSchema(),
          homeLocalBusinessSchema(),
          breadcrumbSchema([{ label: "Home", href: "/" }]),
          faqSchema([...homeFaqs]),
          ...services.filter((service) => service.active).map((service) => serviceSchema(service)),
        ]}
      />
      <HomeLanding />
    </>
  );
}
