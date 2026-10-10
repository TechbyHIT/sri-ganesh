# Deployment

1. Set `DATABASE_URL`, `ADMIN_PASSWORD` (12+ characters), and `REVALIDATE_SECRET` in the host environment.
2. Replace `website` in `src/data/business.ts` with the live https origin before launch. Localhost canonicals are not for production.
3. `npx prisma migrate deploy`
4. `npm run build` and `npm start`
5. Optional: `npm run pages:create` for the ledger. It does not mark rows published.
6. Add phone, email, and address only after they are verified.

Security headers, including Content-Security-Policy, are sent when `NODE_ENV` is production. Analytics scripts load only when their environment IDs match the expected pattern.

The production build on 9 October 2026 completed with Next.js 16.4.0 and generated 109 static pages. The sitemap lists 53 URLs. The service-and-location matrix (`URL_MATRIX.md`) adds routes but no pages: every matrix URL returns a 404 until the business approves it in `src/data/matrix-approvals.ts`. Redirect aliases for the service catalog are added in `next.config.ts` through `allRedirects()` and do not create pages.

## Implementation status (9 October 2026)

Done: seven reviewed services; eight-category catalog with 54 named entries mapped to existing pages; 26 districts, 72 revenue divisions, 734 mandals, 239 towns, 16,613 LGD villages, 6 cities, 6 localities stored with validated parents; URL registry with 17,742 candidates under the 50,000 capacity, dry-run batches, duplicate and capacity checks; strict indexability gate; segmented sitemaps with only published canonical pages; metadata, canonicals, JSON-LD without ratings or prices; mega menu, header, homepage, service, location, and combination templates; unit tests and production build passing.

Not done: a public phone, WhatsApp, email, address, and domain (blank until verified); PostgreSQL ledger is not connected in this environment, so forms return an error; no village, mandal, or district page is published; 14 service-and-place pairs are the only local pages; no Core Web Vitals field data exists yet; no claim about indexing or ranking has been checked.
