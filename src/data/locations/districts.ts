import type { AdminLocation } from "@/data/types";

const sourceUrl = "https://andhrapradesh.s3waas.gov.in/";
const verifiedAt = "2026-10-09";

/**
 * Slugs that already belong to a published city stay on the city.
 * The district uses a -district suffix so the two records do not share a URL.
 */
const citySlugCollision = new Set(["guntur", "kakinada", "tirupati", "visakhapatnam"]);

function district(
  key: string,
  name: string,
  te: string,
  aliases: string[] = [],
): AdminLocation {
  const slug = citySlugCollision.has(key) ? `${key}-district` : key;

  return {
    id: `district-${key}`,
    name,
    slug,
    type: "district",
    parentId: "state-andhra-pradesh",
    districtId: `district-${key}`,
    mandalId: null,
    aliases,
    languageNames: { te },
    sourceUrl,
    verifiedAt,
    active: true,
    serviceAvailable: false,
    indexable: false,
    contentQualityStatus: "administrative-record",
  };
}

export const andhraPradesh: AdminLocation = {
  id: "state-andhra-pradesh",
  name: "Andhra Pradesh",
  slug: "andhra-pradesh",
  type: "state",
  parentId: null,
  districtId: null,
  mandalId: null,
  aliases: [],
  languageNames: { te: "ఆంధ్రప్రదేశ్" },
  sourceUrl,
  verifiedAt,
  active: true,
  serviceAvailable: false,
  indexable: false,
  contentQualityStatus: "administrative-record",
};

/** Names and Telugu labels as shown on the state district portal on 9 October 2026. */
export const districts: AdminLocation[] = [
  district("alluri-sitharama-raju", "Alluri Sitharama Raju", "శ్రీ అల్లూరి సీతారామ రాజు జిల్లా", [
    "Alluri Sitarama Raju",
  ]),
  district("ananthapuramu", "Ananthapuramu", "అనంతపురము", ["Anantapur"]),
  district("annamayya", "Annamayya", "అన్నమయ్య జిల్లా"),
  district("anakapalli", "Anakapalli", "అనకాపల్లి జిల్లా"),
  district("bapatla", "Bapatla", "బాపట్ల జిల్లా"),
  district("chittoor", "Chittoor", "చిత్తూరు"),
  district("east-godavari", "East Godavari", "తూర్పు గోదావరి"),
  district("eluru", "Eluru", "ఏలూరు జిల్లా"),
  district("guntur", "Guntur", "గుంటూరు"),
  district("kakinada", "Kakinada", "కాకినాడ జిల్లా"),
  district("konaseema", "Dr. B.R. Ambedkar Konaseema", "కోనసీమ జిల్లా", ["Konaseema"]),
  district("krishna", "Krishna", "కృష్ణా"),
  district("kurnool", "Kurnool", "కర్నూలు"),
  district("nandyal", "Nandyal", "నంద్యాల జిల్లా"),
  district("ntr", "NTR", "ఎన్.టి.ఆర్ జిల్లా", ["N.T.R."]),
  district("palnadu", "Palnadu", "పల్నాడు జిల్లా"),
  district("parvathipuram-manyam", "Parvathipuram Manyam", "పార్వతీపురం మన్యం జిల్లా"),
  district("prakasam", "Prakasam", "ప్రకాశం"),
  district("sri-sathya-sai", "Sri Sathya Sai", "శ్రీ సత్యసాయి జిల్లా"),
  district("sps-nellore", "Sri Potti Sriramulu Nellore", "శ్రీ పొట్టి శ్రీరాములు నెల్లూరు", [
    "SPS Nellore",
    "Nellore",
  ]),
  district("srikakulam", "Srikakulam", "శ్రీకాకుళం"),
  district("tirupati", "Tirupati", "తిరుపతి జిల్లా"),
  district("visakhapatnam", "Visakhapatnam", "విశాఖపట్నం", ["Vishakapatnam"]),
  district("vizianagaram", "Vizianagaram", "విజయనగరం"),
  district("west-godavari", "West Godavari", "పశ్చిమ గోదావరి"),
  district("ysr-kadapa", "YSR Kadapa", "వై ఎస్ ఆర్", ["Kadapa", "YSR"]),
];
