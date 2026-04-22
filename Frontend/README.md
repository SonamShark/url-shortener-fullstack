# Shorty — Frontend

React + Vite frontend for the URL Shortener. Talks to a Node/PostgreSQL/Redis
backend over REST and renders a small UI with Tailwind CSS.

## Stack

- **React 19** with **Vite**
- **Tailwind CSS** (via `@tailwindcss/vite`)
- **React Router Dom** for client-side routing
- **Axios** for HTTP

## Project structure

```
src/
  components/     Reusable UI building blocks (Navbar, UrlForm, ResultCard)
  pages/          Route-level components (Home, Stats, Redirect, NotFound)
  services/       External integrations — api.js (Axios instance + endpoints)
  hooks/          Custom React hooks (useShortener, useStats, useClipboard)
  App.jsx         Router + layout shell
  main.jsx        React entry point
  index.css       Tailwind import + base styles
```

## Routes

| Path     | Component  | Description                                       |
| -------- | ---------- | ------------------------------------------------- |
| `/`      | `Home`     | Paste a long URL and get a short one back         |
| `/stats` | `Stats`    | Table of recent links with total clicks + created |
| `/:slug` | `Redirect` | Resolves slug via API and redirects to the target |
| `*`      | `NotFound` | 404 fallback                                      |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy the example env file and point it at your backend:

```bash
cp .env.example .env
```

`.env`

```env
VITE_API_URL=http://localhost:4000/api
```

Vite only exposes variables prefixed with `VITE_` to the client. Restart
`npm run dev` after changing env values.

### 3. Run the dev server

```bash
npm run dev
```

Open http://localhost:5173.

### 4. Build for production

```bash
npm run build
npm run preview
```

## API contract (expected from backend)

The Axios service in [src/services/api.js](src/services/api.js) expects:

- `POST /shorten` — body `{ url: string }`, returns
  `{ slug, shortUrl, originalUrl, createdAt }`
- `GET /links` — returns an array (or `{ links: [...] }`) of recent links
  with `slug`, `originalUrl`, `clicks`, `createdAt`
- `GET /links/:slug` — returns `{ originalUrl }` for redirect resolution

Field names are tolerant of snake_case variants (`short_url`, `long_url`,
`total_clicks`, `created_at`) so the UI renders regardless of the exact
backend casing.

## Docker (later)

The app is a static Vite build, so it containerizes cleanly with a multi-stage
Dockerfile (`node` build → `nginx` serve). `VITE_API_URL` is baked in at
build time — pass it as a build arg.
