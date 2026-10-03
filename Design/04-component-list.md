# 04 — Component List

**Version**: 1.0
**Note**: All components are responsive, bilingual-ready (Amharic + English), and built on the tokens in `05-design-tokens.md`.

---

## 4.1 Buttons

| Component | Spec | Usage |
|---|---|---|
| `btn-primary` | Fill: `--accent`; Text: #fff (≥18px bold); Radius: 12px; Height: 52px mobile / 48px desktop; Hover: darken 8%; Active: scale 0.98; Disabled: opacity 0.4 | Main action per screen (Pay, Get Tickets, Confirm) |
| `btn-secondary` | Fill: `--card`; Border: 1px `--border`; Text: `--text`; Radius: 12px; Height: 48px | Alternative actions (Share, Add to Calendar, Skip) |
| `btn-ghost` | Transparent; Text: `--muted`; No border | Tertiary (Cancel, Back, "Not now") |
| `btn-danger` | Fill: `--error`; Text: #fff | Cancel booking, refund (confirm modal only) |
| `btn-text-link` | Underline on hover; color `--accent` | Inline navigation ("See all", "View terms") |

**Rules**: One primary button per screen. Primary button text always includes the action + amount when money is involved ("Pay ETB 158"). Never use "Submit" or "OK" alone.

---

## 4.2 Inputs & Forms

| Component | Spec |
|---|---|
| `input-text` | Height 52px; Radius 12px; Border 1px `--border`; Focus: 2px `--accent` ring; Label above (never placeholder-only); Error: red border + message below |
| `input-phone` | Country code prefix (+251) locked; numeric keyboard; auto-format spacing |
| `input-select` | Custom dropdown; chevron right; options full-width sheet on mobile |
| `input-date` | Native date picker with Ethiopian calendar awareness (Gregorian default; Ethiopian calendar post-MVP) |
| `textarea` | Min-height 96px; character counter when limited |
| `checkbox` / `radio` | 24px; accent fill when checked; full row tappable (label wraps input) |
| `quantity-stepper` | [−] value [+] buttons; min 1, max tier capacity; disabled at bounds |

**Rules**: Every field has a visible label. Error messages appear below the field, in plain language ("Phone number looks short — check the digits").

---

## 4.3 Cards

| Component | Spec | Usage |
|---|---|---|
| `event-card` (grid) | Aspect 4:3 image; title (14px semibold); meta row (date, price); category dot; radius 12px; border 1px `--border`; hover: lift 2px + accent border | Homepage grids, search results |
| `event-card-featured` | Full-width 16:9 image; overlay gradient; title 20px; badge top-right; price bottom-left | Homepage featured slot |
| `tier-card` | Selectable; selected state: 2px accent border + soft accent bg; unselected: 1px border; radio dot right; urgency subtext ("32 left") | Event detail ticket selection |
| `payment-option-card` | Selectable; icon left; name + subtext; radio dot left; selected: accent border | Checkout method select |
| `organizer-card` | Avatar 40px; name + verified badge; mini stats row; tappable → organizer profile (post-MVP) | Event detail |
| `ticket-card` | Accent top border (3px); dashed perforation line; QR centered; monospace ID; status dot; radius 16px | Wallet, confirmation, ticket detail |
| `kpi-card` | Label (xs uppercase muted); value (28px bold); delta (xs +/-); icon tile top-left | Organizer dashboard |

---

## 4.4 Badges & Pills

| Component | Spec | Usage |
|---|---|---|
| `badge-verified` | Green check + "Verified"; 10px text; green soft bg | Organizer name |
| `badge-trending` | Accent2 fill; white text; uppercase 10px | Featured events |
| `badge-limited` | Amber soft bg; amber text; "X left" | Tier urgency |
| `badge-soldout` | Gray; strikethrough price; "Sold Out" | Unavailable tiers/events |
| `badge-status-paid` | Green dot + "Paid" | Ticket status |
| `badge-status-reserved` | Amber dot + "Reserved — pay at gate" | Pay-at-gate tickets |
| `pill-category` | Soft accent bg; accent text; 12px; radius 20px | Category labels, filters |
| `pill-recommended` | Accent2 soft bg; accent2 text; "Recommended" | Telebirr payment option |

---

## 4.5 Navigation & Structure

| Component | Spec |
|---|---|
| `bottom-tab-bar` | Height 64px; 4 tabs; icon 24px + label 10px; active: accent color + top indicator 2px; inactive: muted; safe-area inset for notched phones |
| `top-header` | Height 56px mobile / 64px desktop; sticky; logo left; language + avatar right; back button on sub-screens |
| `sticky-cta-bar` | Height 64px; bottom of screen (above tab bar on detail); full-width primary button; border-top hairline; content padding-bottom 80px to avoid occlusion |
| `step-indicator` | 3 dots connected by line; completed: accent fill; current: accent ring; upcoming: muted border; label below each | Checkout flow only |
| `section-header` | H2 (18px semibold) + optional "See all →" text link right | List sections |
| `accordion` | Chevron rotates 180° on open; smooth max-height transition | About event, FAQ |

---

## 4.6 Feedback & Overlays

| Component | Spec |
|---|---|
| `toast` | Fixed bottom (above tab bar); dark bg; white text; icon left; auto-dismiss 3s; max 2 lines | "Ticket saved", "Copied to clipboard" |
| `modal-sheet` (mobile) | Bottom sheet; rounded top 20px; drag handle; backdrop blur; swipe down to dismiss | Language select, filters, share |
| `modal-center` (desktop) | Centered; radius 16px; backdrop 60% opacity; close X top-right | Confirm cancel, refund |
| `skeleton-loader` | Pulse animation (opacity 0.4→0.8); matches content shape (card, text lines) | Event list, detail, dashboard |
| `spinner` | 24px accent ring; centered; only for short actions (<2s) | Buttons, small loads |
| `fullscreen-loading` | Branded; spinner + reassuring copy; no back navigation | Payment processing only |
| `result-overlay` | Full-screen color wash (green/red/amber); large icon; status text; auto-dismiss 2s (scanner) | QR validation result |

---

## 4.7 Data Display

| Component | Spec |
|---|---|
| `qr-display` | 180×180 min; high contrast (black on white); error-correction level M; surrounded by quiet zone 16px; selectable ID below in monospace | Ticket detail |
| `bar-chart-mini` | 7-day sales sparkline; accent fill; height 120px | Organizer dashboard |
| `table-attendees` | Columns: name, phone, tier, status, scan time; sortable; export CSV button | Organizer attendee list |
| `empty-state` | Illustration (SVG) + headline + subtext + primary CTA | All empty lists |

---

## 4.8 Misc

| Component | Spec |
|---|---|
| `language-toggle` | Pill with flag-free text "አማ / EN"; in header; also full modal on first open |
| `trust-line` | Lock icon + "Secure payment via [Processor]"; 11px muted; under pay button |
| `countdown-timer` | Monospace; "Ends in 2d 14h"; amber when <24h | Early bird tiers, featured events |
| `divider-perforation` | Dashed border 1px; used on ticket card to simulate stub tear |
