# Impram website

Next.js site for [impram.net](https://impram.net) — English improv in Gothenburg.

## Setup

```bash
npm install
cp .env.example .env.local
```

Set `ADMIN_PASSWORD` and `SESSION_SECRET` in `.env.local`.

Import content from WordPress (or seed from `content/seed.json`):

```bash
npm run migrate:wp
# or, if seed.json already exists:
npm run seed
```

## Development

```bash
npm run dev
```

Admin UI: `/admin/` (password from `ADMIN_PASSWORD`).

## Deploy (Vercel)

1. Create a [Turso](https://turso.tech) database and set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.
2. Create a Vercel Blob store and set `BLOB_READ_WRITE_TOKEN`.
3. Set `SESSION_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL=https://impram.net`.
4. Run `npm run migrate:wp` once against production DB (or commit `content/seed.json` and run `npm run seed` in a build step).
5. Point `impram.net` DNS to Vercel.
6. Submit `/sitemap.xml` in Google Search Console.

Legacy redirects (`/join-us-obsolete/`, `/shows-obsolete-2/`) are configured in `next.config.ts`.
