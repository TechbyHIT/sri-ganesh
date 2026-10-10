# Adding a service

1. Add the service in `src/data/services.ts` with a lowercase hyphenated slug, real description, benefits, installation steps, FAQs, and image alt text.
2. Set `active` and `indexable` only when the copy is reviewed.
3. Do not add a route file. `/services/{slug}` is the dynamic route.
4. City and area pages appear only after a row in `src/data/serviceLocations.ts` with its own local introduction and unique content.
5. Run `npm run pages:create -- --type=service --limit=100` once PostgreSQL is connected. The row stays in review until the indexability gates pass.

## Named requests (the service catalog)

`src/data/service-catalog.ts` holds the eight supplied categories and their 54 named entries (balcony invisible grills, cat safety nets, pulley cloth hangers, and so on). An entry is a customer phrase, not a page.

- `canonical`: the entry is an existing service page.
- `merged`: same intent as an existing page. The entry links there from the services index and the service page, and `/services/{category}/{entry}` redirects there.
- `unverified`: work the business has not confirmed (football goal nets, golf nets, volleyball nets). No link, no redirect, no page.

Add a new phrase as an entry pointing at the page that already answers it. Add a new service only when the business does that work and has its own copy for it. `npm run test` checks that every public entry resolves to a published path.
