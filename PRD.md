# AddisEvent — Local Event Booking Platform

- Version: 1.1
- Status: Draft
- Launch Market: Addis Ababa, Ethiopia
- Target Launch: Q4 2026
- Author: Senior Product Manager

## 1. Overview

AddisEvent is a mobile-first local event discovery and ticketing platform for Addis Ababa. It connects attendees to trusted real-world events and helps organizers sell tickets, collect payments, and validate attendance using digital QR tickets.

The product focuses on three core outcomes:
- Make event discovery centralized and trustworthy
- Enable local payment options that users already trust
- Eliminate fake or duplicate tickets through QR-based validation

## 2. Problem Statement

### 2.1 Current Reality

Attendees currently discover events through fragmented channels such as Facebook, Instagram, Telegram, and informal word-of-mouth. Event details are often incomplete, ticketing is manual or unreliable, and there is no centralized source that guarantees ticket authenticity.

Organizers, especially small and mid-sized promoters, event venues, and community planners, struggle to:
- Sell tickets without relying on ad hoc social media posts
- Collect payments through trusted local methods
- Validate attendance quickly and accurately
- Reach audiences beyond their immediate follower base

### 2.2 Market Gap

The local event market lacks a simple, reliable platform designed for:
- Mobile-first usage in low-data conditions
- Amharic and English bilingual UX
- Locally trusted payment methods such as Telebirr and CBE Birr
- Verified organizer and attendee trust
- Instant QR-ticket issuance and validation

### 2.3 Business Opportunity

AddisEvent can become the trusted hub for local events in Addis Ababa by providing a single platform for discovery, booking, local payments, and proof-of-attendance.

## 3. Goals and Non-Goals

### 3.1 Product Goals

- Increase trust in local event discovery by centralizing verified listings
- Allow users to find relevant events quickly by date, category, and neighborhood
- Support local payment methods to reduce friction and increase conversion
- Reduce fake tickets and manual paper-based verification via QR validation
- Help organizers sell more effectively and receive payouts reliably

### 3.2 Success Goals

- Launch with a high-quality initial event inventory in Addis Ababa
- Support 100+ live ticketed events within the first 3 months
- Sell 5,000+ tickets in the first 3 months
- Achieve 95%+ payment completion rate
- Maintain 99.9% QR validation accuracy

### 3.3 Non-Goals

The MVP does not include:
- Organizer self-serve event creation
- User reviews and social recommendations
- Advanced seat maps and reserved seating
- Dedicated native mobile apps
- Multi-city rollout before Addis Ababa validation
- Wedding, sports league, and large international conference verticals

## 4. Target Users

| Segment | Profile | Core Need |
|---|---|---|
| Attendee — Urban Explorer | 18–35, smartphone user, active on social media, lives in Addis Ababa | Discover trusted events, pay using familiar methods, and receive a valid ticket |
| Attendee — Low-Data / Casual User | Limited data, relies on quick mobile experiences, may prefer SMS-based communication | Access simple event information and receive tickets without heavy data usage |
| Organizer — Promoter | Runs concerts, festivals, and nightlife events | Sell tickets digitally, monitor sales, and validate attendees efficiently |
| Organizer — Venue / Community Group | Hosts workshops and community gatherings with limited technical capacity | Publish events quickly and collect payments without manual handling |
| Organizer — Corporate / Seminar Host | Organized professional events with strong operational and compliance expectations | Offer professional event pages, reliable attendee tracking, and transparent pricing |

## 5. User Stories

### 5.1 Attendee Stories

| ID | User Story | Priority |
|---|---|---|
| A-01 | As an Addis Ababa resident, I want to browse upcoming events in one place so I do not miss relevant events. | P0 |
| A-02 | As a user, I want to filter by category, date, and neighborhood so I can find events that match my interests. | P0 |
| A-03 | As a Telebirr or CBE Birr user, I want to pay using my preferred mobile money method so I can complete checkout confidently. | P0 |
| A-04 | As a user without immediate funds, I want to reserve and pay at the gate with confirmation so I am not excluded from events. | P1 |
| A-05 | As a buyer, I want to receive an instant QR ticket via app or SMS so I can enter without paper tickets. | P0 |
| A-06 | As a bilingual user, I want to view the platform in Amharic and English so I can navigate comfortably. | P0 |
| A-07 | As a low-data user, I want lightweight pages and SMS-based ticket delivery so I can use the platform in poor connectivity conditions. | P1 |

### 5.2 Organizer Stories

| ID | User Story | Priority |
|---|---|---|
| O-01 | As an organizer, I want the platform team to publish my event quickly so I can start selling without complex setup. | P0 |
| O-02 | As an organizer, I want to import my existing Facebook event details so I do not re-enter all information manually. | P0 |
| O-03 | As an organizer, I want to see real-time sales and payment status so I can plan confidently. | P0 |
| O-04 | As an organizer, I want a QR scanner to verify attendees at entry so fake tickets are prevented. | P0 |
| O-05 | As an organizer, I want payouts processed reliably to my Telebirr or CBE Birr account so I receive my earnings on time. | P0 |

### 5.3 Platform Team / Admin Stories

| ID | User Story | Priority |
|---|---|---|
| T-01 | As an admin, I want to create and publish events on behalf of organizers so we maintain quality at launch. | P0 |
| T-02 | As an admin, I want to review all events before they go live so only verified, legitimate listings appear. | P0 |
| T-03 | As an admin, I want to manage payouts through a licensed processor so funds are handled legally and securely. | P0 |

## 6. Functional Requirements

### 6.1 MVP Scope

| Module | Feature Requirements | Notes |
|---|---|---|
| Discovery and Listings | Homepage with curated and upcoming events, category filters, date filters, neighborhood filters, search, and bilingual interface | Events are initially uploaded by the platform team |
| Event Detail Pages | Event title, date, time, venue, price, organizer details, gallery, and map | Mobile-first layout with concise content |
| Attendee Accounts | Social sign-in options, basic profile, booking history, saved preferences, ticket wallet | Guest checkout remains available |
| Payments | Telebirr and CBE Birr as primary methods, card payment as secondary, transparent fees, VAT-compliant receipts | Funds pass through a licensed payment processor |
| Ticketing and Validation | Unique QR ticket generation, app and SMS delivery, duplicate/fake detection, organizer scanner tool | Validation accuracy is a critical non-negotiable requirement |
| Organizer Console | Sales dashboard, attendee list, QR scanning, and payout status | Self-serve event creation is deferred |
| Admin and Trust | Event moderation, organizer verification, support flow, and suspicious listing reporting | Early onboarding is manual and curated |
| Platform Infrastructure | Mobile-first responsive UX, low-data optimization, SMS integration, and privacy safeguards | Key to adoption in Addis Ababa |

### 6.2 Post-MVP Roadmap

| Feature | Reason for Delay | Target Release |
|---|---|---|
| Organizer self-serve event creation | Manual onboarding supports controlled quality early | 3–6 months post-launch |
| User reviews and ratings | Trust should be reinforced through verification before social signals | 4–6 months |
| Social discovery features | MVP prioritizes reliable core booking flow over social features | 6 months |
| Advanced analytics and seat maps | Not required for the booking funnel | Post-MVP |
| Dedicated organizer mobile app | Web console meets launch needs | Post-MVP |
| Expansion to other cities | Focus on Addis Ababa before scaling | 6–12 months |
| Weddings, sports leagues, and major international conferences | Higher complexity and lower initial core demand | 9–12 months |

## 7. Success Metrics

### 7.1 Business KPIs

| Metric | MVP Target | Definition |
|---|---:|---|
| Event volume | 100+ live events in first 3 months | Active, ticketed events published |
| Organizer retention | 70%+ rebooking rate | Organizers issuing a second event |
| Ticket sales | 5,000+ tickets sold in first 3 months | Paid and confirmed bookings |
| Payment success rate | ≥95% | Started-to-paid conversion rate |
| Validation accuracy | 99.9% | Correct QR scans with no confirmed fakes |
| User satisfaction | ≥4.6/5 average rating | Post-booking user feedback |
| Market penetration | Measurable share of Addis Ababa digital event market | Tracking unique buyers per month |

### 7.2 Leading Indicators

- Monthly active users and daily active users trend
- SMS ticket delivery confirmation rate
- Time-to-first-purchase under 3 minutes
- Organizer onboarding completion rate
- Ticket conversion rate from event page to checkout

## 8. Risks and Edge Cases

| Scenario | Risk Level | Mitigation |
|---|---|---|
| Payment sent but ticket not generated due to network interruption | High | Auto-reconciliation, retry logic, manual support override, SMS confirmation backup |
| Pay-at-gate no-shows | Medium | Reminder SMS 24 hours before event, limits on unpaid reservations, confirmation reminders |
| Fake or scalped tickets | Critical | Unique QR ticket per purchase, real-time validation, one-scan enforcement, verified organizer badges |
| Low connectivity and offline usage | High | SMS-first ticket delivery, lightweight pages, cached ticket view |
| Language or cultural mismatch | Medium | Amharic-native review of copy and local user testing |
| Regulatory or payment licensing delays | Critical | Engage licensed payment processor early and complete legal review before launch |
| Organizer churn due to manual onboarding | Medium | Dedicated onboarding team, batch import support, and Facebook data import |
| Payout delays causing distrust | High | Publish a clear payout schedule, send automated updates, and provide visible support contact |

## 9. Constraints and Assumptions

- The platform must support mobile-first access in Addis Ababa.
- Payment methods must be aligned with user trust and local market realities.
- Ticket authenticity and validation are non-negotiable product essentials.
- The first launch will rely on a curated event catalog managed by the platform team.
- Platform operations must include moderation and support to maintain trust at launch.

## 10. Differentiator Promise

"Every real event in your city, in one place — in your language, with a ticket that actually works."

This promise is the foundation for all product decisions.

- Trust: verified organizers, unique QR tickets, and zero tolerance for fake entries
- Discovery: one central place instead of fragmented social channels
- Local relevance: Amharic and English support, Telebirr and CBE Birr priority, SMS support
- Simplicity: focus on the essentials and execute them well

## 11. Definition of Done for MVP

The MVP is ready when:
- Users can browse and filter an initial set of verified events
- Ticket purchase and payment flows work for supported local methods
- QR tickets are generated and delivered reliably
- Organizers can track sales and validate tickets using the scanner
- Admins can moderate events and manage payouts through the approved process
- Mobile experience is functional in low-data and bilingual conditions
