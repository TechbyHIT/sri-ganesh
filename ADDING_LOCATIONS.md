# Adding a location

Served cities and localities live in `src/data/locations.ts`. Administrative districts, revenue divisions, and mandals live under `src/data/locations/` and are not service coverage.

1. Add the place with a parent that matches the hierarchy rules in `src/lib/location-validation.ts`.
2. Set `active` and `indexable` only for a place the business actually serves.
3. Do not claim an office there.
4. Use honest local notes. Leave unknown facts out.
5. A location page is `/locations/{slug}`. A locality page is `/locations/{city}/{locality}`.
