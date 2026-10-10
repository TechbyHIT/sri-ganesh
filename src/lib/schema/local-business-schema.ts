import { business } from "@/data/business";
import { organizationSchema } from "@/lib/schema";

/** LocalBusiness is emitted only when a complete street address exists. */
export function localBusinessSchema(): Record<string, unknown> | undefined {
  if (!business.address) {
    return undefined;
  }

  return {
    ...organizationSchema(),
    "@type": "LocalBusiness",
  };
}
