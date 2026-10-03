# 05 — Design Tokens

**Version**: 1.0
**Base unit**: 4px · **Naming**: CSS custom properties (`--token-name`)

---

## 5.1 Color Palette

### Brand Colors
| Token | Hex | Usage |
|---|---|---|
| `--brand-primary` | `#DC4A38` | Primary actions, CTAs, active nav, price emphasis. Warm, energetic, event-appropriate. |
| `--brand-primary-soft` | `rgba(220,74,56,0.12)` | Selected card backgrounds, icon tiles, hover states |
| `--brand-secondary` | `#2563AB` | Links, secondary accents, info states, "Verified" badge |
| `--brand-secondary-soft` | `rgba(37,99,171,0.12)` | Secondary icon tiles, info callouts |
| `--brand-warm` | `#C4693D` | Ethiopian-warm accent; used sparingly for cultural highlights, featured events |

### Neutral Scale
| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAF9F7` | Page background (warm off-white, easier on African sunlight) |
| `--surface` | `#FFFFFF` | Cards, sheets, inputs |
| `--surface-2` | `#F3F1ED` | Secondary surfaces, table headers, disabled fields |
| `--text-primary` | `#0F172A` | Headings, body text |
| `--text-secondary` | `#5B6472` | Secondary labels, meta info |
| `--text-muted` | `#8B93A1` | Placeholders, captions, disabled text |
| `--border` | `rgba(15,23,42,0.10)` | Card borders, dividers, input borders (default) |
| `--border-strong` | `rgba(15,23,42,0.20)` | Focused inputs, selected states |

### Semantic Colors
| Token | Hex | Usage |
|---|---|---|
| `--success` | `#16A34A` | Paid status, valid scan, confirmation, verified |
| `--success-soft` | `rgba(22,163,74,0.12)` | Success backgrounds, badges |
| `--warning` | `#D97706` | Reserved/unpaid, "limited spots", countdown <24h |
| `--warning-soft` | `rgba(217,119,6,0.12)` | Warning backgrounds |
| `--error` | `#DC2626` | Failed payment, invalid ticket, form errors |
| `--error-soft` | `rgba(220,38,38,0.10)` | Error backgrounds |
| `--info` | `#2563AB` | Info callouts, links (same as brand-secondary) |

### Dark Mode (Post-MVP, tokens reserved)
| Token | Hex |
|---|---|
| `--bg-dark` | `#141416` |
| `--surface-dark` | `#1E1E22` |
| `--text-dark-primary` | `#F4F4F5` |

---

## 5.2 Type Scale

**Font family**: Primary = `Sora` (headings + body, geometric, works for both Latin + Amharic fallback). Amharic fallback stack: `Noto Sans Ethiopic`, system default.

Load: `Sora:wght@400;500;600;700;800` + `Noto+Sans+Ethiopic:wght@400;500;600;700`

| Token | Size / Line-height / Weight | Usage |
|---|---|---|
| `--type-display` | 32px / 1.15 / 800 | Hero headline (homepage) |
| `--type-h1` | 24px / 1.25 / 700 | Event detail title, page titles |
| `--type-h2` | 18px / 1.35 / 600 | Section headers, card titles (featured) |
| `--type-h3` | 16px / 1.4 / 600 | Card titles, tier names, modal titles |
| `--type-body` | 14px / 1.6 / 400 | Body text, descriptions, form labels |
| `--type-body-bold` | 14px / 1.6 / 600 | Emphasized body, totals, names |
| `--type-caption` | 12px / 1.5 / 400 | Meta info, dates, prices in cards |
| `--type-overline` | 11px / 1.4 / 600, uppercase, letter-spacing 0.08em | Section eyebrows, badges, KPI labels |
| `--type-mono` | 13px / 1.4 / 500, `font-family: ui-monospace, monospace` | Ticket IDs, phone numbers, amounts |

**Rules**: Never go below 12px for any readable text. Amharic text renders ~15% larger visually; test wrapping. Numbers use `font-variant-numeric: tabular-nums` in tables and totals.

---

## 5.3 Spacing Scale (4px base)

| Token | Value | Usage |
|---|---|---|
| `--space-1` | 4px | Icon-to-text gap, tight inline |
| `--space-2` | 8px | Badge padding, chip gap |
| `--space-3` | 12px | Card internal padding (compact), grid gap |
| `--space-4` | 16px | Page margins (mobile), card padding, input padding |
| `--space-5` | 24px | Section gap, card padding (large), modal padding |
| `--space-6` | 32px | Major section spacing, hero padding |
| `--space-7` | 48px | Page top/bottom padding, large hero gap |
| `--space-8` | 64px | Desktop section spacing, empty-state vertical |

**Page margins**: Mobile = 16px (`--space-4`); Tablet = 24px; Desktop = 32px, content max-width 1200px centered.

---

## 5.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Badges, pills, small inputs, chips |
| `--radius-md` | 12px | Buttons, cards (grid), inputs, tier cards |
| `--radius-lg` | 16px | Featured cards, ticket cards, modals, sheets |
| `--radius-xl` | 20px | Bottom sheet top corners, hero cards |
| `--radius-full` | 999px | Avatars, floating buttons, tab indicators |

---

## 5.5 Elevation / Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(15,23,42,0.06)` | Cards (resting), inputs |
| `--shadow-2` | `0 4px 12px rgba(15,23,42,0.08)` | Hover lift, sticky CTA bar, dropdowns |
| `--shadow-3` | `0 12px 32px rgba(15,23,42,0.12)` | Modals, bottom sheets, featured cards |
| `--shadow-focus` | `0 0 0 3px rgba(220,74,56,0.25)` | Focus ring (inputs, buttons) |

---

## 5.6 Motion Tokens

| Token | Value | Usage |
|---|---|---|
| `--motion-fast` | 150ms ease-out | Hover, press, tab switch, toast |
| `--motion-base` | 250ms cubic-bezier(0.2,0.8,0.2,1) | Page transitions, modal open, accordion |
| `--motion-slow` | 400ms ease-out | Skeleton pulse, hero entrance |
| `--motion-skeleton` | pulse 1.4s ease-in-out infinite | Skeleton loaders |

**Rules**: Respect `prefers-reduced-motion` — disable all non-essential animation. No horizontal slide on page transitions (feels slow on low-end devices); use fade + slight vertical lift.

---

## 5.7 Iconography

- **Set**: Remix Icon (line style) — 24px default, 20px in dense areas, 16px in badges
- **Stroke**: 1.5px; color inherits from parent text color
- **Never**: Use emoji as icons. Never mix icon sets.
- **Custom icons needed**: Ticket stub, QR frame, Telebirr/CBE logo lockups (provided by payment processor), Ethiopian calendar glyph (post-MVP)

---

## 5.8 Breakpoints

| Token | Value |
|---|---|
| `--bp-sm` | 360px (small phones) |
| `--bp-md` | 768px (tablet / desktop nav switch) |
| `--bp-lg` | 1024px (desktop dashboard) |
| `--bp-xl` | 1280px (max content width 1200px) |
