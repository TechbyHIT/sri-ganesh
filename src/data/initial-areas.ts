import { locationRecords } from "@/data/locations";

export const initialAreas = locationRecords.filter((location) => location.type === "locality");
