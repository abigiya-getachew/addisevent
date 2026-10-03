# 03 — Screen Layouts (Wireframes)

**Version**: 1.0
**Note**: All wireframes shown at mobile width (360px). Desktop expands to 12-column grid; content max-width 1200px.

---

## A-01 Homepage / Discovery

```
┌──────────────────────────────────────┐
│ Logo                [Amh ▾]  [Login] │  Header (sticky)
├──────────────────────────────────────┤
│  Find your next                      │  Hero headline (H1)
│  unforgettable night.                │
│  Concerts · Festivals · Workshops    │  Subhead
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ 🔍  Search events, venues...     │ │  Search bar (full width, tappable)
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ [🎵 Music][🎪 Festival][📚 Workshop] │  Category chips (horizontal scroll)
│ [🤝 Community]          [View all →] │
├──────────────────────────────────────┤
│ ★ Featured This Week                 │  Section label
│ ┌──────────────────────────────────┐ │
│ │                                  │ │  Featured card — full-width image
│ │       IMAGE / VIDEO              │ │  overlay: title, date, price, badge
│ │                                  │ │
│ │  JAZZ NIGHT AT HIBRET STUDIO     │ │
│ │  Fri Oct 18 · 8:00PM · Kazanchis │ │
│ │  From ETB 200     [Trending]     │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ This Weekend                         │  Section label
│ ┌──────────────┐ ┌──────────────┐   │  2-col card grid
│ │   IMG        │ │   IMG        │ │  Each: image, title, date, price,
│ │  Event Name  │ │  Event Name  │ │  category dot, "few left" badge
│ │  Sat · 6PM   │ │  Sun · 4PM   │ │
│ │  ETB 150     │ │  ETB 300     │ │
│ └──────────────┘ └──────────────┘   │
│ [See all events →]                   │  Text link
├──────────────────────────────────────┤
│ For Organizers? Sell tickets here →  │  Banner (accent2 tint)
├──────────────────────────────────────┤
│ [Home] [Search] [Tickets] [Profile]  │  Bottom tab bar (sticky)
└──────────────────────────────────────┘
```

**Layout specs**: Hero padding 32px 16px; card grid gap 12px; section spacing 32px; featured card aspect 16:9.

---

## A-03 Event Detail

```
┌──────────────────────────────────────┐
│ ← Back                          ⤴ Share│ Top bar
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │                                  │ │  Hero gallery (16:9), swipeable
│ │         HERO IMAGE               │ │  dot indicators; badge top-right
│ │                         [Limited]│ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ JAZZ NIGHT AT HIBRET STUDIO          │  H1 (24px, bold)
│ 📅 Fri, Oct 18 · 8:00 PM – 1:00 AM   │  Meta row (icon + text)
│ 📍 Hibret Studio, Kazanchis  [Map →] │
│ 🎵 Live Music                        │  Category pill
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │  Organizer card
│ │ ○  Hibret Collective    ✔ Verified│ │  Avatar + name + verified badge
│ │    12 past events · 4.8★ (if rev) │ │  Mini stats (reviews deferred → hide)
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Select Tickets                       │  Section H2
│ ┌──────────────────────────────────┐ │  Tier card — SELECTED (accent border)
│ │ Early Bird                 150 ● │ │  Name left, price right, radio dot
│ │ 32 left · Sales end Oct 10        │ │  Urgency subtext
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │  Tier card — unselected
│ │ Regular                    250 ○ │ │
│ │ Standard entry                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ VIP                        500 ○ │ │
│ │ Front row + free drink           │ │
│ └──────────────────────────────────┘ │
│  Qty: [−] 1 [+]                      │  Quantity stepper
├──────────────────────────────────────┤
│ About this event                     │  Collapsible section
│ Full description text...             │
│ [Photo gallery thumbnails]           │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │  Sticky bottom CTA bar
│ │  Get Tickets · ETB 150    [→]    │ │  Accent fill, white text, price shown
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Layout specs**: Sticky CTA bar height 64px; content bottom padding 80px (so nothing hides behind CTA); tier cards 16px radius.

---

## A-04 / A-05 Checkout (Review + Payment)

```
┌──────────────────────────────────────┐
│ ← Review   ●───○───○   Pay  Done     │  Step indicator (3 steps)
├──────────────────────────────────────┤
│ Order Summary                        │
│ ┌──────────────────────────────────┐ │
│ │ Jazz Night at Hibret Studio      │ │  Event name
│ │ Early Bird × 1                   │ │  Tier + qty
│ │ Fri Oct 18 · 8:00PM              │ │  Date/time
│ │ ─────────────────────────────    │ │
│ │ Subtotal                  ETB 150│ │  Line item
│ │ Service fee                ETB 7.5│ │  Fee (transparent, pre-agreed)
│ │ ─────────────────────────────    │ │
│ │ Total                    ETB 158 │ │  Bold, accent color
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Payment Method                       │  Section H2
│ ┌──────────────────────────────────┐ │  SELECTED — accent border
│ │ ◉  Telebirr                      │ │  Logo/icon + name + "Recommended" tag
│ │    Pay with your Telebirr account│ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ ○  CBE Birr                      │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ ○  Debit/Credit Card             │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │ ○  Pay at Gate (reserve)         │ │  Muted border, note: cash on arrival
│ │    Hold your spot, pay cash      │ │
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Phone number (for ticket)            │  Form field + country code +251
│ [ +251 9__ ___ ____ ]                │
├──────────────────────────────────────┤
│ 🔒 Secure payment via [Processor]    │  Trust line (small, muted)
│ ┌──────────────────────────────────┐ │
│ │  Pay ETB 158 via Telebirr   [→]  │ │  Primary CTA — full width
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

**Layout specs**: Step indicator always visible; total visible at all times (sticky if page scrolls); no upsells, no ads, no distractions.

---

## A-07 Confirmation / Success

```
┌──────────────────────────────────────┐
│                                      │
│           ✓ (green check circle)     │  Success icon — 64px
│                                      │
│   You're going!                      │  H1 — celebratory but calm
│   Your ticket is ready.              │
│                                      │
│   Ticket sent to +251 9XX XXX XXXX   │  Muted confirmation
│                                      │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │  Mini ticket preview
│ │  JAZZ NIGHT · Oct 18 · 8:00PM    │ │
│ │  ┌──────────┐                    │ │
│ │  │    QR    │  #TKT-AB2-7X9Z     │ │  QR + ticket ID
│ │  └──────────┘                    │ │
│ │  [ View full ticket → ]          │ │  Link to A-09
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ [Add to Calendar]  [Share]           │  Secondary actions (2-col)
│ [Save to Wallet]                     │
├──────────────────────────────────────┤
│ ← Browse more events                 │  Text link (secondary, not a button)
└──────────────────────────────────────┘
```

---

## A-09 Ticket Detail (QR View — Full Screen)

```
┌──────────────────────────────────────┐
│ Your Ticket                          │  Header
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │  Ticket card — accent top border
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  Perforation effect (dashed line)
│ │  JAZZ NIGHT AT HIBRET STUDIO     │ │
│ │  Fri Oct 18 · 8:00 PM            │ │
│ │  Hibret Studio, Kazanchis        │ │
│ │  Early Bird · 1 entry            │ │
│ │                                  │ │
│ │      ┌──────────────────┐        │ │
│ │      │                  │        │ │  QR code — 180×180, high contrast
│ │      │       QR         │        │ │  Screen brightness auto-boosts
│ │      │                  │        │ │
│ │      └──────────────────┘        │ │
│ │                                  │ │
│ │  Ticket ID: TKT-AB2-7X9Z         │ │  Monospace, selectable
│ │  Status: ● Paid & Valid          │ │  Green dot + text
│ │  ──────────────────────────────  │ │
│ │  Hibret Collective  ✔ Verified   │ │  Organizer footer
│ └──────────────────────────────────┘ │
├──────────────────────────────────────┤
│ Show this at the entrance.           │  Instruction (muted, centered)
│ Screenshot saved — works offline.    │  Reassurance
├──────────────────────────────────────┤
│ [Add to Calendar]  [Share Ticket]    │  Actions
└──────────────────────────────────────┘
```

**Critical**: This screen must render instantly from cache. No loading spinner. Brightness increases to max on focus (where supported).

---

## O-01 Organizer Dashboard (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│ Logo · Organizer Console              [Event: ▾] [Avatar]│  Header
├──────────┬──────────────────────────────────────────────┤
│ Dashboard│  Welcome back, Hibret Collective              │
│ Events   │                                              │
│ Sales    │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │  KPI cards
│ Payouts  │  │ Tickets │ │ Revenue │ │ Capacity│         │
│ Scanner  │  │   142   │ │ ETB 28k │ │  71%    │         │
│          │  └─────────┘ └─────────┘ └─────────┘         │
│          │                                              │
│          │  Your Events                                 │
│          │  ┌────────────────────────────────────────┐  │  Event rows
│          │  │ Jazz Night     Oct 18   142/200  ETB 28k│  │  name, date,
│          │  │ [View] [Scanner] [Export]               │  │  sold/cap, revenue
│          │  ├────────────────────────────────────────┤  │
│          │  │ Workshop #3    Nov 2    18/50   ETB 1.8k│  │
│          │  │ [View] [Scanner] [Export]               │  │
│          │  └────────────────────────────────────────┘  │
│          │                                              │
│          │  Next payout: ETB 12,400 · Oct 20            │  Payout banner
└──────────┴──────────────────────────────────────────────┘
```

---

## O-04 QR Scanner (Mobile, Event Day)

```
┌──────────────────────────────────────┐
│ Scanner — Jazz Night                 │  Header + event name
├──────────────────────────────────────┤
│                                      │
│      ┌────────────────────┐          │
│      │                    │          │  Camera viewfinder (full area)
│      │                    │          │  Corner brackets guide
│      │   [camera feed]    │          │
│      │                    │          │
│      │                    │          │
│      └────────────────────┘          │
│                                      │
│   Point camera at attendee's QR      │  Instruction
│                                      │
│   Admitted: 47 / 200                 │  Live counter (small, muted)
├──────────────────────────────────────┤
│ [ Enter code manually ]              │  Fallback (if camera fails)
└──────────────────────────────────────┘

Validation result overlays (full-screen modal, auto-dismiss 2s):
  ✅ VALID    → Green background, "Admit — Seat: General", name + tier
  ❌ USED     → Red background, "Already scanned at 8:14 PM"
  ❌ INVALID  → Red background, "Ticket not found — check with supervisor"
  ⚠ UNPAID   → Amber, "Reserved — collect ETB 150 then mark paid"
```

---

## D-01 / D-02 Admin Event Creator (Desktop)

```
┌─────────────────────────────────────────────────────────┐
│ Admin · New Event                          [Save Draft] [Publish]│
├─────────────────────────────────────────────────────────┤
│ Basic Info                  │  Ticket Tiers              │
│ Event title*        [______] │  [+ Add tier]              │
│ Category*           [▾]     │  ┌──────────────────────┐  │
│ Date / Time*        [picker]│  │ Early Bird  [150] [50]│  │ name/price/qty
│ Venue*              [______]│  │ Sales end [date]      │  │
│ Neighbourhood       [▾]     │  ├──────────────────────┤  │
│ Description         [textarea]│ Regular   [250] [150]│  │
│ Gallery             [upload]│  └──────────────────────┘  │
│ ─────────────────────────   │  Total capacity: 200       │
│ [Import from Facebook →]    │  Payment split: 92% org / 8% platform│
├─────────────────────────────┴────────────────────────────┤
│ Organizer: Hibret Collective ✔ Verified  │  Payout acct: Telebirr │
└─────────────────────────────────────────────────────────┘
```

---

## G-01 Language Selector (First-Open Modal)

```
┌──────────────────────────────────────┐
│  እንኳን ደህና መጡ / Welcome               │
│                                      │
│  Choose your language                │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🇪🇹  አማርኛ (Amharic)            │  │  Full-width option cards
│  └────────────────────────────────┘  │
│  ┌────────────────────────────────┐  │
│  │  English                        │  │
│  └────────────────────────────────┘  │
│                                      │
│  Continue →                          │  Primary CTA
└──────────────────────────────────────┘
```

**Rule**: Default selection auto-detected from device locale; Ethiopian phone numbers default to Amharic.
