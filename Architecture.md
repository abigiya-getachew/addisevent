# AddisEvent Architecture

- Status: Draft
- Last Updated: 2026-10-03
- Architecture Style: Modular monolith
- Primary Goal: Keep launch simple, secure, and reliable while staying ready to scale
- Deployment Region: Addis Ababa, Ethiopia

## 1. Overview

AddisEvent is designed as a modular monolith for the MVP. This allows the team to ship a working product quickly without the operational overhead of a distributed system. The core business domains are kept in a single deployable application while preserving clean internal boundaries for future service extraction.

The architecture is optimized around the key product risks:
- double-booking and overselling
- payment integrity and reconciliation
- QR ticket authenticity and validation
- low-data mobile performance
- trust and moderation for event listings

## 2. Architectural Principles

1. Keep the MVP simple and operationally reliable.
2. Treat payment and ticketing as critical transactional workflows.
3. Favor explicit domain boundaries over broad microservice complexity.
4. Use asynchronous jobs for non-blocking operations such as SMS delivery and reminders.
5. Ensure the platform works well in low-bandwidth mobile conditions.
6. Design the system to be horizontally scalable without a full rewrite.

## 3. High-Level System Context

```text
Users / Organizers / Admins
            │
            ▼
   Web App (Next.js + Tailwind)
            │
            ▼
   Application Layer (Node.js + Hono)
   - auth
   - events
   - bookings
   - payments
   - tickets
   - admin operations
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
 PostgreSQL     Redis
   (primary)     (cache, locks, session state)
      │
      ▼
   Meilisearch
   (search/filtering)
      │
      ┌─────┴─────┐
      │           │
      ▼           ▼
   External      Async Workers
   Payment APIs  BullMQ jobs
   SMS Gateway
   Social login
```

## 4. Application Layer Structure

The monolith is organized by domain modules instead of technical folders alone.

| Module | Responsibility |
|---|---|
| Auth | User/session management, social login, roles, guest checkout |
| Events | Event listing, metadata, moderation, venue and organizer relationships |
| Bookings | Reservation, checkout, pricing, payment status transitions |
| Tickets | QR generation, validation, duplicate detection, attendee verification |
| Payments | Gateway integration, webhook processing, payout orchestration |
| Admin | Moderation, support, organizer verification, reporting |
| Notifications | SMS reminders, confirmations, payout updates |
| Search | Filtering and faceted search integration |

This structure allows the application to remain modular while staying deployable as one service.

## 5. Core Runtime Flows

### 5.1 Event Discovery Flow

1. User opens the web app.
2. The app fetches curated and upcoming events from the Events module.
3. Search and filters are served through PostgreSQL and Meilisearch.
4. Event pages show details, organizer info, pricing, venue, and ticket availability.
5. Users can browse in Amharic or English depending on locale.

### 5.2 Booking and Payment Flow

1. User selects event and ticket quantity.
2. The app validates availability and ticket rules.
3. The booking service creates a pending or reserved booking record.
4. Payment is initiated through Telebirr or CBE Birr.
5. Payment callback or webhook is verified and processed idempotently.
6. On successful confirmation, the system generates a unique QR ticket.
7. Ticket is delivered via app and SMS.

### 5.3 Ticket Validation Flow

1. Organizer opens scanner tool from the console.
2. Scanner reads QR payload from attendee ticket.
3. App verifies ticket status and validity against the database.
4. If valid and unused, the ticket is marked as scanned.
5. If invalid, duplicate, or expired, the system rejects entry and logs the attempt.

## 6. Data Architecture

### 6.1 Primary Data Store

PostgreSQL is the system of record for all transactional data, including:
- users
- events
- organizers
- ticket inventory
- bookings
- payment records
- payouts
- ticket validation events

This is critical because financial and ticketing operations require strong consistency and atomic updates.

### 6.2 Supporting Services

| Service | Role |
|---|---|
| Redis | Temporary reservation locks, rate limiting, sessions, caching |
| Meilisearch | Fast faceted search by category, neighborhood, date, and keyword |
| BullMQ | Background jobs for SMS delivery, reminders, and sync tasks |
| Cloudflare R2 / S3 | Event media storage and image delivery |

### 6.3 Critical Business Rules

- Only one valid booking outcome per ticket purchase.
- Ticket inventory is reduced atomically with payment confirmation.
- Payment webhooks must be idempotent and signature-validated.
- A scanned QR ticket cannot be reused.
- Organizer actions are limited to their own event data.

## 7. Domain Model

```text
User
 ├── Attendee
 ├── Organizer
 └── Admin

Event
 ├── organizer_id
 ├── category
 ├── date_time
 ├── venue
 ├── pricing
 └── status

Booking
 ├── user_id_or_phone
 ├── event_id
 ├── quantity
 ├── total_amount
 ├── payment_method
 ├── status
 └── paid_at

Ticket
 ├── booking_id
 ├── qr_uuid
 ├── issued_at
 ├── validated_at
 └── validation_status

Payment
 ├── booking_id
 ├── gateway
 ├── request_id
 ├── transaction_id
 ├── status
 └── webhook_payload
```

## 8. Security Architecture

Security is treated as a core architectural concern, not an afterthought.

| Area | Design |
|---|---|
| Authentication | Auth.js with secure session management and social login |
| Authorization | Role-based access rules for attendee, organizer, and admin |
| Payment security | Webhook verification, idempotency, signed merchant requests |
| Ticket validation | Server-side verification against DB, not client trust |
| Data protection | TLS, encrypted storage, minimal PII retention |
| Abuse prevention | Redis-based rate limiting and anti-fraud checks |

### Critical Security Controls

- All payment callbacks are verified before status changes are processed.
- QR codes are validated on the server with database-backed truth.
- Organizer access is restricted to authorized event ownership.
- Sensitive environment variables are stored as secrets and never committed.

## 9. Resilience and Reliability

The architecture targets a reliable MVP rather than a highly distributed system.

### Resilience Measures

- Automated retries for SMS and payment/status reconciliation jobs
- Clear booking states: pending, reserved, paid, failed, expired
- Queue-based processing to prevent blocking the user experience
- Monitoring and alerting for API errors and payment anomalies

### Failure Scenarios Planned For

- Network interruption after payment but before ticket generation
- Duplicate webhook events from payment gateways
- Ticket scanner attempts on already-used QR codes
- SMS delivery delays in unreliable network conditions
- Organizer data entry mistakes during early launch onboarding

## 10. Scalability Path

The architecture is intentionally designed to scale without immediate service sprawl.

| Phase | Approach |
|---|---|
| MVP | Single app, single database, job queue, small team operations |
| Growth | Add dedicated search or analytics workers, optimize DB queries |
| Scale | Introduce read replicas, separate payout pipeline, and service boundaries |
| Large scale | Extract event, payment, and ticketing domains into dedicated services |

The system can evolve into a more distributed architecture without discarding the domain model or business logic that already exists.

## 11. Deployment Architecture

```text
Internet
   │
   ▼
 CDN / Edge
   │
   ▼
 Next.js Frontend (Vercel)
   │
   ▼
 API / App Server (Render or Fly.io)
   │
   ├── PostgreSQL (managed)
   ├── Redis (managed)
   ├── Meilisearch (managed)
   ├── BullMQ workers
   └── External APIs (Telebirr, CBE Birr, SMS, social auth)
```

### Deployment Principles

- Frontend and app services are decoupled for independent scaling and preview environments.
- Background jobs run independently from the request lifecycle.
- Environment variables and secrets are managed outside the source code.
- CI should block merges when tests or critical security checks fail.

## 12. NFRs and Constraints

### Non-Functional Requirements

| Requirement | Target |
|---|---|
| Mobile responsiveness | Fully usable on low-end mobile devices |
| Page load speed | Fast enough for slow 3G conditions |
| Payment reliability | 95%+ completion rate |
| QR validation accuracy | 99.9% |
| Availability | High uptime with monitored alerts |
| Security | Protected payment and ticket workflows |

### Key Constraints

- The MVP must work well in Addis Ababa without overbuilding.
- The platform cannot rely on heavy app downloads or complex onboarding.
- Ticket validity and payment integrity are non-negotiable requirements.
- Local payment and SMS support are essential for adoption.

## 13. Architectural Decision Summary

The architecture is intentionally simple but strong in the places that matter most:
- PostgreSQL for transaction safety
- Redis for locking and caching
- Hono + Next.js for fast full-stack delivery
- Background workers for operational tasks
- Modular monolith boundaries for future evolution

This keeps the product practical for launch while staying aligned with long-term scalability needs.
