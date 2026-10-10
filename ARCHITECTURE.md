# Architecture

The public site renders from reviewed files in `src/data` and `src/lib/content.ts`. That keeps the site buildable when PostgreSQL is not connected.

PostgreSQL is the publishing ledger. `scripts/create-page-records.ts` upserts draft rows for the real catalogue only: services, served cities, served localities, and the explicit service-location pairings. It does not create the cartesian product of every district and service.

Combination URLs are:

- `/{city}/{service}`
- `/{city}/{area}/{service}`

Next.js requires one dynamic folder name at each depth, so both routes use `[slug]` for the second segment. On the two-part URL that segment is the service. On the three-part URL it is the area.

Older `/services/{service}/{city}` paths 308 to those URLs.

`generateStaticParams` returns only the reviewed pairings. Next.js 16 with Cache Components does not allow `dynamicParams` or `revalidate` segment exports. Unknown routes call `notFound()`. On-demand updates use `POST /api/revalidate` with `REVALIDATE_SECRET`.

Admin routes stay closed unless `ADMIN_PASSWORD` is at least 12 characters. There is no default password.

Phone, email, street address, coordinates, reviews, prices, and job counts stay blank until verified.
