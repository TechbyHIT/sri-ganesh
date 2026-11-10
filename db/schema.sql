-- Andhra Pradesh programmatic SEO: relational schema (PostgreSQL 14+).
-- The running site reads the JSON files in data/ and the admin store; this schema
-- mirrors them for reporting, migration to a database-backed admin, or bulk QA.
-- Load: psql "$DATABASE_URL" -f db/schema.sql && psql "$DATABASE_URL" -f db/seed.sql
-- (db/seed.sql is produced by `npm run db:export`).

BEGIN;

CREATE TABLE IF NOT EXISTS states (
  id            SMALLSERIAL PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  code          CHAR(2) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS location_sources (
  id            SERIAL PRIMARY KEY,
  url           TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  publisher     TEXT,
  accessed_on   DATE,
  covers        TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS districts (
  id                SERIAL PRIMARY KEY,
  state_id          SMALLINT NOT NULL REFERENCES states(id),
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  headquarters      TEXT NOT NULL,
  region            TEXT NOT NULL,
  official_site     TEXT,
  hub_city_slug     TEXT,
  verified          BOOLEAN NOT NULL DEFAULT FALSE,
  last_verified_on  DATE,
  notes             TEXT
);

CREATE TABLE IF NOT EXISTS revenue_divisions (
  id            SERIAL PRIMARY KEY,
  district_id   INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  UNIQUE (district_id, slug)
);

CREATE TABLE IF NOT EXISTS mandals (
  id            SERIAL PRIMARY KEY,
  district_id   INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  division_id   INT REFERENCES revenue_divisions(id) ON DELETE SET NULL,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  UNIQUE (district_id, slug)
);
CREATE INDEX IF NOT EXISTS mandals_division_idx ON mandals(division_id);

-- Urban local bodies with a service page (municipal corporations and larger towns).
CREATE TABLE IF NOT EXISTS cities (
  id            SERIAL PRIMARY KEY,
  district_id   INT REFERENCES districts(id),
  mandal_id     INT REFERENCES mandals(id),
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  ulb_type      TEXT,
  region        TEXT,
  has_page      BOOLEAN NOT NULL DEFAULT FALSE,
  intro         TEXT,
  housing       TEXT,
  climate       TEXT,
  visit_note    TEXT
);

-- Municipalities and nagar panchayats without their own page yet.
CREATE TABLE IF NOT EXISTS towns (
  id            SERIAL PRIMARY KEY,
  district_id   INT NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
  mandal_id     INT REFERENCES mandals(id),
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  ulb_type      TEXT NOT NULL,
  UNIQUE (district_id, slug)
);

CREATE TABLE IF NOT EXISTS villages (
  id            SERIAL PRIMARY KEY,
  mandal_id     INT NOT NULL REFERENCES mandals(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  source_id     INT REFERENCES location_sources(id),
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (mandal_id, slug)
);
CREATE INDEX IF NOT EXISTS villages_name_idx ON villages(lower(name));

-- Colonies, apartment communities and neighbourhoods (city areas or imported).
CREATE TABLE IF NOT EXISTS localities (
  id            SERIAL PRIMARY KEY,
  city_id       INT REFERENCES cities(id) ON DELETE CASCADE,
  mandal_id     INT REFERENCES mandals(id) ON DELETE CASCADE,
  slug          TEXT NOT NULL,
  name          TEXT NOT NULL,
  kind          TEXT NOT NULL CHECK (kind IN ('area', 'colony', 'apartment', 'locality')),
  detail        TEXT,
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  CHECK (city_id IS NOT NULL OR mandal_id IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS localities_city_slug ON localities(city_id, slug) WHERE city_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS localities_mandal_slug ON localities(mandal_id, slug, kind) WHERE city_id IS NULL;

CREATE TABLE IF NOT EXISTS services (
  id            SERIAL PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  service_group TEXT NOT NULL,
  summary       TEXT NOT NULL,
  lede          TEXT,
  built_in      BOOLEAN NOT NULL DEFAULT TRUE,
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

-- One row per service offered at a place that has a page.
CREATE TABLE IF NOT EXISTS service_locations (
  id            SERIAL PRIMARY KEY,
  service_id    INT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  city_id       INT REFERENCES cities(id) ON DELETE CASCADE,
  locality_id   INT REFERENCES localities(id) ON DELETE CASCADE,
  mandal_id     INT REFERENCES mandals(id) ON DELETE CASCADE,
  available     BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS service_locations_service_idx ON service_locations(service_id);

CREATE TABLE IF NOT EXISTS images (
  id            TEXT PRIMARY KEY,
  src           TEXT NOT NULL UNIQUE,
  alt           TEXT NOT NULL CHECK (length(alt) >= 15),
  service_id    INT REFERENCES services(id) ON DELETE SET NULL,
  district_id   INT REFERENCES districts(id) ON DELETE SET NULL,
  uploaded      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_pages (
  id              SERIAL PRIMARY KEY,
  path            TEXT NOT NULL UNIQUE,
  kind            TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('publish', 'review', 'exclude')),
  indexable       BOOLEAN NOT NULL DEFAULT FALSE,
  manual_status   TEXT CHECK (manual_status IN ('publish', 'review', 'exclude')),
  score           SMALLINT NOT NULL DEFAULT 0,
  title           TEXT NOT NULL,
  reasons         TEXT[] NOT NULL DEFAULT '{}',
  template_version SMALLINT NOT NULL,
  input_hash      TEXT NOT NULL,
  service_id      INT REFERENCES services(id) ON DELETE CASCADE,
  city_id         INT REFERENCES cities(id) ON DELETE CASCADE,
  district_id     INT REFERENCES districts(id) ON DELETE CASCADE,
  mandal_id       INT REFERENCES mandals(id) ON DELETE CASCADE,
  updated_at      TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS seo_pages_kind_status_idx ON seo_pages(kind, status);

-- Admin-written overrides of the generated copy.
CREATE TABLE IF NOT EXISTS seo_content (
  id            SERIAL PRIMARY KEY,
  page_id       INT REFERENCES seo_pages(id) ON DELETE CASCADE,
  mandal_id     INT REFERENCES mandals(id) ON DELETE CASCADE,
  title         TEXT,
  description   TEXT,
  h1            TEXT,
  intro         TEXT,
  housing       TEXT,
  visit_note    TEXT,
  image_id      TEXT REFERENCES images(id) ON DELETE SET NULL,
  enabled       BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (page_id IS NOT NULL OR mandal_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS faqs (
  id            SERIAL PRIMARY KEY,
  service_id    INT REFERENCES services(id) ON DELETE CASCADE,
  page_id       INT REFERENCES seo_pages(id) ON DELETE CASCADE,
  question      TEXT NOT NULL,
  answer        TEXT NOT NULL,
  sort_order    SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS internal_links (
  id            BIGSERIAL PRIMARY KEY,
  from_page_id  INT NOT NULL REFERENCES seo_pages(id) ON DELETE CASCADE,
  to_path       TEXT NOT NULL,
  anchor        TEXT NOT NULL,
  module        TEXT
);
CREATE INDEX IF NOT EXISTS internal_links_from_idx ON internal_links(from_page_id);
CREATE INDEX IF NOT EXISTS internal_links_to_idx ON internal_links(to_path);

COMMIT;
