import type { LocationSource } from "@/data/types";

export const locationSources: LocationSource[] = [
  {
    id: "ap-district-portal",
    name: "Andhra Pradesh District Portal",
    url: "https://andhrapradesh.s3waas.gov.in/",
    level: "district",
    verifiedAt: "2026-10-09",
    knownGaps:
      "The portal lists district names and Telugu labels. It does not list revenue divisions, mandals, municipalities, or villages.",
    validationStatus: "verified",
  },
  {
    id: "tirupati-revenue-divisions",
    name: "Tirupati District revenue divisions",
    url: "https://tirupati.ap.gov.in/revenue-division/",
    level: "revenue-division",
    verifiedAt: "2026-10-09",
    knownGaps: "This page covers Tirupati district only.",
    validationStatus: "partial",
  },
  {
    id: "tirupati-mandals",
    name: "Tirupati District mandal list",
    url: "https://tirupati.ap.gov.in/mandals/",
    level: "mandal",
    verifiedAt: "2026-10-09",
    knownGaps: "36 mandals for Tirupati district. Other district mandal lists are in official-mandals.ts.",
    validationStatus: "partial",
  },
  {
    id: "district-mandal-pages",
    name: "Official district mandal pages",
    url: "https://ntr.ap.gov.in/mandals/",
    level: "mandal",
    verifiedAt: "2026-10-09",
    knownGaps:
      "Imported division and mandal names from district sites for every district except Alluri Sitharama Raju and YSR Kadapa. Those two sites did not publish a mandal table. Where a mandal list did not name the revenue division, the mandal is stored under the district. These records are not service areas.",
    validationStatus: "partial",
  },
  {
    id: "district-village-pages",
    name: "Official district village and gram panchayat tables",
    url: "https://tirupati.ap.gov.in/village-panchayats/",
    level: "village",
    verifiedAt: "2026-10-09",
    knownGaps:
      "These district-site gram-panchayat tables were replaced by the Local Government Directory village list. They are no longer the village source.",
    validationStatus: "partial",
  },
  {
    id: "lgd-villages-2026-10-09",
    name: "Local Government Directory villages and subdistricts",
    url: "https://lgdirectory.gov.in/",
    level: "village",
    verifiedAt: "2026-10-09",
    knownGaps:
      "The 9 October 2026 state download lists 28 districts. Markapuram (21 subdistricts, 510 villages) and Polavaram (12 subdistricts, 834 villages) are not on the Andhra Pradesh District Portal and were not imported. The other 16,613 villages and the subdistricts that were not already stored are unpublished administrative records. No service coverage was added.",
    validationStatus: "partial",
  },
  {
    id: "ntr-about",
    name: "NTR District about page",
    url: "https://ntr.ap.gov.in/about-district/",
    level: "revenue-division",
    verifiedAt: "2026-10-09",
    knownGaps:
      "Names three revenue divisions and says the headquarters is Vijayawada. It does not list the 20 mandals.",
    validationStatus: "partial",
  },
  {
    id: "east-godavari-about",
    name: "East Godavari about page",
    url: "https://eastgodavari.ap.gov.in/about-district/",
    level: "district",
    verifiedAt: "2026-10-09",
    knownGaps:
      "Confirms the headquarters name Rajamahendravaram. The same page cites both 19 and 22 mandals, so no East Godavari mandal list was imported.",
    validationStatus: "partial",
  },
  {
    id: "tirupati-about",
    name: "Tirupati District about page",
    url: "https://tirupati.ap.gov.in/about-district/",
    level: "city",
    verifiedAt: "2026-10-09",
    knownGaps: "Used to confirm Tirupati town is the district headquarters. Municipality names on that page were not imported as separate town records.",
    validationStatus: "partial",
  },
  {
    id: "existing-catalogue",
    name: "Existing project location catalogue",
    url: "",
    level: "locality",
    verifiedAt: "2026-10-09",
    knownGaps:
      "Madhurawada, Gajuwaka, and the unpublished colonies were already in data/locations.ts. They were not matched to a government colony gazetteer in this import.",
    validationStatus: "partial",
  },
  {
    id: "user-area-starter-pdf",
    name: "Andhra Pradesh district-wise areas starter list",
    url: "",
    level: "mixed planning reference",
    verifiedAt: "2026-10-09",
    knownGaps:
      "Imported as unconfirmed towns under the 26 portal districts. The PDF is not an exhaustive gazetteer and does not name mandals. Addanki, Atmakur, Ponnur, and Prathipadu were listed under more than one district and were left out. Markapuram, Giddalur, and Polavaram were left out. A later coastal list added Gudem Kotha Veedhi, Narsipatnam Town, Narsipatnam Rural, Yelamanchili Town, Bayyavaram, Atchutapuram SEZ, Tagarapuvalasa, and Annavaram near Tuni. Existing cities, localities, and Tirupati mandals were not duplicated. No service coverage was added.",
    validationStatus: "partial",
  },
];
