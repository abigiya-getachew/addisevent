# 01 — User Flows

**Version**: 1.0

---

## Flow A — Attendee: Discover → Book → Attend (Happy Path)

```
[Homepage / Discovery]
       │
       ▼
[Search OR Browse by Category/Date/Neighbourhood]
       │
       ▼
[Event Detail Page]
   │  ├─ Verify: organizer badge, venue map, photos
   │  └─ Compare ticket tiers (Early Bird / Regular / VIP)
       ▼
[Select Tier + Quantity → Checkout]
       │
       ▼
[Payment Method Selection]
   ├─ Telebirr (default, first option)
   ├─ CBE Birr
   ├─ Card (secondary)
   └─ Pay at Gate (reservation only)
       │
       ▼
[Payment Processing — loading state, no back button]
       │
       ▼
[Confirmation Screen — success state]
       │
       ├─ QR ticket generated instantly
       ├─ Ticket delivered: in-app wallet + SMS
       ├─ Add to Calendar / Share / Save to Wallet
       └─ "Browse more events" secondary link
       │
       ▼
[Event Day → Show QR → Organizer scans → Entry]
```

**Success metric for this flow**: Time from event detail → confirmed ticket < 3 minutes.

---

## Flow B — Pay-at-Gate (Cash Users)

```
[Event Detail → Select Tier]
       │
       ▼
[Choose "Reserve — Pay at Gate"]
       │  Note shown: "Your spot is held. Pay cash at the door. Bring your reservation code."
       ▼
[Reservation Confirmation]
       ├─ Reservation QR generated (marked UNPAID)
       ├─ SMS with code + reminder sent
       └─ Auto-reminder SMS 24h before event
       │
       ▼
[At Gate → Show reservation QR → Organizer collects cash → marks PAID → entry]
```

**Guardrail**: Max 2 unpaid reservations per user; unpaid reservations expire 1 hour before event start.

---

## Flow C — Failed Payment Recovery

```
[Payment Processing]
       │
       ▼ (network drop / insufficient balance / declined)
[Error Screen — clear reason + next step]
   ├─ "Retry payment" (primary) — re-attempts same method
   ├─ "Try another method" (secondary) — back to method select
   └─ "Reserve & pay at gate" (tertiary) — converts to reservation
       │
       ▼
[If retry succeeds → Confirmation (Flow A)]
[If user abandons → Booking saved as "pending" in My Tickets; reminder SMS]
```

**Critical rule**: A payment that left the user's account but failed to generate a ticket MUST trigger auto-reconciliation + a manual support ticket. Never show "payment failed" if funds were debited.

---

## Flow D — Organizer: Onboard → Sell → Validate → Get Paid

```
[Organizer contacted by platform team (seed phase)]
       │
       ▼
[Team onboards: collects event info OR imports Facebook event]
       │
       ▼
[Admin reviews & verifies organizer → event published]
       │
       ▼
[Organizer Dashboard — live sales tracking]
   ├─ Tickets sold / revenue / remaining capacity
   ├─ Paid vs. Reserved breakdown
   └─ Attendee list export (CSV)
       │
       ▼
[Event Day → QR Scanner mode]
   ├─ Scan attendee ticket → Valid (green) / Already Used (red) / Fake (red)
   ├─ Pay-at-gate attendees → collect cash → mark paid → scan
   └─ Live entry counter visible
       │
       ▼
[Post-Event → Payout processed via licensed processor → Organizer notified]
```

---

## Flow E — Admin: Event Publishing (Seed Phase)

```
[Organizer submits event info (form / WhatsApp / email / Facebook import)]
       │
       ▼
[Admin CMS — moderation queue]
   ├─ Verify organizer identity & past record
   ├─ Check event details, pricing, venue
   ├─ Set ticket tiers & capacities
   └─ Approve → Publish OR Reject with reason
       │
       ▼
[Event live on homepage + category feeds]
```

---

## Global Navigation Map

```
Mobile (Bottom Tab Bar — persistent, 4 tabs)
├── Home        → Discovery feed, featured, categories
├── Search      → Browse + filters
├── Tickets     → My wallet (valid + past + reservations)
└── Profile     → Account, language, payment methods, support

Desktop (Top Navigation)
├── Logo | Search bar | Language toggle | Login/Avatar
└── Secondary: For Organizers link (footer + header CTA)

Organizer Role (separate nav after login)
├── Dashboard → Events → Sales → Payouts → Scanner (mobile only)
Admin Role (CMS, desktop only)
└── Moderation queue → Events → Organizers → Payouts → Reports
```

---

## Key Decision Points & Rules

| Decision Point | Rule |
|---|---|
| Account creation | Optional. Guest checkout with name + phone always available. Account prompt shown after successful booking ("Save your tickets"). |
| Payment method order | Telebirr → CBE Birr → Card → Pay at Gate. Never alphabetical. |
| Language toggle | Persists to device; flips entire UI; Amharic default for Ethiopian phone numbers. |
| Sold-out event | Show "Sold Out" state + "Notify me if spots open" waitlist (captures phone). |
| Duplicate ticket scan | Second scan shows "Already used at HH:MM" with timestamp — prevents double-entry. |
| Offline ticket view | Ticket QR cached on device; accessible without internet. |
| Event cancellation | Full refund processed; SMS + in-app notification; "Browse similar events" suggestion. |
