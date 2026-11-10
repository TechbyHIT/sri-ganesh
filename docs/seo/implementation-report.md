# Implementation report: Andhra Pradesh programmatic SEO

Date: 10 November 2026. Built on the existing Next.js site; no working page, URL or feature was removed.

## Result

| | Count |
| --- | --- |
| Generated SEO pages | 27,149 |
| Published (indexable, in sitemaps) | 27,149 |
| Held for review (200, noindex) | 0 |
| Rejected by the quality gate (not served) | 11,879 |
| Sitemap URLs | 26,452 in 4 groups, split at 40,000 per file |
| Districts / revenue divisions / mandals / ULBs | 28 / 79 / 686 / 124 |
| Revenue villages (official, LGD) | 17,808 across all 686 mandals |
| Services | 22 (all 17 in the brief, plus 5 that already existed) |

Published pages by type: state 1, service 22, city 96, area 1,365, district 28, mandal 686, service-city 2,112, service-area 20,313, guide 30, guide-city 2,496. Nothing is held for review. The 11,879 rejected combinations are still not served.

Checks run: `tsc` clean, `npm run seo:audit` 41/41, `npm run build` (5,733 pages prerendered, the rest on demand), production-server HTTP checks of every new route, redirect, robots, sitemap and admin endpoint, desktop and mobile screenshots, and an end-to-end admin test (write mandal content → regenerate → 23 new pages indexable and in the sitemaps). `db/schema.sql` and the exported seed were loaded into PostgreSQL (PGlite) without errors.

## What was built, by phase

1. **District verification.** One source file per district in `data/locations/ap/raw/`, compiled to `districts.json` by `npm run locations:build`. Structure follows the 31 December 2025 reorganisation, including Markapuram and Polavaram. Each district records its official sources and verification date. 24 districts are fully verified. Bapatla, Eluru, Markapuram and Sri Sathya Sai still have some division assignments that are not confirmed from an official source. Their pages are indexed and say so on the page.
2. **Location database.** Loaders for districts, divisions, mandals, ULBs and localities (`src/data/geo.ts`). The admin content store (`src/lib/store.ts`) and CSV imports (`src/lib/imports.ts`) only accept rows that match a known district and mandal.
3. **Service–location relations.** Added the Balcony Invisible Grills, Openable Invisible Grills and Window Safety Nets services, each with its own essays, topic words and photos. The old balcony guide now 308-redirects to the new service. Admin can add custom services, which only go live once their content is complete.
4. **Templates.** New page kinds: district pages (facts, divisions with mandal lists, ULBs, nearby town pages, services from the hub, sources) and mandal pages (administrative details, villages, nearest serviced pages, sibling mandals, sources). Also added a district directory and a noindex location search covering districts, divisions, mandals, towns, villages, colonies and services. Every page has a unique title, meta description, H1, breadcrumbs, FAQs, WhatsApp/call CTAs and internal links.
5. **Technical SEO.**
   - Sitemaps split into chunks; robots.txt blocks the admin.
   - Organization and HomeAndConstructionBusiness schema, plus Service schema with `areaServed`.
   - Absolute Open Graph image and a Twitter card.
   - Flat-URL redirects, e.g. `/invisible-grills-in-visakhapatnam` and `/{service}-in-andhra-pradesh`.
   - A 404 page with location search.
   - Skeleton dedupe sped up from 260 s to 16 s.
6. **Admin (`/admin`).** Behind Basic auth:
   - Dashboard with page counts, staleness warning, duplicate detection and a regenerate button.
   - District and mandal browser with a local-content editor and photo selection.
   - CSV import for villages, colonies, apartments, localities and mandals.
   - SEO page list with filters and bulk publish/noindex/unpublish/clear.
   - Per-page edits: title, description, H1, local note, FAQs and image.
   - Services and image upload.
   - CSV exports for pages, published URLs, locations and localities.
7. **Testing.** As listed above. Testing found one real bug, now fixed: an admin save revalidates the site, and every route marked `dynamicParams = false` then returned 404 until the next deploy. Those routes now render on demand and use their own `notFound()` checks.
8. **Deployment.** See `docs/deployment.md`. Architecture and policies are in `docs/seo/seo-architecture.md`.

## Decisions that differ from the brief, and why

- **Modifier pages from the reference site were not copied.** saidurgainvisiblegrills.in publishes many near-identical pages per keyword and city (cheap, best, near me, price in …). Google's spam policies classify that pattern as doorway pages, and it risks a site-wide demotion. Instead, each intent has one page per place, and every page must pass the uniqueness gate.
- **Mandal pages are indexed from the official village list.** Each of the 686 mandals has its own Local Government Directory villages, so the page is not a city-name swap. A mandal with no village list and no admin-written note stays noindex. Service pages for a mandal are still created only after someone writes a real local note in the admin. Copy-pasted text stays noindex.
- **Villages are listed, not given their own pages.** 17,808 revenue villages come from the Government of India Local Government Directory (lgdirectory.gov.in), which already reflects the December 2025 reorganisation. Each row cites its mandal's LGD source URL; see `data/locations/ap/sources/villages-report.md`. A spot check against the live LGD service matched exactly. Villages appear on their mandal page and in location search. They do not get standalone pages: about 18,000 pages that differ only by village name would be doorway pages. 149 LGD rows that share a name with another village in the same mandal were skipped, because they cannot be told apart without an LGD code. Add more villages with `npm run locations:import -- file.csv --kind=village` or the admin import; `.gov.in` and `.nic.in` sources are marked verified.
- **No addresses, ratings, reviews, projects or prices in schema**, because none are published. FAQ rich-result markup is not emitted, since Google only shows it for government and health sites.
- **No database at runtime.** The site runs from versioned JSON plus the admin store, which keeps hosting on Hostinger simple. The 16-table PostgreSQL schema and `npm run db:export` are there for reporting or a later move to a database-backed admin.

## Owner actions

1. Set `ADMIN_PASSWORD` and a persistent `CONTENT_DIR` on Hostinger (see `docs/deployment.md`).
2. Confirm the division mapping for Bapatla, Eluru, Markapuram and Sri Sathya Sai from the district collectorate sites. Update the raw files and run `npm run locations:build`.
3. Write local content for the mandals you actually serve, starting with the busiest. Each one adds up to 23 indexable pages.
4. Upload genuine installation photos and attach them to mandals.
5. Add the colonies and apartment communities you actually work in, through the admin import.
6. Submit `/sitemap.xml` in Search Console and watch the Page indexing report.
