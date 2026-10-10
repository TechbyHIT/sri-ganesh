# Adding an area

An area is a locality under a served city.

1. Add the locality in `src/data/locations.ts` with `type: "locality"` and the parent `citySlug`.
2. Publish a service there only with a `serviceLocations` row whose `locationSlug` is the locality slug, plus local copy that is not the city page with the name swapped.
3. The public URL is `/{city}/{locality}/{service}`.
4. The parent city page and the parent service page must link to it. The internal-link check fails the build if an indexable page has no incoming link.
