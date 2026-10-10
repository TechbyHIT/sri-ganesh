# SEO audit guide

```bash
npm run seo:audit
npm run content:audit
npm run duplicates:audit
npm run links:audit
npm run schema:audit
npm run placeholders:audit
npm run sitemaps:generate
```

Reports are written to `reports/`.

On 9 October 2026, without a database:

- `seo:audit` reported 0 critical issues and 52 sitemap URLs.
- `content:audit` reported 600 records, 600 below the word minimum, 0 ready.
- `duplicates:audit` reported 0 catalogue matches and 0 draft matches above 0.7.
- `links:audit` reported no invalid links and no orphan indexable pages.
- `schema:audit` reported 0 failures. Ratings, reviews, and prices are blocked.
- `placeholders:audit` reported 0 hits.

`src/lib/validate-seo.ts` still runs when the app loads and fails the build on broken catalogue metadata, duplicate canonicals, or forbidden schema fields.
