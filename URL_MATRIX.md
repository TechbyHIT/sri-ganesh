# Service-and-location URL matrix

The matrix turns the supplied service catalog and the verified Andhra Pradesh location tree into candidate URL records. A candidate is a row in a file. It is not a page, a link, or a sitemap entry.

Two targets are kept apart on purpose.

| Target | Setting | Meaning |
| --- | --- | --- |
| Candidate URLs | `URL_MATRIX.candidateTarget` = 50,000 | How many valid, unique records the generator can produce |
| Indexable pages | decided by approvals | How many pages the business confirmed and wrote original content for |

Creating a candidate never publishes it.

## Path format

`/{service-entry-slug}/andhra-pradesh/{district-slug}` for a district, and `/{service-entry-slug}/andhra-pradesh/{district-slug}/{location-slug}` for a mandal, city, town, locality, or village. The location slug is unique across the whole tree, so the pair is always unambiguous. There is no trailing slash, to match the canonical policy of the existing pages.

The 53 live pages keep their URLs (`/vijayawada/invisible-grills`, `/services/cloth-hangers`, and so on). A matrix candidate whose service is already confirmed at that place is marked `excluded` with its canonical path pointing at the existing page.

## What goes in

- Service entries: the 54 supplied names in `src/data/service-catalog.ts`. Three (football goal nets, golf nets, volleyball nets) are held out because the business has not confirmed that work. They are counted as rejected combinations.
- Locations: districts, mandals, cities, towns, and active localities by default. Villages are opt-in with `--include-villages`; they would add 51 candidates each.
- Entries that share a canonical page share one search intent. One entry per intent is the primary and the others are marked `intent-overlap`. They stay in the registry but are never treated as separate indexable pages until they are differentiated.

## Status values

`candidate`, `needs-coverage-confirmation`, `needs-content`, `editorial-review`, `approved`, `published`, `noindex`, `redirect`, `excluded`.

- `needs-coverage-confirmation`: the business has not confirmed this service at this place. This is where nearly every candidate sits.
- `needs-content`: coverage is confirmed but no original content exists.
- `editorial-review`: an approval exists but fails the content checks.
- `published`: a complete approval exists. Only then does the route render, the sitemap list it, and the page index.
- `excluded`: the same intent is already served by an existing page.

## Making a page real

1. Confirm the service is offered at the place.
2. Add an entry to `src/data/matrix-approvals.ts` with the path, a unique title and description, the business's coverage confirmation, and content that passes `matrixContentSchema` (introduction, coverage, property types, applications, installation details, maintenance, at least two FAQs, a source note and date).
3. Run `npm run audit:content`. It reports incomplete approvals.
4. Run `npm run generate:urls` and `npm run generate:sitemaps`.

Do not add an entry to raise a count. A page with only a place name swapped into shared text should stay a candidate.

## Commands

| Command | What it does |
| --- | --- |
| `npm run generate:urls -- --dry-run` | Counts candidates and prints every metric. Writes nothing. |
| `npm run generate:urls` | Writes `reports/url-registry/candidates.ndjson` in batches with a checkpoint, plus `summary.json` and `summary.csv`. |
| `npm run generate:urls -- --resume` | Continues an interrupted run. |
| `... -- --levels=district,mandal` / `--include-villages` / `--batch-size=N` / `--limit=N` | Narrow or widen a run. |
| `npm run export:url-registry` | Converts the registry to `candidates.csv` and `candidates.json`. |
| `npm run validate:services` / `validate:locations` | Check the catalog and the location tree. |
| `npm run audit:duplicates` / `audit:coverage` / `audit:content` / `audit:internal-links` | Audit the registry. |
| `npm run generate:sitemaps` | Counts sitemap URLs and fails if any candidate is listed or a file reaches 50,000. |
| `npm run import:locations -- --file=places.csv` | Validates a CSV or JSON of proposed locations. Dry run only. |
| `npm run import:lgd -- --dry-run` | Validates the Local Government Directory PDFs without writing. Set `LGD_DOWNLOAD_DIR` for another folder. |

The registry files are large and generated, so `reports/url-registry/` is git-ignored. Pages never read it. They read `matrix-approvals.ts`, which holds only approved pages.

## Data still needed

- Which services the business really offers in which districts, towns, and mandals.
- Original local content for each place before it is approved.
- Confirmation of the three held-out sports entries, if they are offered.
- Building covering is a real published service but is not in the supplied catalog. Adding it would add 1,011 more candidates.
- Wards: no official ward list with stable parents has been imported.
