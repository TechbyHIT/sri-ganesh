# SEO audit

Sri Ganesha Home Safety Solutions. Audit date: 9 October 2026.

Published URL tree:

```text
/
/services/
/services/[service]/
/locations/
/locations/[city]/
/locations/[city]/[locality]/
```

`/contact`, `/about`, `/[service]/[city]/`, and `/[service]/[city]/[locality]/` are not routes. They return 404. They were not added.

## Project status

| Area | Status |
| --- | --- |
| Build | `npm run build` passed. Next.js 16.4.0. 28 static pages. |
| TypeScript | `npx tsc --noEmit` passed. `strict` is enabled. No `any` types. |
| Routes | Published pages return 200. Invalid, inactive, and unpublished URLs return 404. |
| SEO | 18 indexable URLs. Unique titles. `noindex` on 404. Sitemap matches those 18 URLs. |
| Performance | No page-level client components. One error boundary chunk, 971 bytes, loads only as the route error handler. |
| Mobile | 320, 375, 390, 414, 768, 1024, and 1440 checked in headless Chrome. No horizontal overflow. |

## SEO system

### Metadata

Every indexable page has one title, a description of 160 characters or fewer, a self-referencing canonical, `index, follow`, Open Graph title, description, URL, and image, and a Twitter summary card.

The title template is `%s | Sri Ganesha Home Safety Solutions`. The homepage title is absolute, so the brand is not repeated twice.

### Canonicals

Canonicals are lowercase, hyphenated, and free of query strings and duplicate slashes. A trailing slash resolves to the same canonical. The current origin is `http://localhost:3000`. Any non-local `http` origin is published as `https`. See the launch issue below.

### Sitemap

`/sitemap.xml` lists 18 URLs: home, services index, locations index, 7 services, 6 cities, and 2 localities. It excludes 404s, inactive localities, the state record, and unpublished service-location pairings. Duplicate canonicals throw at build time. A second sitemap file is required only after 45,000 URLs.

### Robots

`/robots.txt` allows `/` and points at the sitemap. It does not block CSS, images, or JavaScript.

### JSON-LD

Visible pages emit Organization, WebSite, Service, BreadcrumbList, and FAQPage only where those FAQs are on the page. Location pages emit WebPage plus the services actually linked from that place. Empty phone, email, address, and social profiles are omitted. There are no reviews, ratings, prices, awards, or counts. `<` in JSON-LD is escaped so the script cannot break out.

### Internal linking

Homepage links to services and cities. Service pages link to related services and published areas. City pages link to available services and active localities. Locality pages link to the parent city and nearby published places. The layout quote band is on every page. Orphan detection reports no indexable service or location without an incoming link. Invalid-link detection reports no links to unpublished URLs.

## Programmatic SEO

| Layer | Result |
| --- | --- |
| Services | 7 active pages. Quality score 100. Rendered from service data: intro, benefits, features, applications, installation, FAQs, related links, and a CTA. |
| Cities | 6 active cities. Scores 82–100. Each description is stored for that city. |
| Localities | Madhurawada and Gajuwaka are active and indexable. Score 94. Four other localities are inactive and are not generated. |
| Service-location pages | 14 stored pairings score 97–100 and are distinct. They are not published routes. |
| Content quality | Indexable only at score 70 or above, with hard stops for thin copy. Duplicate detection found 0 pairs. Invisible grills in Visakhapatnam versus Vijayawada: local similarity 0.07, full 0.33. |
| Noindex | Failed quality sets `robots` to noindex and drops the URL from the sitemap. All current published pages pass, so they stay indexable. The state record is `indexable: false` and has no page. |

## Representative pages

| URL | Result |
| --- | --- |
| `/` | 200. H1 “Safety fittings that leave the view open.” Index, canonical `/`, 4 JSON-LD blocks, quote band. |
| `/services` | 200. Unique title and H1. Index. |
| `/services/invisible-grills` | 200. H1 “Invisible Grills”. Title “Invisible Grills for Balconies in Andhra Pradesh”. Index. Breadcrumbs, FAQs, CTA. |
| `/locations/visakhapatnam` | 200. H1 “Home safety in Visakhapatnam”. Index. |
| `/locations/visakhapatnam/madhurawada` | 200. H1 “Home safety in Madhurawada, Visakhapatnam”. Index. |
| `/services/sports-nets` | 200. Index. |
| `/invisible-grills/visakhapatnam` | 404. Not a route. |
| `/invisible-grills/visakhapatnam/madhurawada` | 404. Not a route. |
| `/sports-nets/vijayawada` | 404. Not a route. |
| `/services/invisible-grills/visakhapatnam` | 404. Metadata exists for this pairing; the route does not. |
| `/services/not-a-service` | 404, `noindex`. |
| `/locations/not-a-city` | 404, `noindex`. |
| `/locations/visakhapatnam/mvp-colony` | 404. Locality is inactive. |
| `/locations/vijayawada/madhurawada` | 404. Wrong parent city. |
| `/contact`, `/about` | 404. Not built. |

## Issues found

### Issue

Canonical host is still localhost.

### Severity

High

### File

`data/business.ts`

### Problem

Canonicals, the sitemap, robots, and JSON-LD use `http://localhost:3000`. That is correct for local preview. It is not a production host, and it is not HTTPS.

### Fix Applied

None. `canonicalOrigin()` already switches a non-local `http` origin to `https`. The live domain has to be written into `business.website` before launch. A domain was not invented.

### Issue

Service and location pairings are not public pages.

### Severity

Medium

### File

`lib/paths.ts`, `lib/seo.ts`, `lib/sitemap-data.ts`

### Problem

Fourteen pairings, including Invisible Grills in Visakhapatnam and Invisible Grills in Madhurawada, pass the content-quality check. Their canonical helpers point at `/services/invisible-grills/visakhapatnam` and `/services/invisible-grills/visakhapatnam/madhurawada`. Those routes are not in `app/`, return 404, are not internally linked, and are not in the sitemap. `/invisible-grills/...` is also 404, so there is no second public URL for the same page.

### Fix Applied

None. Adding those routes would publish a new SEO section. The live architecture stays `/services/[service]` and `/locations/[city]/[locality]`.

### Issue

There was no visitor-safe error fallback.

### Severity

Medium

### File

`app/error.tsx`

### Problem

A failed page render had no project error UI, so a visitor could see a framework error instead of a way back.

### Fix Applied

Added a client error boundary. It does not print `error.message`. It offers Try again, home, and services. The extra chunk is 971 bytes and is the route error handler, not page content.

### Issue

The 404 page did not link home.

### Severity

Low

### File

`app/not-found.tsx`

### Problem

The not-found page linked to services and locations only.

### Fix Applied

Added “Back to home”. Services and locations remain. Metadata stays `noindex, follow`. Invalid dynamic URLs return HTTP 404. After render, the heading “That page is not on this site.” is visible. `loading.tsx` was not added, because a loading shell would hide the article on real pages.

### Issue

JSON-LD was inserted without escaping.

### Severity

Low

### File

`components/seo/JsonLd.tsx`

### Problem

`JSON.stringify` output was placed in a script tag. A `<` in stored copy could close the tag.

### Fix Applied

`<` is replaced with `\u003c` before the script is written.

### Issue

Locality H1 omitted the parent city.

### Severity

Low

### File

`components/LocationView/LocationView.tsx`

### Problem

The visible heading was “Home safety in Madhurawada” while the title and content record use “Home safety in Madhurawada, Visakhapatnam”.

### Fix Applied

Locality headings now include the stored parent city. City headings are unchanged.

## Checks that did not need a code change

- No duplicate slugs, broken references, or inactive records in the sitemap.
- No hardcoded secrets, API keys, or client environment variables.
- No reviews, ratings, prices, addresses, or customer counts in copy or schema.
- Phone, email, WhatsApp, and street address stay blank until verified.
- Images use `next/image` with width and height. Heroes use high fetch priority. Galleries and the footer mark are lazy. Alt text describes the picture. Logos are decorative (`alt=""`).
- One Manrope Latin file. No third-party scripts. No `"use client"` on pages.
- Forms are not on the site. The quote path is links.
- Heading order is one `h1`, then `h2`, then `h3` inside service cards.
- Focus uses `:focus-visible`. Tap targets in the tested viewports were at least 40px.
- `data/types.ts` does not exist. Types live in the data modules that use them.
- Duplicate-content warnings run only when `NODE_ENV` is not `production`.

## Final checklist

```text
[x] TypeScript passes
[x] Production build passes
[x] Routes verified
[x] 404 handling verified
[x] Metadata verified
[x] Canonicals verified
[x] Sitemap verified
[x] Robots verified
[x] JSON-LD verified
[x] Internal links verified
[x] Orphan pages checked
[x] Content quality checked
[x] Noindex rules checked
[x] Mobile checked
[x] Images optimized
[x] Accessibility checked
[x] Performance checked
[x] Security checked
[x] No fake business information
[x] No duplicate SEO pages
```

Canonical shape is verified. HTTPS starts when `business.website` is the live domain.

## Launch before indexing

Set `business.website` to the real HTTPS origin, then rebuild so canonicals, the sitemap, and JSON-LD leave localhost.
