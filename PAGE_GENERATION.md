# Page generation

Physical page files are the route templates, not one file per city. Records come from:

- core pages in `src/lib/content/static-pages.ts`
- services, cities, localities, and `serviceLocations`
- guides in `src/data/guides.ts`
- problems in `src/data/problems.ts`

`buildDraftRecords()` is the list a database seed would insert. The 9 October 2026 dry run produced 54 catalogue drafts: 18 core, 7 services, 6 locations, 2 areas, 12 service-location, 2 service-area, 3 guides, and 4 solutions. The URL registry adds withheld district, revenue-division, mandal, inactive-locality, and 231 unconfirmed starter-list towns and reaches 357 unique candidates. None pass the strict `isPageIndexable` gate. Unconfirmed service and place pairs are not given URLs. The verified place list is 81 records including the state (26 districts, 6 revenue divisions, 36 Tirupati mandals, 6 cities, 6 localities), so the catalogue cannot reach 50,000 without an official town, village, and mandal import.

Property-type combinations and blog posts 404 until a published, indexable database row exists. They are not prebuilt in bulk.

`generateStaticParams` pre-renders the reviewed service, city, locality, guide, solution, and combination URLs only.
