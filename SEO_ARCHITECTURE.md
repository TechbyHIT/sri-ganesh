# SEO architecture

Canonical host comes from `src/data/business.ts` (`http://localhost:3000` until a live domain is set). Paths have no trailing slash. Query strings are stripped from canonicals.

A database page is indexable only when `isPageIndexable` passes: published, allowed, quality at least 80, reviewed, local data verified, unique metadata and content, valid canonical, internal links, valid schema, word count at or above the page minimum, and similarity at or below 0.7.

The file catalogue uses the existing content score (threshold 70) for pages that are already published. New database rows start in `review` and are not added to the sitemap until they pass the stricter gate. Current draft word counts are all below the written targets, so the database publisher has 0 ready rows. The live sitemap still lists the reviewed file URLs.

Sitemap index for groups lives at `/sitemaps/{group}-1.xml`, with at most 10,000 URLs per file. `/sitemap.xml` is the combined urlset. `robots.txt` allows `/` and disallows `/admin` and `/api/`.

Structured data is Organization, WebSite, Service, WebPage, BreadcrumbList, FAQPage, Article, and ImageObject. LocalBusiness is omitted until a complete street address exists. Ratings, reviews, and prices are not emitted.

No ranking, indexing speed, or traffic is promised.
