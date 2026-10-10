# Sri Ganesha Home Safety Solutions

Programmatic SEO site for home safety fittings in Andhra Pradesh. Pages are served by the Next.js App Router. PostgreSQL stores the publishing ledger. The live catalogue is still the reviewed TypeScript data under `src/data`.

## Stack

Next.js App Router, React, TypeScript strict, Tailwind CSS, PostgreSQL, Prisma, Zod, Vitest, Playwright, ESLint.

## Install

```bash
npm install
npx prisma generate
```

Copy `.env.example` to `.env`. Leave secrets empty until they are real. Do not invent a phone number, address, or tracking ID.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm start
```

`npm run lint` runs ESLint. Next.js 16 does not provide `next lint`.

Publishing commands refuse to run until `DATABASE_URL` is set, and `pages:publish` refuses to run without `--batch-size` of 1 to 500.

See `DEPLOYMENT.md` and `PUBLISHING_WORKFLOW.md`.
