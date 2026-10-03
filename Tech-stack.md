# AddisEvent Tech Stack

- Status: Final
- Last Updated: 2026-10-03
- Priority Order: Simplicity → Security → Scalability
- Launch Market: Addis Ababa, Ethiopia
- Architecture: Modular monolith with service extraction only when scale demands it

## 1. Overview

The technology stack is designed to prioritize fast product delivery, mobile performance, local payment support, and operational trust. The system uses a modular monolith architecture to keep the MVP simple, while maintaining a clear upgrade path for scale.

```text
[Client] Next.js 15 (App Router) + Tailwind CSS
    ↓
[API Layer] Node.js + Hono (TypeScript)
    ↓
[Core DB] PostgreSQL 16 (ACID, source of truth)
    ↓
[Cache / Search / Queue] Redis + Meilisearch + BullMQ
    ↓
[External Services] Telebirr · CBE Birr · SMS Gateway · Social Login
```

## 2. Frontend

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Next.js | 15 (App Router) | Full-stack React framework | Strong SEO for event discovery, low-data optimization, and PWA support for offline ticket access |
| Tailwind CSS | Latest | Design system and styling | Small CSS footprint, fast iteration, consistent design tokens |
| next-i18next | Latest | Bilingual UI | Supports native Amharic and English interfaces with locale-aware behavior |
| React Aria / Radix UI | Latest | Accessible component primitives | Improves compliance, keyboard support, and semantic building blocks |
| Zod | Latest | Type-safe validation | Shared validation logic across frontend and backend reduces input bugs |
| PWA | — | App-like mobile UX | Allows add-to-home-screen behavior and cached ticket access without a native app |

### Frontend Decision Notes

- Avoid Vite SPA for MVP because SEO and initial indexing are important for event discovery.
- Avoid Vue/Nuxt because local engineering familiarity is lower than with React.
- Defer Flutter/React Native until there is clear product traction and a need for a dedicated app.

## 3. Backend

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| Node.js | 20 LTS | Runtime | Full-stack TypeScript allows shared validation and developer efficiency |
| Hono | Latest | API framework | Fast, lightweight, and edge-capable; works well for a lean MVP |
| NestJS | Post-MVP | Modular architecture | Useful later if organizer self-serve, analytics, and multi-city growth increase complexity |
| BullMQ | Latest | Async job queue | Handles SMS tickets, reminders, scheduled publishing, and bulk sync tasks |

### Backend Decision Notes

- Prefer TypeScript across the full stack for consistency and faster iteration.
- Avoid Python/FastAPI due to keeping the stack aligned around one language ecosystem.
- Avoid Go for MVP to prevent premature complexity.

## 4. Database and Storage

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| PostgreSQL | 16+ | Primary transactional database | ACID guarantees are essential for bookings, payments, and ticket integrity |
| Redis | 7+ | Cache, locks, and session management | Helps prevent oversells and supports rate limiting and caching |
| Meilisearch | Latest | Fast faceted search | Lightweight search for categories, dates, and neighborhood filtering |
| Cloudflare R2 / S3 | — | Media and file storage | Efficient event banners and image delivery with CDN support |

### Core Data Model

- events: id, title, organizer_id, category, date_time, venue, status, created_at
- bookings: id, user_id_or_phone, event_id, tier, qty, status, payment_method, total, paid_at
- tickets: id, booking_id, qr_uuid, validated_at, gate_notes
- users: id, role, phone, email, locale

### Database Decision Notes

- PostgreSQL is the source of truth because ticketing and payment integrity require strong transactional consistency.
- MongoDB is not a fit for the MVP because eventual consistency is a major risk for finance-related workflows.

## 5. Authentication and Authorization

| Technology | Purpose | Rationale |
|---|---|---|
| Auth.js (NextAuth) v5 | Session and auth layer | Supports Google/Facebook login and secure role-based access controls |
| Guest Checkout | No-account ticket purchase flow | Reduces friction for users who prefer phone-based checkout |
| Security Controls | Password hashing and secure session handling | Uses bcrypt with strong work factors and secure cookie configuration |

### Auth Requirements

- Passwords should use bcrypt with a minimum 12-round work factor.
- JWTs should expire quickly and rotate refresh tokens properly.
- Auth cookies should be Secure, SameSite, and HttpOnly.
- Roles should include attendee, organizer, and admin.

## 6. Payments and External APIs

| Integration | Method | Notes |
|---|---|---|
| Telebirr | Direct merchant API | Primary local payment option |
| CBE Birr | Direct merchant API | Secondary local payment option |
| Chapa | Payment aggregator | Useful fallback for cards and mobile payments in staging/test |
| Pay-at-Gate | Reservation flow | Allows hold-and-confirm reservations with expiry rules |
| SMS | Africa's Talking / Ethio Telecom Bulk | Ticket delivery, verification codes, reminders |
| Facebook Graph API | Event import | Helps with onboarding and populating event details quickly |

### Payment Safety Rules

- Never hold customer funds directly; use a licensed payment processor.
- Validate webhook signatures before processing status updates.
- Use idempotency keys to prevent duplicate confirmations.
- Generate tickets only after a payment is confirmed.

## 7. Testing Strategy

| Layer | Tool | Purpose |
|---|---|---|
| Unit | Vitest | Fast TypeScript-native tests for utilities and QR logic |
| Integration | Vitest + Supertest | API contract validation and booking transitions |
| E2E | Playwright | Critical user journeys such as browse → book → pay → ticket → validate |
| Security | Snyk + Manual Review | Dependency monitoring and OWASP review |

### Must-Pass Tests

- Concurrent booking must never oversell inventory.
- Duplicate QR scans must be rejected.
- Language switching must update all relevant UI states.
- Payment webhook replays must not create duplicate confirmations.

## 8. Deployment and Infrastructure

| Service | Use Case | Cost Notes |
|---|---|---|
| Vercel | Frontend hosting | Best fit for Next.js with preview deployments and CDN |
| Render / Fly.io | Backend API | Simple deployment with managed SSL and environment secrets |
| Neon / Supabase | PostgreSQL hosting | Managed and encrypted with backup support |
| Upstash | Redis | Managed, low-maintenance cache and rate-limiting layer |
| Sentry | Error monitoring | Captures payment failures and abnormal usage patterns |
| UptimeRobot | Availability monitoring | Detects downtime and triggers alerts |
| GitHub Actions | CI/CD | Runs tests and blocks broken code before deployment |

### MVP Monthly Cost Estimate

- Estimated cost: $40–120/month depending on traffic and usage patterns

## 9. Security Principles

| Control | Implementation |
|---|---|
| Encryption | TLS 1.3 everywhere; encrypted database storage and encrypted backups |
| Input Guardrails | Zod validation on endpoints and strict data limits |
| Rate Limiting | Redis-based throttle against brute-force and abuse |
| Ticket Integrity | UUID-based ticket IDs with signed validation checks |
| Data Privacy | Minimal PII collection and deletion workflow support |
| Least Privilege | Organizers only access their own events; admin actions are logged |

## 10. Roadmap for Upgrades

| Stage | Milestone | Architectural Shift |
|---|---|---|
| MVP | Launch in Addis Ababa | Unified monolith with lean operational tooling |
| Proven | 5K+ tickets sold | Add a dedicated search layer and analytics services |
| Scale | Multi-city launch | Introduce read replicas and a dedicated payout service |
| Enterprise | 50K+ users | Event-driven architecture and more specialized microservices |

## 11. Local Development Quick Start

```bash
# Clone the repo
git clone <repo>
cd addisevent
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in: DATABASE_URL, REDIS_URL, TELEBIRR_*, CBEBIRR_*, AUTH_*, SMS_*

# Start local development
npm run dev
# Frontend: http://localhost:3000
# API proxy: /api/* → Hono handler
```

## 12. Summary

This stack supports the MVP’s strategic priorities:
- Fast delivery with a simple, maintainable architecture
- Strong security for payments and ticket validation
- Mobile-first performance suitable for low-data users
- Local payment integration and bilingual UX
- Clear and incremental path to scale without premature complexity
