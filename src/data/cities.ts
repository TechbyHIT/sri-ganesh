import { extraCities } from "./extra-cities";
import { moreTowns } from "./more-towns";
import { attachAreas } from "./neighbourhoods";

export type Area = {
  slug: string;
  name: string;
  detail: string;
};

export type City = {
  slug: string;
  name: string;
  region: "Uttarandhra" | "Coastal Andhra" | "Rayalaseema";
  district: string;
  intro: string;
  climate: string;
  housing: string;
  materialHint: string;
  visitNote: string;
  localities: string[];
  areas: Area[];
};

export const districts = [
  { name: "Srikakulam", hub: "Srikakulam" },
  { name: "Vizianagaram", hub: "Vizianagaram" },
  { name: "Parvathipuram Manyam", hub: "Vizianagaram" },
  { name: "Alluri Sitharama Raju", hub: "Narsipatnam" },
  { name: "Visakhapatnam", hub: "Visakhapatnam" },
  { name: "Anakapalli", hub: "Anakapalle" },
  { name: "Kakinada", hub: "Kakinada" },
  { name: "Dr. B.R. Ambedkar Konaseema", hub: "Amalapuram" },
  { name: "East Godavari", hub: "Rajahmundry" },
  { name: "Eluru", hub: "Eluru" },
  { name: "West Godavari", hub: "Bhimavaram" },
  { name: "Krishna", hub: "Machilipatnam" },
  { name: "NTR", hub: "Vijayawada" },
  { name: "Guntur", hub: "Guntur" },
  { name: "Bapatla", hub: "Chirala" },
  { name: "Palnadu", hub: "Narasaraopet" },
  { name: "Prakasam", hub: "Ongole" },
  { name: "SPSR Nellore", hub: "Nellore" },
  { name: "Tirupati", hub: "Tirupati" },
  { name: "Chittoor", hub: "Chittoor" },
  { name: "Annamayya", hub: "Madanapalle" },
  { name: "YSR Kadapa", hub: "Kadapa" },
  { name: "Anantapur", hub: "Anantapur" },
  { name: "Sri Sathya Sai", hub: "Hindupur" },
  { name: "Kurnool", hub: "Kurnool" },
  { name: "Nandyal", hub: "Nandyal" },
] as const;

const citySeeds: City[] = [
  {
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    region: "Uttarandhra",
    district: "Visakhapatnam",
    intro:
      "Visakhapatnam is Andhra Pradesh's main coastal city: high-rise corridors at Madhurawada and the beach belt, older blocks around NAD and Gajuwaka, and a salt wind that shows up on ordinary mild steel within a few monsoons.",
    climate:
      "Bay humidity and salt-laden air reach balconies that face the sea or sit on an open ridge. Cable and hook grade matters more here than in a dry inland town.",
    housing:
      "high-rise apartments, gated communities and independent houses on a hilly coastal plan",
    materialHint:
      "For sea-facing and ridge balconies we usually discuss SS316 cable and stainless hooks. Sheltered inland-facing flats in the same city may be fine on SS304. The visit decides.",
    visitNote:
      "Visakhapatnam is a primary measurement hub. Beach Road, MVP, Madhurawada, Gajuwaka and NAD are on the regular rota.",
    localities: ["Madhurawada", "MVP Colony", "Gajuwaka", "PM Palem", "Seethammadhara", "Rushikonda", "NAD", "Dwaraka Nagar"],
    areas: [
      { slug: "madhurawada", name: "Madhurawada", detail: "Newer apartment towers along the IT and beach approach, with wide balconies and society rules on facade work." },
      { slug: "mvp-colony", name: "MVP Colony", detail: "Established residential blocks where balcony depth and older railings vary from flat to flat." },
      { slug: "gajuwaka", name: "Gajuwaka", detail: "Dense housing near the industrial south, with pigeon pressure on utility ledges and ducts." },
      { slug: "pm-palem", name: "PM Palem", detail: "Mid and high-rise flats on the northern corridor, often with a clear sea breeze on upper floors." },
      { slug: "seethammadhara", name: "Seethammadhara", detail: "Older apartments and houses where window openings and stair voids need individual measurement." },
      { slug: "rushikonda", name: "Rushikonda", detail: "Exposed hill and beach sites where wind and salt both belong in the material note." },
      { slug: "nad-junction", name: "NAD", detail: "Mixed residential stock around the naval and transit belt, including compact balconies." },
      { slug: "gopalapatnam", name: "Gopalapatnam", detail: "Growing apartment lanes west of the core, with new railings that still leave a climb gap." },
      { slug: "kommadi", name: "Kommadi", detail: "Northern residential growth with villas and flats sharing the same access roads." },
      { slug: "yendada", name: "Yendada", detail: "Hillside homes and apartments where balcony corners turn with the slope." },
    ],
  },
  {
    slug: "anakapalle",
    name: "Anakapalle",
    region: "Uttarandhra",
    district: "Anakapalli",
    intro:
      "Anakapalle sits on the Visakhapatnam fringe: jaggery-town houses, new apartment lanes, and a coastal humidity that still reaches fittings even a little inland.",
    climate: "Warm, humid and close enough to the Bay that unprotected steel weathers faster than in Rayalaseema.",
    housing: "independent houses and new mid-rise apartments",
    materialHint: "SS304 is the usual starting point, with SS316 discussed for fully exposed terraces.",
    visitNote: "Anakapalle is measured on the Visakhapatnam rota, including nearby Yellamanchili when the slot allows.",
    localities: ["Anakapalle town", "Kasimkota road", "Sabbavaram side", "Yellamanchili"],
    areas: [],
  },
  {
    slug: "narsipatnam",
    name: "Narsipatnam",
    region: "Uttarandhra",
    district: "Anakapalli",
    intro:
      "Narsipatnam is the practical town for homes toward the Agency belt. Houses are mostly independent, with open terraces and stair voids rather than glass high-rises.",
    climate: "Humid foothill weather, heavy rain bursts, and less direct salt than the Visakhapatnam beach.",
    housing: "independent houses, small apartment blocks and school compounds",
    materialHint: "UV-stabilised netting matters because terraces sit in open sun after rain clears. Cable grade is confirmed on site.",
    visitNote: "Narsipatnam and practical approaches toward Paderu are scheduled from the north coast rota. Remote hamlets are confirmed before we promise a day.",
    localities: ["Narsipatnam town", "Makavarapalem side", "Kotauratla road", "Agency approach"],
    areas: [],
  },
  {
    slug: "yellamanchili",
    name: "Yellamanchili",
    region: "Uttarandhra",
    district: "Anakapalli",
    intro:
      "Yellamanchili is a coastal-belt town of houses and small blocks between Anakapalle and Tuni, with balconies that take both sun and moist wind.",
    climate: "Humid coastal plain. Monsoon wetting is routine, so edge ropes and stainless hooks earn their place.",
    housing: "town houses and low-rise apartments",
    materialHint: "Stainless hooks and UV mesh are the default conversation. Cable grade follows how exposed the balcony is.",
    visitNote: "Yellamanchili is covered with the Anakapalle–Tuni run.",
    localities: ["Town centre", "NH side", "Station road", "Outskirts layouts"],
    areas: [],
  },
  {
    slug: "vizianagaram",
    name: "Vizianagaram",
    region: "Uttarandhra",
    district: "Vizianagaram",
    intro:
      "Vizianagaram mixes a compact old town with newer layouts and a fort-city pattern of houses that open onto internal courts and terraces.",
    climate: "Warm and seasonally humid, with less salt load than a beach-front flat in Visakhapatnam.",
    housing: "town houses, new apartments and school buildings",
    materialHint: "SS304 cable and UV HDPE cover most homes. Exposed terrace jobs get a separate sun note.",
    visitNote: "Vizianagaram town and the road toward Parvathipuram are measured on request from the Uttarandhra schedule.",
    localities: ["Fort area", "Contonment side", "Dasannapeta", "Ring-road layouts"],
    areas: [],
  },
  {
    slug: "srikakulam",
    name: "Srikakulam",
    region: "Uttarandhra",
    district: "Srikakulam",
    intro:
      "Srikakulam is the northern district centre: houses along the main roads, newer colonies, and a humid coastal-plain climate that rewards a neat, rust-aware finish.",
    climate: "Humid, with monsoon rain and a soft salt influence on fully exposed roofs.",
    housing: "independent houses, small apartments and coaching compounds",
    materialHint: "We specify stainless fixings in the quote so terrace and balcony hardware is not left as unmarked mild steel.",
    visitNote: "Srikakulam town, and Palasa when the day's route supports it, are booked after a call.",
    localities: ["Day & Night Junction side", "Balaga", "New colony", "Palasa road"],
    areas: [],
  },
  {
    slug: "kakinada",
    name: "Kakinada",
    region: "Coastal Andhra",
    district: "Kakinada",
    intro:
      "Kakinada is a port city. Balconies face humid air off the Bay, pigeon nesting is common on apartment ledges, and mosquito pressure in the evenings is a separate job from fall safety.",
    climate: "Salt-influenced humidity for much of the year. Metal that is only painted will mark clothes and walls.",
    housing: "apartments in Suryaraopeta and Jagannaickpur, and houses toward the newer layouts",
    materialHint: "Sea-side and open high floors: discuss SS316. Insect screens, if needed, are quoted apart from safety mesh.",
    visitNote: "Kakinada is a coastal hub. Ramanayyapeta, Suryaraopeta and Jagannaickpur are routine.",
    localities: ["Suryaraopeta", "Jagannaickpur", "Ramanayyapeta", "Balaji Cheruvu", "Gandhi Nagar"],
    areas: [
      { slug: "suryaraopeta", name: "Suryaraopeta", detail: "Apartment streets where balcony pigeon nets and child safety are booked together." },
      { slug: "jagannaickpur", name: "Jagannaickpur", detail: "Established houses and flats with varied railing heights." },
      { slug: "ramanayyapeta", name: "Ramanayyapeta", detail: "Residential pockets with duct and AC-ledge bird issues." },
      { slug: "kakinada-port-side", name: "Port-side neighbourhoods", detail: "More exposed air. Fitting grade is discussed before any cable is ordered." },
    ],
  },
  {
    slug: "tuni",
    name: "Tuni",
    region: "Coastal Andhra",
    district: "Kakinada",
    intro:
      "Tuni is a highway town of houses and small commercial streets between Visakhapatnam and Kakinada, with open terraces used for drying and storage.",
    climate: "Humid coastal plain and strong sun on bare terraces.",
    housing: "independent houses and low-rise buildings",
    materialHint: "UV netting for terraces and SS304 cable for balconies, unless the roof is unusually exposed.",
    visitNote: "Tuni is scheduled with the Kakinada–Anakapalle coastal run.",
    localities: ["Town centre", "NH service lanes", "Housing-board side", "Outgrowth"],
    areas: [],
  },
  {
    slug: "amalapuram",
    name: "Amalapuram",
    region: "Coastal Andhra",
    district: "Dr. B.R. Ambedkar Konaseema",
    intro:
      "Amalapuram serves the Konaseema delta: tightly built houses, canals nearby, and a combination of pigeon, mosquito and balcony-safety requests.",
    climate: "Delta humidity stays high. Nets and cords that are not UV-stabilised tire quickly.",
    housing: "town houses, small apartments and school buildings",
    materialHint: "We separate mosquito screens from safety nets in every Konaseema quote so the two jobs are not mixed.",
    visitNote: "Amalapuram and nearby delta towns are confirmed against ferry and road time before the visit is promised.",
    localities: ["Main bazaar side", "College road", "Housing colonies", "Nearby delta villages on request"],
    areas: [],
  },
  {
    slug: "rajahmundry",
    name: "Rajamahendravaram",
    region: "Coastal Andhra",
    district: "East Godavari",
    intro:
      "Rajamahendravaram, still widely searched as Rajahmundry, spreads across the Godavari with dense apartments, older bungalows and a humid river climate. Balcony safety and pigeon control are the two jobs we are asked for most.",
    climate: "River humidity rather than open-sea salt, but long enough wetting that mild-steel hooks stain.",
    housing: "apartments in Morampudi and Tilak Road, and independent houses toward the outskirts",
    materialHint: "SS304 with stainless hooks is the common specification. SS316 is reserved for fully exposed, slow-drying sites.",
    visitNote: "Rajahmundry is a Godavari hub. Morampudi, Diwan Cheruvu, Lalacheruvu and Innespeta are regular.",
    localities: ["Morampudi", "Tilak Road", "Diwan Cheruvu", "Lalacheruvu", "Innespeta"],
    areas: [
      { slug: "morampudi", name: "Morampudi", detail: "Apartment growth with repeating balcony modules and active pigeon nesting." },
      { slug: "tilak-road", name: "Tilak Road", detail: "Older urban homes where window and stair openings differ on every floor." },
      { slug: "diwan-cheruvu", name: "Diwan Cheruvu", detail: "Residential layouts where terrace drying and child safety are often paired." },
      { slug: "lalacheruvu", name: "Lalacheruvu", detail: "Mixed flats and houses, with duct openings on the apartment side." },
    ],
  },
  {
    slug: "eluru",
    name: "Eluru",
    region: "Coastal Andhra",
    district: "Eluru",
    intro:
      "Eluru is a district centre of houses, colleges and a growing set of apartments. Cloth hangers and balcony nets are as common a request as cable grills.",
    climate: "Warm and humid, with a heavy wash of sun on west-facing balconies.",
    housing: "independent houses, college-area rentals and new apartments",
    materialHint: "Aluminium drying rods and UV mesh are specified separately from any cable work.",
    visitNote: "Eluru town is on the coastal schedule between Vijayawada and the Godavari belt.",
    localities: ["Powerpet", "Ashok Nagar", "R.R. Pet", "Sanivarapupeta", "Eastern layouts"],
    areas: [],
  },
  {
    slug: "bhimavaram",
    name: "Bhimavaram",
    region: "Coastal Andhra",
    district: "West Godavari",
    intro:
      "Bhimavaram is a dense commercial town in West Godavari. Homes sit close together, terraces carry water tanks and drying lines, and pigeons use the gaps between buildings.",
    climate: "Delta humidity with long damp spells in the monsoon.",
    housing: "town houses and mid-rise buildings on narrow plots",
    materialHint: "Hooks and ropes are specified for damp air. We do not leave terrace edges on painted mild steel.",
    visitNote: "Bhimavaram is the West Godavari hub, with Tanuku and Palakollu covered when the route is already in the district.",
    localities: ["Town centre", "Juvvalapalem", "Housing board", "College side"],
    areas: [],
  },
  {
    slug: "tadepalligudem",
    name: "Tadepalligudem",
    region: "Coastal Andhra",
    district: "West Godavari",
    intro:
      "Tadepalligudem combines a busy market core with newer residential colonies. Open staircases in duplex houses and balcony gaps in small apartments are the usual brief.",
    climate: "Humid delta weather. Afternoon sun is strong once the cloud lifts.",
    housing: "duplex houses and small apartment buildings",
    materialHint: "Stair nets and balcony cables are measured as different openings even when they are on the same house.",
    visitNote: "Tadepalligudem is visited with the West Godavari round.",
    localities: ["Main road", "Station side", "New colonies", "Bypass layouts"],
    areas: [],
  },
  {
    slug: "vijayawada",
    name: "Vijayawada",
    region: "Coastal Andhra",
    district: "NTR",
    intro:
      "Vijayawada is a tight, high-traffic city on the Krishna. Flats around Benz Circle, Patamata and the Gunadala hills stack balconies above busy roads, and pigeon mess on ledges is a weekly complaint.",
    climate: "Hot, humid summers and a river influence. Dust and cooking grease on balcony surfaces affect how hooks grip.",
    housing: "dense apartments, hillside homes and commercial-residential blocks",
    materialHint: "SS304 is typical. We look harder at anchor resin where the wall is old plaster over brick.",
    visitNote: "Vijayawada is a primary hub for NTR and Krishna district calls.",
    localities: ["Benz Circle", "Patamata", "Labbipet", "Governorpet", "Gunadala", "Kanuru", "Poranki", "Mogalrajpuram"],
    areas: [
      { slug: "benz-circle", name: "Benz Circle", detail: "Busy apartment frontages where a tidy cable line matters as much as the fall gap." },
      { slug: "patamata", name: "Patamata", detail: "Residential blocks with repeating balconies and active bird ledges." },
      { slug: "labbipet", name: "Labbipet", detail: "Central flats, often with limited service-lift time for materials." },
      { slug: "governorpet", name: "Governorpet", detail: "Older urban fabric. Wall condition is checked before any drill bit is chosen." },
      { slug: "gunadala", name: "Gunadala", detail: "Hill-side homes and apartments with longer stair voids." },
      { slug: "kanuru", name: "Kanuru", detail: "Eastern growth corridor of newer gated apartments." },
      { slug: "poranki", name: "Poranki", detail: "Residential expansion toward the airport side, villas and flats together." },
      { slug: "mogalrajpuram", name: "Mogalrajpuram", detail: "Central-west homes where window grills and balcony nets share one visit." },
    ],
  },
  {
    slug: "machilipatnam",
    name: "Machilipatnam",
    region: "Coastal Andhra",
    district: "Krishna",
    intro:
      "Machilipatnam is a historic port town. Salt air, older houses and a growing set of apartments mean fittings have to be chosen for corrosion, not only for looks.",
    climate: "Direct coastal exposure. Painted iron ages poorly.",
    housing: "town houses and newer colony apartments",
    materialHint: "SS316 is part of the conversation for exposed sea-side openings. Inland-facing rooms in the same house may not need it.",
    visitNote: "Machilipatnam is the Krishna district coastal hub, with Gudivada covered on the same regional plan.",
    localities: ["Bandar town", "Housing colonies", "Port approach", "Gill Centre side"],
    areas: [],
  },
  {
    slug: "gudivada",
    name: "Gudivada",
    region: "Coastal Andhra",
    district: "Krishna",
    intro:
      "Gudivada is an inland Krishna town of busy streets and close-built houses. Balcony and window jobs are usually on narrow plots where the ladder plan matters.",
    climate: "Hot and humid, without the full salt load of Machilipatnam.",
    housing: "town houses and small apartments",
    materialHint: "SS304 and UV mesh cover most quotes. Access, not metal grade, is often the line item that changes the price.",
    visitNote: "Gudivada is scheduled with the Vijayawada–Krishna round.",
    localities: ["Town centre", "Railway side", "New colonies", "Approach roads"],
    areas: [],
  },
  {
    slug: "guntur",
    name: "Guntur",
    region: "Coastal Andhra",
    district: "Guntur",
    intro:
      "Guntur is a commercial city with chilli-market energy and a wide map of houses, colleges and new apartments toward Amaravati Road. Sports nets for schools and balcony safety for flats are both regular work.",
    climate: "Hot summers, a humid monsoon, and strong sun on west walls.",
    housing: "apartments, independent houses and educational campuses",
    materialHint: "Standard SS304 for balconies. Sports nets are specified by impact, not by the balcony-mesh price.",
    visitNote: "Guntur is the hub for Guntur, Bapatla and Palnadu enquiries.",
    localities: ["Brodipet", "Arundelpet", "Lakshmipuram", "Gorantla", "Pattabhipuram", "Nallapadu"],
    areas: [
      { slug: "brodipet", name: "Brodipet", detail: "Central commercial-residential streets with older balconies over shops." },
      { slug: "lakshmipuram", name: "Lakshmipuram", detail: "Residential lanes and houses with stair and window openings." },
      { slug: "gorantla", name: "Gorantla", detail: "A growth corridor of apartments and coaching centres." },
      { slug: "pattabhipuram", name: "Pattabhipuram", detail: "College-side rentals where child safety and mosquito screens are separate requests." },
      { slug: "nallapadu", name: "Nallapadu", detail: "Western residential side, houses and small blocks." },
      { slug: "amaravati-road-guntur", name: "Amaravati Road", detail: "Newer apartments on the corridor toward the capital region." },
    ],
  },
  {
    slug: "tenali",
    name: "Tenali",
    region: "Coastal Andhra",
    district: "Guntur",
    intro:
      "Tenali is a closely built town south of Vijayawada. Houses share walls, terraces are working spaces, and balcony openings are often small but high above the lane.",
    climate: "Humid and hot, typical of the Krishna delta edge.",
    housing: "town houses and a smaller set of apartments",
    materialHint: "Compact spans still need a written measure. We do not price them as a flat 'small balcony' guess.",
    visitNote: "Tenali is covered from the Guntur–Vijayawada schedule.",
    localities: ["Railway station side", "Main bazaar", "Housing board", "Chinaravuru side"],
    areas: [],
  },
  {
    slug: "narasaraopet",
    name: "Narasaraopet",
    region: "Coastal Andhra",
    district: "Palnadu",
    intro:
      "Narasaraopet anchors Palnadu: houses, colleges and a drier feel than the delta, with terraces used hard through the summer.",
    climate: "Hot, with a sharp sun load on nets and a shorter damp season than Kakinada.",
    housing: "independent houses, hostels and new layouts",
    materialHint: "UV stability of the mesh is the first material question. Cable is usually SS304.",
    visitNote: "Narasaraopet is the Palnadu hub. Nearby towns are added when the visit day can absorb the drive.",
    localities: ["Town centre", "College roads", "New layouts", "Bypass"],
    areas: [],
  },
  {
    slug: "ongole",
    name: "Ongole",
    region: "Coastal Andhra",
    district: "Prakasam",
    intro:
      "Ongole is the Prakasam headquarters, a few kilometres from a coast that still influences wind on open terraces. Apartments are increasing along the bypass and the trunk road.",
    climate: "Hot, periodically humid, with cyclone-season winds that belong in the fixing plan for tall, open nets.",
    housing: "houses, bypass apartments and school grounds",
    materialHint: "We talk about wind on overhead nets frankly. A light terrace net is not sold as a storm screen.",
    visitNote: "Ongole is the Prakasam hub. Chirala is linked on the coastal schedule.",
    localities: ["Trunk road", "Bhagyanagar", "Lawyerpet", "Bypass colonies", "Kurnool road side"],
    areas: [],
  },
  {
    slug: "chirala",
    name: "Chirala",
    region: "Coastal Andhra",
    district: "Bapatla",
    intro:
      "Chirala is a handloom and coastal town in Bapatla district. Houses are traditional and close-set, and newer colonies are adding balconies that were never grilled.",
    climate: "Coastal humidity and a steady breeze. Salt is a real factor on the seaward side.",
    housing: "weavers' houses, newer colonies and low-rise blocks",
    materialHint: "Exposed coastal openings are quoted with stainless hardware. Inland lanes of the same town are assessed separately.",
    visitNote: "Chirala and nearby Bapatla-district towns are booked with the south-coastal round.",
    localities: ["Town centre", "Weaving streets", "Beach road side", "New colonies"],
    areas: [],
  },
  {
    slug: "nellore",
    name: "Nellore",
    region: "Coastal Andhra",
    district: "SPSR Nellore",
    intro:
      "Nellore spreads from a dense old town to newer layouts at Magunta and along the bypass. It is far enough south to feel both coastal humidity and long, hot summers.",
    climate: "Humid coast with a harsh summer sun. Balcony hardware should be named, not assumed.",
    housing: "apartments, independent houses and educational campuses",
    materialHint: "SS304 is common in sheltered layouts. Seaward and high open terraces get a corrosion note in the quote.",
    visitNote: "Nellore is the southern coastal hub, covering the city and nearby Kavali on request.",
    localities: ["Magunta Layout", "Balaji Nagar", "Dargamitta", "Vedayapalem", "A.K. Nagar"],
    areas: [
      { slug: "magunta-layout", name: "Magunta Layout", detail: "Planned residential streets with repeat balcony types and active associations." },
      { slug: "dargamitta", name: "Dargamitta", detail: "Central residential area, mixed ages of building and railing." },
      { slug: "vedayapalem", name: "Vedayapalem", detail: "Eastern side homes and smaller blocks." },
      { slug: "balaji-nagar-nellore", name: "Balaji Nagar", detail: "Dense housing where pigeon ledges and window openings share a visit." },
    ],
  },
  {
    slug: "tirupati",
    name: "Tirupati",
    region: "Rayalaseema",
    district: "Tirupati",
    intro:
      "Tirupati combines pilgrimage traffic with a real residential city: apartments at the foothills, houses toward Renigunta, and a hot, drier climate than the Godavari delta.",
    climate: "Hot for much of the year, with strong UV on terraces and a shorter sticky monsoon than the coast.",
    housing: "apartments, lodges that are also homes, and independent houses",
    materialHint: "UV-stabilised mesh is essential on open terraces. Cable is typically SS304 unless a site stays damp.",
    visitNote: "Tirupati is the hub for Tirupati district, including Renigunta and the foothill neighbourhoods.",
    localities: ["Korlagunta", "MR Palli", "Bairagipatted", "Alipiri", "Renigunta", "T.K. Street area"],
    areas: [
      { slug: "korlagunta", name: "Korlagunta", detail: "Residential blocks close to the city's daily traffic." },
      { slug: "mr-palli", name: "MR Palli", detail: "A dense residential pocket with balcony and window work." },
      { slug: "renigunta", name: "Renigunta", detail: "Twin-town houses and apartments, measured with Tirupati." },
      { slug: "alipiri", name: "Alipiri", detail: "Foothill approach where houses step with the slope." },
    ],
  },
  {
    slug: "chittoor",
    name: "Chittoor",
    region: "Rayalaseema",
    district: "Chittoor",
    intro:
      "Chittoor is a district town near the Tamil Nadu border, with houses, small industries and a dry heat that is harder on plastic fittings than on stainless cable.",
    climate: "Hot and relatively dry, with sharp summer sun.",
    housing: "independent houses and growing apartment streets",
    materialHint: "SS304 cable and UV HDPE. We avoid unspecified plastic spikes that chalk in this sun.",
    visitNote: "Chittoor is scheduled with the southern Rayalaseema round.",
    localities: ["Town centre", "Gandhipuram", "Housing board", "Bypass"],
    areas: [],
  },
  {
    slug: "madanapalle",
    name: "Madanapalle",
    region: "Rayalaseema",
    district: "Annamayya",
    intro:
      "Madanapalle sits higher and cooler than the Rayalaseema plain, a town of colleges, houses and a growing ring of layouts. It is the practical base for Annamayya district visits.",
    climate: "Milder than Anantapur, still a high UV load on exposed mesh, with cooler nights.",
    housing: "college-town houses, hostels and new layouts",
    materialHint: "UV mesh and SS304. Altitude does not remove the need to measure span and anchor substrate.",
    visitNote: "Madanapalle covers Annamayya calls, including towns we can reach and return from in a working day.",
    localities: ["Town centre", "College roads", "CTM road side", "Outer layouts"],
    areas: [],
  },
  {
    slug: "kadapa",
    name: "Kadapa",
    region: "Rayalaseema",
    district: "YSR Kadapa",
    intro:
      "Kadapa, the YSR district centre, is hot, rocky around the edges, and increasingly vertical along the main residential roads. Terraces and balconies take a hard sun.",
    climate: "Dry heat and intense UV. Monsoon is shorter than on the coast, but summer dust is constant.",
    housing: "apartments, houses and government-quarter streets",
    materialHint: "UV-stabilised net is non-negotiable on terraces. Cable is SS304 unless corrosion staining is already visible on the building.",
    visitNote: "Kadapa is the YSR district hub. Proddatur is covered when scheduled with this round.",
    localities: ["Maryamman temple area", "Nagarajupeta", "RIMS side", "Railway colony", "Bypass layouts"],
    areas: [],
  },
  {
    slug: "anantapur",
    name: "Anantapur",
    region: "Rayalaseema",
    district: "Anantapur",
    intro:
      "Anantapur is one of the driest district centres in the state. Summers are severe, dust settles into balcony tracks, and any net that is not UV-stable fades and stiffens.",
    climate: "Hot, dry, high UV, with sudden rain rather than a long damp season.",
    housing: "houses, apartments and highway-side colonies",
    materialHint: "Specify UV HDPE in writing. SS304 cable is the normal grill metal. Dust on the wall is cleaned before anchors are set.",
    visitNote: "Anantapur is a Rayalaseema hub for the district and for Sri Sathya Sai calls routed via Hindupur.",
    localities: ["Saptagiri Circle", "Ramnagar", "Bellary Road", "Court road side", "New colonies"],
    areas: [],
  },
  {
    slug: "hindupur",
    name: "Hindupur",
    region: "Rayalaseema",
    district: "Sri Sathya Sai",
    intro:
      "Hindupur is a commercial town on the Bengaluru approach, with warehouses, houses and new residential streets. It is our named base for Sri Sathya Sai district.",
    climate: "Dry heat and strong sun, similar to the Anantapur plain.",
    housing: "town houses, small apartments and mixed commercial buildings",
    materialHint: "UV mesh and stainless ledge spikes. Cable grills are SS304 unless the site argues otherwise.",
    visitNote: "Hindupur is scheduled with the Rayalaseema west round. Dharmavaram is added when the day allows.",
    localities: ["Town centre", "Bypass", "Housing colonies", "Station side"],
    areas: [],
  },
  {
    slug: "kurnool",
    name: "Kurnool",
    region: "Rayalaseema",
    district: "Kurnool",
    intro:
      "Kurnool, on the Tungabhadra, is the western Rayalaseema centre: a dense old town, newer layouts at Kallur and beyond, and a hot climate that punishes vague material names.",
    climate: "Very hot summers, strong UV, and a river influence that does not make it a coastal corrosion site.",
    housing: "apartments, old-town houses and newer gated streets",
    materialHint: "SS304 cable, UV HDPE, and stainless spikes on parapets. We write the grade because 'stainless' alone is too vague.",
    visitNote: "Kurnool is a primary Rayalaseema hub.",
    localities: ["Budhawarpet", "Kallur", "C-Camp", "Nandyal Road", "Srinagar colony"],
    areas: [
      { slug: "kallur", name: "Kallur", detail: "A major residential extension with apartments and houses." },
      { slug: "budhawarpet", name: "Budhawarpet", detail: "Older core streets. Access and wall condition lead the quote." },
      { slug: "c-camp", name: "C-Camp", detail: "Established residential area with mixed balcony sizes." },
      { slug: "kurnool-srinagar", name: "Srinagar colony", detail: "Planned housing where society timings affect the installation slot." },
    ],
  },
  {
    slug: "nandyal",
    name: "Nandyal",
    region: "Rayalaseema",
    district: "Nandyal",
    intro:
      "Nandyal is a district headquarters of houses, temples and a growing apartment edge, set in hot Rayalaseema country with open terraces used daily.",
    climate: "Dry heat and high UV, with short intense rains.",
    housing: "independent houses and new mid-rise blocks",
    materialHint: "Terrace nets need a stated UV grade. Balcony cable is SS304 in the typical quote.",
    visitNote: "Nandyal is measured as its own district hub, not as a footnote to Kurnool.",
    localities: ["Town centre", "Nandi temple side", "Bypass colonies", "Housing board"],
    areas: [],
  },
];

export const cities: City[] = attachAreas([...citySeeds, ...extraCities, ...moreTowns]);

export const regions = ["Uttarandhra", "Coastal Andhra", "Rayalaseema"] as const;

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug);
}

export function getArea(slug: string) {
  for (const city of cities) {
    const area = city.areas.find((item) => item.slug === slug);
    if (area) return { city, area };
  }
  return undefined;
}

export function citiesIn(region: City["region"]) {
  return cities.filter((city) => city.region === region);
}
