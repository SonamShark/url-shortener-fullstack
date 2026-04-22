# Shorty — Backend

Node + Express + Sequelize (PostgreSQL) + Redis URL shortener API.

## Project structure

```
Backend/
  index.js              entry point (loads src/server.js)
  src/
    server.js           Express app + lifecycle (DB connect, click flusher, shutdown)
    config.js           env loading + validation
    db/
      index.js          Sequelize instance
      models/Link.js    links table model
    services/
      cache.js          Redis client + cache helpers
      linkService.js    business logic (slug gen, create, list, resolve)
    middleware/
      errorHandler.js   HttpError + notFound + global error handler
      rateLimit.js      Redis-backed per-IP limiter
    routes/
      shorten.js        POST /api/shorten
      links.js          GET /api/links, GET /api/links/:slug
```

## Endpoints

| Method | Path                | Body            | Response                                       |
| ------ | ------------------- | --------------- | ---------------------------------------------- |
| POST   | `/api/shorten`      | `{ url }`       | `{ slug, shortUrl, originalUrl, clicks, createdAt }` |
| GET    | `/api/links`        | —               | `[{ slug, shortUrl, originalUrl, clicks, createdAt }, ...]` |
| GET    | `/api/links/:slug`  | —               | `{ originalUrl }`                              |
| GET    | `/:slug`            | —               | 302 redirect to original                       |
| GET    | `/health`           | —               | `{ status, env }`                              |

## Setup

```bash
cp .env.example .env
# edit .env to point at your PG + Redis
npm run dev   # node --watch
# or
npm start
```

You need a Postgres database and a Redis instance running. The `links` table
is auto-created on boot via `sequelize.sync()`.

## How Redis is used

- **Cache `slug -> originalUrl`** with 24h TTL — `/:slug` and `/api/links/:slug`
  hit Redis first, fall back to PG, and re-cache.
- **Click buffering** — every resolve does `INCR clicks:{slug}` in Redis. A
  background flusher (every 30s, also on shutdown) drains those counters into
  the `clicks` column on `links`. Keeps the hot path off PG.
- **Rate limiting** — `POST /api/shorten` is limited to 10/min per IP via
  `INCR` + `EXPIRE`. Redis outage degrades open (logged warning).

## Notes

- Slugs are 7-char base64url from `crypto.randomBytes`. Insert retries on
  unique-constraint collisions (5 attempts).
- `CORS_ORIGIN` defaults to `http://localhost:5173` to match the Vite frontend.
- `PUBLIC_BASE_URL` is what the API stitches into `shortUrl` in responses.
  Set it to your production hostname when deployed.
