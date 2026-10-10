# Database architecture

PostgreSQL and Prisma. Schema: `prisma/schema.prisma`. SQL: `prisma/migrations/20261009120000_init/migration.sql`.

`Page` is unique on `path` and `canonicalUrl`. Optional relations to service, location, area, property type, and problem use `onDelete: Restrict`, so removing a service does not delete published page rows. Change a slug by writing a `Redirect` and updating the path.

Indexes cover page type, publication status, indexing, service, location, area, quality score, crawl priority, updated time, and sitemap group.

Reads for admin lists use cursor pagination (`take` plus one). Scripts batch writes. Nothing loads every future page into memory.

`ContactInquiry` stores quote and contact form rows. The form returns an error when `DATABASE_URL` is missing. It does not pretend the message was saved.

Apply the schema only against a real database:

```bash
npx prisma migrate deploy
npm run pages:create -- --type=service-location --limit=1000
```
