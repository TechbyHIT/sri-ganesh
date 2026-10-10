# Publishing workflow

Draft, then validation, content audit, local-data check, duplicate audit, SEO audit, human review, then published. Sitemap inclusion follows `isPageIndexable`.

Commands:

```bash
npm run pages:create -- --type=service-location --limit=1000
npm run pages:audit -- --status=review --limit=1000
npm run pages:publish -- --batch-size=500
npm run pages:noindex -- --quality-below=80
npm run pages:count
```

`pages:publish` exits if `--batch-size` is missing or above 500. With `DATABASE_URL` unset it exits with: `DATABASE_URL is not set. Connect PostgreSQL before running this command.`

Do not publish a batch that fails the gates. The URL registry dry run on 9 October 2026 found 357 unique candidates, 0 that pass the strict index gate, and 52 URLs in the live sitemap. Unconfirmed service combinations are not registry URLs. See `PROGRAMMATIC_SEO_AUDIT.md`.

Phases:

1. Homepage, core pages, services, cities, and the highest-value city-service pages that already have unique copy.
2. Verified areas and their service pages.
3. Guides and problem pages after the copy reaches the word target without filler.
4. Further expansion only after Search Console coverage, crawl stats, and server performance are reviewed.
