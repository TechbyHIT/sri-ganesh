import { LocationIndex } from "@/components/LocationIndex/LocationIndex";
import { getLocationsIndexMetadata } from "@/lib/seo";

export const metadata = getLocationsIndexMetadata();

export default function LocationsPage() {
  return <LocationIndex />;
}
