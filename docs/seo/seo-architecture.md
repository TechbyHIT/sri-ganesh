# SEO architecture

English only. The served market is Andhra Pradesh. There is no hreflang, no country split, and no second language. Do not add hreflang until a real localized equivalent exists.

## URL policy

Preferred URLs are lowercase, hyphenated, and have no trailing slash. Next.js is left on that default (`trailingSlash` is not enabled).

| Entity | Path |
| --- | --- |
| Home | `/` |
| Service | `/services/{service}` |
| Service library item | `/services/library/{slug}` |
| Service in a city | `/services/{service}/{city}` |
| Service in a neighbourhood | `/services/{service}/{city}/{area}` |
| State | `/locations/andhra-pradesh` |
| City | `/locations/andhra-pradesh/{city}` |
| Neighbourhood | `/locations/andhra-pradesh/{city}/{area}` |
| District directory | `/locations/andhra-pradesh/districts` |
| District | `/locations/andhra-pradesh/districts/{district}` |
| Mandal | `/locations/andhra-pradesh/districts/{district}/{mandal}` |
| Service in a mandal with local content | `/services/{service}/{place}` (same shape as a city) |
| Location search (noindex) | `/locations/search?q=&kind=` |
| Guide | `/guides/{slug}` |
| Guide in a city | `/guides/{slug}/{city}` |
| Article | `/blog/{slug}` |
| Contact, including photo estimate | `/contact` |

`/contact?need=photo` is a view of `/contact`, not a second indexable URL. Its canonical is `/contact`.

Legacy flat paths (`/areas/{slug}`, `/{city}`, `/{service}`, old service-city combos such as `/invisible-grills-in-visakhapatnam`, `/{service}-in-andhra-pradesh`, `/{service}-in-{unique-area}`) 308 to the paths above when `legacyRedirect()` recognizes them. Retired guides (`/guides/invisible-grills-for-balcony`) redirect to the service that replaced them. The middleware does not redirect the current `/services`, `/guides`, `/blog`, or `/locations/andhra-pradesh` trees.

Unknown paths call `notFound()`. The 404 document is `noindex` and links to locations and contact.

## Indexing

`data/seo/registry.json` is the index source for programmatic pages when its `templateVersion` matches `TEMPLATE_VERSION` in `src/seo/types.ts` (currently 3).

- `publish` and `index: true` — eligible for the XML sitemap and `index, follow`.
- `review` — HTTP 200, `noindex, follow`, omitted from sitemaps, banner shown on the page.
- Missing from the registry — treated as review / noindex until `npm run seo:generate` records it. This stops on-demand renders from indexing drafts the full catalog never approved.
- Manual file `data/seo/overrides.json`, when present, overrides that decision for one path. A forced publish still needs a fresh generate before the sitemap includes it.
- `status: "exclude"` inside a composed page returns 404 via `SeoScreen`.

Location rules on top of the quality gate (`policy()` in `src/seo/catalog.ts`):

- District pages for Bapatla, Eluru, Markapuram and Sri Sathya Sai are indexed, and the page says which part of the division mapping is still being confirmed. A mandal whose revenue division is not on an official list says so on the page instead of being left out.
- Mandal pages are directory pages (administrative facts, the official village list, nearest serviced pages, sources). A mandal with that village list is indexed when the quality gate finds the page long enough and different from the others. A mandal with neither a village list nor admin-written local content stays `review` / noindex.
- When an admin writes local content for a mandal (intro ≥ 45 words, visit note ≥ 12 words, housing, chosen services) and enables it, the mandal is promoted to a place: its mandal page becomes indexable-eligible and `/services/{service}/{place}` pages are generated for the chosen services. All of them still pass the quality gate and skeleton-collision check.
- Admin page edits (title, description, H1, local note, FAQs, image) change the page `inputHash`; until the registry is regenerated the live assessment is used, so an edit cannot sneak an unapproved page into the index.

Static pages (home, services index, library items, locations index, gallery, about, blog index, posts, FAQ, contact, HTML sitemap) are indexable and are not registry records. They are listed in the core sitemap.

Quality scoring in `src/seo/quality.ts` rejects unsupported claims (`5000+`, `10+ years`, cheapest, number one, guaranteed to stop, `#1`), thin bodies, weak metadata, keyword piles, and service-area pages whose text collapses to an existing page once place names are removed. The score is an internal gate, not a ranking factor.

## Sitemaps and robots

`/sitemap.xml` is a sitemap index with four groups:

- `core` — static pages, blog posts, library items, published guides
- `services` — published service pages
- `locations` — published state, district, mandal, city, and area pages
- `coverage` — published service-city, service-area, and guide-city pages

Each URL is in one group. Groups are split into files of 40,000 URLs (`/sitemaps/coverage.xml`, `/sitemaps/coverage-2.xml`, …), so the 50,000 limit holds at any scale. `lastmod` is the registry `updatedAt` date. Static URLs with no registry row omit `lastmod` rather than using the clock. Locations are absolute and XML-escaped.

`/robots.txt` allows `/`, disallows `/admin` and `/api/admin`, and points at `{site.url}/sitemap.xml`. It is not an access-control mechanism. CSS and JavaScript are not blocked.

The HTML sitemap at `/sitemap` lists published services, the state page, cities, and guides, plus counts for the rest. It does not print every neighbourhood URL.

## Metadata and schema

Programmatic pages use `metadataFor()` → `pageAt()`. Titles, descriptions, canonicals, robots, and Open Graph images come from the composed page. The root layout title template is `%s | Sri Ganesha Home Safety`. The home page does not set its own title, so it keeps the layout default and does not double the brand.

JSON-LD on programmatic pages is built in `compose.ts` / `compose-geo.ts` from the page’s own breadcrumb and content: `BreadcrumbList` everywhere, and `Service` (with `serviceType`, provider and `areaServed` set to the page’s place or the state) on service pages. The layout adds an `Organization` (logo, email, phone contact point when configured) and one `HomeAndConstructionBusiness` with Andhra Pradesh as the served area. There is no street address, geo point, rating, review or price, because none is published. FAQ rich-result markup is not emitted: Google limits FAQ rich results to authoritative government and health sites, so the markup would not be eligible.

Open Graph uses an absolute image URL, `og:locale` `en_IN`, and a `summary_large_image` Twitter card.

Valid structured data does not mean a search result will show a rich feature.

## What this site does not do

- No e-commerce, offers, or product prices.
- No fake offices, reviews, or city-swapped doorway pages. A neighbourhood URL exists only when the city data has that area and, for a service combination, `topicOverlap` finds a real local note.
- No analytics pixels and no consent banner, because no tracker is installed.
- No image sitemap. Images sit on the pages that use them, as WebP.
- No modifier-swapped pages (`cheap-…`, `best-…`, `…-near-me`, `…-price-in-{city}`). Each search intent maps to one page.

## Location data

`data/locations/ap/raw/{district}.json` holds one file per district with its revenue divisions, mandals, urban local bodies, official sources and verification date. `npm run locations:build` validates and compiles them to `data/locations/ap/districts.json` (the file the site imports); `npm run locations:check` validates without writing. Structure follows the 31 December 2025 reorganisation (28 districts, including Markapuram and Polavaram).

Villages, colonies and apartments live in `data/locations/ap/localities.json` (committed, official) plus the admin store. Import with `npm run locations:import -- file.csv --kind=village` or from `/admin/import`. Every row must match a known district and mandal; villages need a source URL, and only `.gov.in` / `.nic.in` sources mark a row verified.

## Admin

`/admin` is protected by HTTP Basic auth in middleware and again in every server action. It is a 404 unless `ADMIN_PASSWORD` (≥ 10 characters) is set. Admin writes go to JSON files in `CONTENT_DIR` (default `data/store`). See `docs/deployment.md`.

## Database mirror

`db/schema.sql` defines the 16 relational tables (states through location_sources). `npm run db:export` writes `db/seed.sql` from the JSON data and registry (add `--links` for `db/seed-links.sql` with every internal link). The site does not need a database to run.
