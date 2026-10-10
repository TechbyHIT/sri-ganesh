import { serviceLocations } from "../src/data/serviceLocations";
import { getLocationBySlug } from "../src/lib/locations";
import { organizationSchema, serviceLocationSchema, serviceSchema } from "../src/lib/schema";
import { getAllServices, getServiceBySlug } from "../src/lib/services";
import { writeReport } from "./write-json";

const blocked = ["aggregateRating", "review", "offers", "priceRange"];
const failures: string[] = [];

function check(label: string, value: unknown) {
  const serialized = JSON.stringify(value);
  for (const key of blocked) {
    if (serialized.includes(`"${key}"`)) failures.push(`${label} includes ${key}`);
  }
}

check("organization", organizationSchema());
for (const service of getAllServices()) check(service.slug, serviceSchema(service));
for (const relation of serviceLocations) {
  const service = getServiceBySlug(relation.serviceSlug);
  const location = getLocationBySlug(relation.locationSlug);
  if (service && location) check(`${relation.serviceSlug}+${relation.locationSlug}`, serviceLocationSchema(service, location, relation));
}

writeReport("schema-audit.json", { failures });
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ failures: 0 }));
