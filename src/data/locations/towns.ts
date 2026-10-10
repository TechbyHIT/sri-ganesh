import type { AdminLocation } from "@/data/types";
import { toLocationSlug } from "@/lib/location-slugs";

const sourceUrl = "andhra-pradesh-district-wise-areas-starter-list";
const verifiedAt = "2026-10-09";

/**
 * Selected towns and areas from the 9 October 2026 planning list.
 * The list says it is not an official exhaustive gazetteer.
 * A town sits under its district because the list does not name a mandal.
 * indexable and serviceAvailable stay false.
 * Names listed under two districts are omitted: Addanki, Atmakur, Ponnur, Prathipadu.
 * Markapuram, Giddalur, and Polavaram are omitted.
 * Names that already exist as cities, localities, or Tirupati mandals are omitted.
 */
const listed: { districtId: string; names: string[]; sourceUrl?: string }[] = [
  {
    districtId: "district-alluri-sitharama-raju",
    names: ["Paderu", "Araku Valley", "Chintapalle", "Ananthagiri", "Hukumpeta", "Dumbriguda", "Munchingiputtu", "Pedabayalu", "G. Madugula", "Koyyuru", "Chintur", "Rampachodavaram"],
  },
  {
    districtId: "district-anakapalli",
    names: ["Anakapalli", "Narsipatnam", "Yelamanchili", "Chodavaram", "Madugula", "Payakaraopeta", "Atchutapuram", "Rambilli", "Kasimkota", "Butchayyapeta"],
  },
  {
    districtId: "district-ananthapuramu",
    names: ["Anantapuramu", "Gooty", "Guntakal", "Tadipatri", "Kalyandurg", "Rayadurg", "Uravakonda", "Pamidi", "Singanamala", "Narpala"],
  },
  {
    districtId: "district-annamayya",
    names: ["Rayachoti", "Madanapalle", "Rajampet", "Pileru", "Railway Koduru", "Lakkireddipalli", "Ramapuram", "Veeraballi", "Sambepalli", "T. Sundupalli"],
  },
  {
    districtId: "district-bapatla",
    names: ["Bapatla", "Chirala", "Repalle", "Karlapalem", "Vetapalem", "Tsundur", "Amruthalur", "Nagaram"],
  },
  {
    districtId: "district-chittoor",
    names: ["Chittoor", "Palamaner", "Punganur", "Kuppam", "Bangarupalem", "Gangadhara Nellore", "Gudipala", "Yadamarri", "Irala", "Thavanampalle"],
  },
  {
    districtId: "district-konaseema",
    names: ["Amalapuram", "Mandapeta", "Ramachandrapuram", "Mummidivaram", "Kothapeta", "Razole", "Allavaram", "P. Gannavaram", "Ainavilli", "Uppalaguptam"],
  },
  {
    districtId: "district-east-godavari",
    names: ["Kovvur", "Nidadavole", "Anaparthi", "Biccavolu", "Gokavaram", "Rajanagaram", "Seethanagaram", "Kadiam", "Devarapalle"],
  },
  {
    districtId: "district-eluru",
    names: ["Eluru", "Jangareddygudem", "Nuzvid", "Chintalapudi", "Kaikalur", "Dwaraka Tirumala", "Bhimadole", "Pedapadu", "Unguturu"],
  },
  {
    districtId: "district-guntur",
    names: ["Tenali", "Mangalagiri", "Tadepalli", "Tadikonda", "Pedakakani", "Chebrolu", "Vatticherukuru"],
  },
  {
    districtId: "district-kakinada",
    names: ["Peddapuram", "Samalkot", "Tuni", "Pithapuram", "Jaggampeta", "Gandepalli", "U. Kothapalli"],
  },
  {
    districtId: "district-krishna",
    names: ["Machilipatnam", "Gudivada", "Pedana", "Vuyyuru", "Pamarru", "Avanigadda", "Bantumilli", "Challapalli", "Ghantasala", "Movva"],
  },
  {
    districtId: "district-kurnool",
    names: ["Kurnool", "Adoni", "Yemmiganur", "Alur", "Pattikonda", "Kodumur", "Mantralayam", "Kosigi", "Nandavaram", "C. Belagal"],
  },
  {
    districtId: "district-nandyal",
    names: ["Nandyal", "Allagadda", "Dhone", "Banaganapalle", "Bethamcherla", "Koilkuntla", "Mahanandi", "Panyam", "Sirivella"],
  },
  {
    districtId: "district-ntr",
    names: ["Jaggayyapeta", "Nandigama", "Tiruvuru", "Mylavaram", "G. Konduru", "Ibrahimpatnam", "Kanchikacherla", "Penuganchiprolu", "Vatsavai"],
  },
  {
    districtId: "district-palnadu",
    names: ["Narasaraopet", "Chilakaluripet", "Sattenapalle", "Piduguralla", "Macherla", "Vinukonda", "Gurazala", "Dachepalle", "Rentachintala", "Amaravathi"],
  },
  {
    districtId: "district-parvathipuram-manyam",
    names: ["Parvathipuram", "Salur", "Palakonda", "Kurupam", "Seethampeta", "Gummalakshmipuram", "Jiyyammavalasa", "Komarada", "Garugubilli", "Bhamini"],
  },
  {
    districtId: "district-prakasam",
    names: ["Ongole", "Kandukur", "Darsi", "Chimakurthy", "Tangutur", "Kondapi", "Singarayakonda", "Santhanuthalapadu"],
  },
  {
    districtId: "district-sps-nellore",
    names: ["Nellore", "Kavali", "Gudur", "Buchireddypalem", "Indukurpet"],
  },
  {
    districtId: "district-sri-sathya-sai",
    names: ["Puttaparthi", "Hindupur", "Dharmavaram", "Kadiri", "Penukonda", "Gorantla", "Madakasira", "Parigi", "Roddam", "Bukkapatnam"],
  },
  {
    districtId: "district-srikakulam",
    names: ["Srikakulam", "Amadalavalasa", "Palasa", "Tekkali", "Ichchapuram", "Narasannapeta", "Ponduru", "Etcherla", "Pathapatnam", "Sompeta"],
  },
  {
    districtId: "district-tirupati",
    names: ["Nagari"],
  },
  {
    districtId: "district-visakhapatnam",
    names: ["Pendurthi", "Anandapuram", "Bheemunipatnam", "Seethammadhara", "Gopalapatnam", "Maharani Peta", "Mulagada"],
  },
  {
    districtId: "district-vizianagaram",
    names: ["Vizianagaram", "Bobbili", "Nellimarla", "Gajapathinagaram", "Cheepurupalli", "Srungavarapukota", "Kothavalasa", "Denkada", "Bondapalli", "Gurla"],
  },
  {
    districtId: "district-west-godavari",
    names: ["Bhimavaram", "Tadepalligudem", "Tanuku", "Palakollu", "Narsapuram", "Akividu", "Undi", "Penugonda", "Attili", "Iragavaram"],
  },
  {
    districtId: "district-ysr-kadapa",
    names: ["Kadapa", "Proddatur", "Pulivendula", "Jammalamadugu", "Badvel", "Mydukur", "Kamalapuram", "Chapadu", "Chennur", "Vempalli"],
  },
  {
    districtId: "district-alluri-sitharama-raju",
    names: ["Gudem Kotha Veedhi"],
    sourceUrl: "user-coastal-area-list",
  },
  {
    districtId: "district-anakapalli",
    names: ["Narsipatnam Town", "Narsipatnam Rural", "Yelamanchili Town", "Bayyavaram", "Atchutapuram SEZ"],
    sourceUrl: "user-coastal-area-list",
  },
  {
    districtId: "district-visakhapatnam",
    names: ["Tagarapuvalasa"],
    sourceUrl: "user-coastal-area-list",
  },
  {
    districtId: "district-kakinada",
    names: ["Annavaram"],
    sourceUrl: "user-coastal-area-list",
  },
];

/** Slugs already used by a district, city, locality, or mandal. */
const slugOverride: Record<string, string> = {
  Anakapalli: "anakapalli-town",
  Bapatla: "bapatla-town",
  Chittoor: "chittoor-town",
  Eluru: "eluru-town",
  Kadapa: "kadapa-town",
  Kurnool: "kurnool-town",
  Nandyal: "nandyal-town",
  Nellore: "nellore-town",
  Ramachandrapuram: "ramachandrapuram-konaseema",
  Srikakulam: "srikakulam-town",
  Vizianagaram: "vizianagaram-town",
  Bayyavaram: "bayyavaram-anakapalli",
  Annavaram: "annavaram-kakinada",
};

export const towns: AdminLocation[] = listed.flatMap((group) =>
  group.names.map((name) => {
    const slug = slugOverride[name] ?? toLocationSlug(name);

    return {
      id: `town-${slug}`,
      name,
      slug,
      type: "town" as const,
      parentId: group.districtId,
      districtId: group.districtId,
      mandalId: null,
      aliases: [],
      languageNames: {},
      sourceUrl: group.sourceUrl ?? sourceUrl,
      verifiedAt,
      active: true,
      serviceAvailable: false,
      indexable: false,
      contentQualityStatus: "unconfirmed" as const,
    };
  }),
);
