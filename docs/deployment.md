# Deployment

The site is a Next.js 15 app (Node ≥ 20). Hostinger builds and starts it when `master` is pushed.

## Environment

Copy `.env.example` and set:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, no trailing slash. Used in canonicals, sitemaps and schema. |
| `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_PHONE_TEL`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL` | Contact buttons and Organization schema. |
| `ADMIN_USER` | Admin login name (default `admin`). |
| `ADMIN_PASSWORD` | Admin password, at least 10 characters. If unset, `/admin` returns 404. |
| `CONTENT_DIR` | Absolute path for admin data (edits, imports, uploads). Put it outside the deploy folder, e.g. `/home/<user>/sriganesh-content`, so redeploys do not delete it. |

## Release steps

```bash
npm ci
npm run locations:check     # district files are consistent
npm run seo:generate        # rebuild data/seo/registry.json (commit it)
npm run seo:audit           # must print only "ok" lines
npm run build
npm start                   # port 5124; Hostinger maps its own port
```

Commit `data/seo/registry.json` with any change to services, cities, districts or templates; it decides which pages are indexable and what goes in the sitemaps.

## After admin edits in production

Admin changes apply to pages immediately (each edited page is re-checked by the quality gate on its next render, and stays noindex until the gate passes). Sitemaps follow the registry, so press **Regenerate registry** on the dashboard after a batch of edits. Regenerating writes `data/seo/registry.json` on the server; to keep it across redeploys either commit the same change locally or regenerate again after each deploy.

Changing mandals or revenue divisions through the import page rewrites `data/locations/ap/raw/*.json` and `districts.json` on the server. Those are part of the code: download the CSV you imported, run the same import locally (`/admin/import` on `npm run dev`), commit, and redeploy.

Back up `CONTENT_DIR` (it is plain JSON plus image files).

## Validate after deploy

- `https://<site>/robots.txt` lists the sitemap and disallows `/admin`.
- `https://<site>/sitemap.xml` lists the `/sitemaps/*.xml` files; each opens and has fewer than 40,000 URLs.
- A district page, e.g. `/locations/andhra-pradesh/districts/ntr`, returns 200 with `index, follow`.
- A mandal page without local content returns 200 with `noindex, follow`.
- `/invisible-grills-in-visakhapatnam` 308-redirects to `/services/invisible-grills/visakhapatnam`.
- `/admin` asks for a password (or is 404 when `ADMIN_PASSWORD` is unset).
- Submit `/sitemap.xml` in Google Search Console and check Page indexing after a few days. Test one service page and one district page in the Rich Results Test.

## Optional: database mirror

```bash
npm run db:export -- --links
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
psql "$DATABASE_URL" -f db/seed-links.sql
```

The site does not read the database; this is for reporting and for moving the admin to a database later.
