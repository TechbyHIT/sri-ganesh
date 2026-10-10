# Location data audit

Sri Ganesha Home Safety Solutions. Checked 9 October 2026.

This database is a verified subset. It is not a complete list of every town, village, colony, or service area in Andhra Pradesh.

## What was checked

| Source | Result |
| --- | --- |
| [Andhra Pradesh District Portal](https://andhrapradesh.s3waas.gov.in/) | 26 districts, with the Telugu labels shown on that page. |
| [Tirupati revenue divisions](https://tirupati.ap.gov.in/revenue-division/) | 3 divisions: Srikalahasthi, Sullurpet, Tirupati. |
| [Tirupati mandals](https://tirupati.ap.gov.in/mandals/) | 36 mandals, each tied to one of those divisions. |
| [NTR about page](https://ntr.ap.gov.in/about-district/) | Headquarters Vijayawada. Revenue divisions Vijayawada, Nandigama, and Tiruvuru. The page’s spelling “Vijayawda” is stored only as an alias. Mandal names were not on the page. |
| [East Godavari about page](https://eastgodavari.ap.gov.in/about-district/) | Headquarters Rajamahendravaram, which is the existing Rajahmundry city record. The page cites both 19 and 22 mandals, so no mandal list was imported. |
| [Tirupati about page](https://tirupati.ap.gov.in/about-district/) | Confirms Tirupati town is the district headquarters. |
| [iGOT directory](https://igod.gov.in/sg/AP/E042/organizations) | A partial public listing included Markapuram and Polavaram, which the state district portal does not list. Those names were not imported. The iGOT page did not load a full district table in this check. |

Population, area, coordinates, postal codes, officer names, and phone numbers were not stored.

## Districts verified

26 active administrative records. None of them is an indexable URL.

Alluri Sitharama Raju, Ananthapuramu, Annamayya, Anakapalli, Bapatla, Chittoor, East Godavari, Eluru, Guntur, Kakinada, Dr. B.R. Ambedkar Konaseema, Krishna, Kurnool, Nandyal, NTR, Palnadu, Parvathipuram Manyam, Prakasam, Sri Sathya Sai, Sri Potti Sriramulu Nellore, Srikakulam, Tirupati, Visakhapatnam, Vizianagaram, West Godavari, YSR Kadapa.

Districts that share a name with a published city use a `-district` slug (`guntur-district`, `kakinada-district`, `tirupati-district`, `visakhapatnam-district`). The city page keeps the short slug.

## Revenue divisions verified

6 records.

- Tirupati district: Srikalahasthi, Sullurpet, Tirupati.
- NTR district: Vijayawada, Nandigama, Tiruvuru.

No other district’s revenue divisions were imported.

## Mandals verified

36 records, all in Tirupati district, from the district mandal table. They are not service pages and they are not in the sitemap.

Mandal lists for Krishna, Palnadu, Ananthapuramu, and the other districts were not imported. Those official tables were not captured as a complete source in this pass.

## Towns and villages verified

0 towns. 0 villages. 0 municipalities imported as their own records.

The Tirupati about page names a municipal corporation and five municipalities. Those names were not copied into `towns.ts`, so the file is not treated as a complete municipal directory.

## Localities verified

6 neighbourhoods were already in `data/locations.ts`. They were linked to their parent city. They were not re-checked against a government colony gazetteer.

Published: Madhurawada, Gajuwaka.

Present but inactive, with no page and no service row: MVP Colony, Benz Circle, Governorpet, Korlagunta.

`mandalId` is empty on these localities. The mandal that contains each colony was not verified.

## Published city parents

| City page | District record | Basis |
| --- | --- | --- |
| Visakhapatnam | Visakhapatnam | Same name on the state portal. |
| Vijayawada | NTR | NTR about page: headquarters Vijayawada. |
| Guntur | Guntur | Same name on the state portal. |
| Tirupati | Tirupati | Tirupati about page: headquarters town. |
| Rajahmundry | East Godavari | East Godavari about page: headquarters Rajamahendravaram. |
| Kakinada | Kakinada | Same name on the state portal. |

Guntur and Kakinada do not yet have a separate headquarters sentence from a district about page. The parent link is the shared official name only.

## Missing datasets

- Revenue divisions for 24 of 26 districts.
- Mandals for every district except Tirupati.
- Towns, municipalities, nagar panchayats, census towns, and villages.
- City neighbourhoods beyond the six already in the project.
- A full iGOT district table. Markapuram and Polavaram remain unresolved, so they have no records and no URLs.
- East Godavari mandals, because the district page disagrees with itself on the count.

## Duplicate records

Validation found no duplicate ids or slugs.

Aliases do not use another record’s slug. Historical spellings such as Bezawada, Nellore, Kadapa, and Anantapur are aliases, not extra pages.

## Invalid parent-child relationships

None in the imported records. `validateLocationHierarchy()` runs when `lib/locations.ts` loads and fails the build on a broken parent, a duplicate slug, or a service flag that disagrees with `data/serviceLocations.ts`.

## Service coverage still requiring confirmation

Service pages still come only from the existing rows in `data/serviceLocations.ts`. Belonging to Andhra Pradesh, a district, or a mandal does not create coverage.

No new service-location rows were added. Districts, revenue divisions, and mandals have `serviceAvailable: false`.

## Routes

Existing URLs are unchanged:

```text
/locations/
/locations/[city]/
/locations/[city]/[locality]/
/services/[service]/
```

`/locations/[district]/[city]/` was not added. It uses the same App Router shape as `/locations/[city]/[locality]/`, so a second dynamic folder would conflict.

`/invisible-grills/[city]/` and the other service-city patterns were not added. They would be a second public URL beside `/services/[service]/`, and there is not yet unique coverage copy for every district. Invalid combinations still 404. The sitemap still lists only pages that already pass the content-quality check.

The locations directory lists the 26 districts in the HTML. Only existing city pages are links. Tirupati’s 36 mandals are in a disclosure on that same page, not on 36 new URLs.

## Build

`npx tsc --noEmit` passed. `npm run build` passed. 28 static pages, same published route table as before this import.
