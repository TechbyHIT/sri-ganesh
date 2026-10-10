# Search Console setup

1. Publish the site on the final https domain and set that origin in `src/data/business.ts`.
2. Add the domain property in Google Search Console.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the verification token. The root layout emits it only when the variable is present.
4. Submit `https://YOUR_DOMAIN/sitemap.xml`. Grouped files are linked from `robots.txt` under `/sitemaps/`.
5. Watch coverage, crawl stats, indexed count, impressions, clicks, and duplicate warnings before expanding batches.

Do not request indexing for draft, noindex, or admin URLs. Google controls what is indexed.
