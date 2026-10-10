import { ServiceIndex } from "@/components/ServiceIndex/ServiceIndex";
import { getServicesIndexMetadata } from "@/lib/seo";

export const metadata = getServicesIndexMetadata();

export default function ServicesPage() {
  return <ServiceIndex />;
}
