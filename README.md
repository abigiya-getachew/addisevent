# AddisEvent 🎫

## What Is This?
A full-stack ticketing platform built for the local market:
- 🔍 Discover events by category, date, and neighbourhood
- 💳 Pay via **Telebirr, CBE Birr, or cash at gate**
- 📱 Get QR tickets delivered by SMS — no app required
- 🇪🇹 Full Amharic + English support
- 📊 Organizer dashboards, sales tracking, and entry validation

## Tech Stack
- **Frontend**: Next.js 15 (App Router) · Tailwind CSS · TypeScript
- **Backend**: Hono · Node.js
- **Database**: PostgreSQL 16 · Redis
- **Search**: Meilisearch
- **Auth**: Auth.js v5
- **Payments**: Telebirr · CBE Birr · Chapa

## Project Status
✅ **v0.1.0** — Foundation phase
- [x] Architecture & design brief
- [x] Project structure & docs
- 🔄 **Next**: Next.js + Tailwind base setup

## How to Run Locally
```bash
# Install
npm install

# Configure environment variables in .env. For Supabase on an IPv4-only
# network, reset the database password in Supabase if needed, then copy the
# complete Session pooler string from Dashboard > Connect and URL-encode any
# reserved password characters. Updating .env does not change Supabase's password.
# Apply the SQL migrations in server/src/db/migrations in filename order using
# the Supabase SQL Editor before starting the app.
# Start the Next.js app and API server together
npm run dev
# Open → http://localhost:3000
