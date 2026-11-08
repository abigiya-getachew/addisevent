# AddisEvent 🎫

## What Is This?
A full-stack ticketing platform built for the local market:
- 🔍 Discover events by category, date, and neighbourhood
- 💳 Pay via **Telebirr, CBE Birr, or cash at gate**
- 📱 Get QR tickets delivered by SMS — no app required
- 🇪🇹 Full Amharic + English support
- 📊 Organizer dashboards, sales tracking, and entry validation

## Tech Stack
- **Frontend**: Next.js 16 (App Router) · Tailwind CSS · TypeScript
- **Backend**: Hono · Node.js
- **Database**: PostgreSQL · Drizzle ORM
- **Cache / rate limiting**: Redis
- **Search**: Meilisearch
- **Auth**: Auth.js v5
- **Payments**: Telebirr · CBE Birr · Chapa

## Project Status
🚧 **v0.1.0** — Core frontend and API are in active development; production
services and database setup are required before enabling live transactions.

## How to Run Locally
```bash
# Install
npm install

# Copy .env.example to .env and configure PostgreSQL, Redis, and Meilisearch.
# Start the Next.js app and API server together.
npm run dev
# Open → http://localhost:3000
```

Copy `.env.example` to `.env` and provide local PostgreSQL, Redis, and
Meilisearch services before starting the app. Database migrations are in
`drizzle/`; review them against the current schema before applying them to a
database.

## Deploying to Vercel

Vercel detects the Next.js app automatically; use the repository root as the
project root and keep the default Next.js build and output settings. In the
Vercel dashboard, create a new project and import this GitHub repository to
deploy it and create previews for later pushes.

Add these environment variables in **Project Settings → Environment Variables**
for each environment you deploy:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Reachable production PostgreSQL connection string. |
| `AUTH_SECRET` | Yes | Generate a unique secret, for example with `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST` | Yes | Set to `true` when running behind Vercel's proxy. |
| `AUTH_URL` | No | Set to the deployed site's public URL if automatic URL detection is not suitable. |
| `API_BASE_URL` | For registration | Public base URL of the separately hosted Hono API. It must not be `localhost`. |
| `REDIS_URL` | For API rate limiting | Reachable Redis service for the Hono API. |
| `MEILISEARCH_URL` and `MEILISEARCH_MASTER_KEY` | For search | Reachable Meilisearch instance and key. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | No | `en` or `am`; defaults to English. |

The Next.js app uses PostgreSQL for authentication, while the Hono API is a
separate Node.js service (`npm run build:server` / `npm run start:server`).
Deploy that API to a Node.js host and set `API_BASE_URL` to its public URL;
Vercel does not start the local `npm run dev` API process. Configure payment
and SMS credentials only if those integrations are enabled. Never put secrets
in `NEXT_PUBLIC_*` variables.

Before deploying, ensure the production database has the schema expected by
the application and use a production-only database URL. Build locally with
`npm run build`; Vercel runs the same command.
