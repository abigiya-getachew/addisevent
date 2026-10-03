# 06 — UI States

**Version**: 1.0
**Rule**: Every screen and every interactive component must define all four states. No screen ships without an empty-state design.

---

## 6.1 Empty States

### Homepage — No events in category
```
┌──────────────────────────────┐
│      [SVG: calendar + magnifier]│
│                              │
│   Nothing here yet           │  H3
│   We're adding events in     │  body (muted)
│   this category every week.  │
│                              │
│   [Browse all events]        │  secondary button
│   [Notify me when live →]    │  text link (captures phone)
└──────────────────────────────┘
```

### My Tickets — No tickets yet
```
┌──────────────────────────────┐
│      [SVG: ticket stub]       │
│                              │
│   No tickets yet             │
│   When you book an event,    │
│   your ticket lives here.    │
│                              │
│   [Discover events]          │  primary button → homepage
└──────────────────────────────┘
```

### Organizer Dashboard — No events published
```
┌──────────────────────────────┐
│   Your events will appear    │
│   here once published by     │
│   our team.                  │
│   Contact: support@addisevent│  (seed phase — no self-serve)
└──────────────────────────────┘
```

### Search — No results
```
┌──────────────────────────────┐
│   No events match "jazz"     │
│   Try a different date or    │
│   neighbourhood.             │
│   [Clear filters]            │
└──────────────────────────────┘
```

**Copy rule**: Empty states are never just "No data." They explain why + give one clear next action.

---

## 6.2 Loading States

### Event list / Homepage feed
- **Skeleton cards**: Pulse animation, matching exact card shape (image block + 2 text lines). Never a generic spinner.
- **Timeout**: If >5s on slow connection, show partial content + "Loading more..." + retry option.

### Event detail
- Hero image skeleton (16:9 block) + text line skeletons. Ticket tiers render as skeleton bars.
- **Critical**: If image fails, show gradient placeholder with event initials — never a broken image icon.

### Payment processing (A-06)
```
┌──────────────────────────────┐
│                              │
│      [spinner: accent ring]  │
│                              │
│   Processing your payment... │  H3
│   Do not close this page.    │  body (reassurance)
│                              │
│   🔒 Secure · Telebirr       │  trust line
│                              │
│   [Having trouble?]          │  text link (only after 15s)
└──────────────────────────────┘
```
- No back button. No navigation. Auto-polls payment status every 3s up to 60s, then falls to error state with manual check option.

### Organizer dashboard
- KPI cards skeleton + table row skeletons. Numbers animate in (count-up) once loaded.

---

## 6.3 Error States

### Payment failed (recoverable)
```
┌──────────────────────────────┐
│      [SVG: warning circle]   │
│                              │
│   Payment didn't go through  │  H3
│   Insufficient balance in    │  specific reason (never generic)
│   your Telebirr account.     │
│                              │
│   [Try again]                │  primary (same method)
│   [Use another payment]      │  secondary
│   [Reserve & pay at gate]    │  text link
└──────────────────────────────┘
```
**Specific reasons to surface (translated)**:
- Insufficient balance
- Network timeout — please check connection
- Card declined — contact your bank
- Payment processor unavailable (rare) → offer pay-at-gate

### Network / offline
- Banner at top: "You're offline. Tickets already saved are still viewable."
- Ticket wallet still accessible (cached). Booking flows blocked with clear message.

### Invalid / already-used ticket (scanner result)
```
Full-screen red overlay, 2s auto-dismiss:
✗ Already used
Scanned at 8:14 PM by Gate 1
Ticket: TKT-AB2-7X9Z
[Show details] (manual override for supervisor)
```

### Form validation errors
- Inline, below field, red text, 12px. Example: "Enter a valid Ethiopian phone number (10 digits after +251)."
- Never clear the user's input on error. Highlight the field with red border; focus first error field on submit.

### Generic error boundary
"Something went wrong. [Retry] — if this keeps happening, contact support via WhatsApp [link]."

---

## 6.4 Success States

### Booking confirmed (A-07)
- Green check circle (64px), celebratory headline ("You're going!"), ticket preview, actions.
- Confetti? **No** — keep it calm; users are on low-end devices. A subtle scale-in of the check is enough.

### Ticket scanned (organizer view)
```
Full-screen green overlay, 2s auto-dismiss:
✓ Admit
Abebe Bekele · Early Bird · General
Scanned at 8:32 PM · Gate 1
(47 / 200 admitted)
```

### Payout processed (organizer)
- Email + in-app notification. Dashboard banner: "ETB 12,400 sent to your Telebirr. Arrives within 24h."

### Event published (admin → organizer)
- Organizer receives SMS: "Your event 'Jazz Night' is now live on AddisEvent. View sales: [link]."

---

## 6.5 Component-Level State Matrix

| Component | Default | Hover | Focus | Active/Pressed | Disabled | Loading |
|---|---|---|---|---|---|---|
| Primary button | accent fill, white text | darken 8% | focus ring | scale 0.98 | opacity 0.4, no pointer | spinner + "Processing..." |
| Input | 1px border | border-strong | 2px accent ring | — | bg surface-2, muted text | — |
| Event card | shadow-1 | lift + accent border | focus ring | scale 0.98 | — | skeleton |
| Tier card | 1px border | border-strong | focus ring | 2px accent border + soft bg | sold out: gray, strikethrough | — |
| Payment option | 1px border | border-strong | focus ring | accent border + soft bg | — | — |
| Bottom tab | muted icon+label | — | — | accent color + top indicator | — | — |
