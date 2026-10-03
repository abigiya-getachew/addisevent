# 07 — Accessibility & Inclusivity Notes

**Version**: 1.0
**Standard target**: WCAG 2.1 AA. Plus local-market constraints (low-data, low-end devices, bilingual, varying literacy).

---

## 7.1 Color & Contrast

- **Body text**: Minimum 4.5:1 contrast against background. `--text-primary` on `--bg` = 15.8:1 (passes). `--text-muted` on `--bg` = 3.5:1 — **only for non-essential captions**, never for actionable or critical info.
- **Large text** (≥18px bold or ≥24px): Minimum 3:1. Primary button text (white on `#DC4A38`) = 4.1:1 — passes large-text; button label is ≥18px bold by spec.
- **Never rely on color alone**: Status (paid/reserved/error) always pairs color with an icon + text label. A red-green colorblind user must distinguish "Valid" from "Invalid."
- **Focus indicators**: Visible 3px accent ring (`--shadow-focus`) on all interactive elements. Never `outline: none` without a replacement.
- **QR code**: Pure black on pure white (infinite contrast), minimum 180×180px, 16px quiet zone. Never place QR on colored background.

---

## 7.2 Touch & Motor

- **Minimum touch target**: 44×44px (iOS standard) — our buttons are 48–52px, exceeding this. Icon-only buttons (back, share, close) get 44×44px hit area even if visual is smaller.
- **Spacing between targets**: ≥8px between adjacent touch targets to prevent mis-taps.
- **Bottom tab bar**: Height 64px + safe-area inset; targets 25% width each; no overlap with sticky CTA (CTA sits above tab bar on detail pages).
- **No hover-only actions**: Everything reachable on hover on desktop must have a tap equivalent on mobile.
- **Error recovery**: All destructive actions (cancel booking) require confirmation modal; undo option where feasible (e.g., "Reservation cancelled — undo" toast for 5s).

---

## 7.3 Screen Reader & Semantics

- **Landmarks**: `<header>`, `<nav>`, `<main>`, `<footer>` used correctly. Skip-to-content link on desktop.
- **Form labels**: Every input has a programmatically associated `<label>` (not just placeholder). Error messages linked via `aria-describedby`.
- **Live regions**: Payment status updates, toasts, and scanner results use `aria-live="polite"` (or assertive for error) so screen reader users get feedback.
- **Ticket QR**: Has `aria-label` describing it ("QR code for ticket TKT-AB2-7X9Z, valid for one entry to Jazz Night") + the ticket ID is also visible as selectable text (manual entry fallback).
- **Language**: `<html lang>` attribute flips between `am` and `en` on language toggle. Mixed content sections get their own `lang` attribute.
- **Heading hierarchy**: One `<h1>` per screen; never skip levels. Section labels use `<h2>`.

---

## 7.4 Typography & Reading

- **Minimum font size**: 12px (captions only). Body 14px. Headings scale up.
- **Dynamic type**: Respect system font-size settings (use `rem`-based scale, not fixed `px` for text). Test at 125% and 150% zoom — no broken layouts.
- **Amharic typography**: `Noto Sans Ethiopic` loaded with weights 400–700. Amharic text is visually denser; allow +15% line-height and test wrapping. No justified text (creates uneven spacing in Ethiopic script).
- **Plain language**: Copy at ~grade-6 reading level. Avoid jargon ("gateway timeout" → "Network is slow. Try again."). Both languages reviewed by native speakers.
- **Line length**: Body text max-width 65 characters (≈ 640px) on desktop for comfortable reading.

---

## 7.5 Low-Data & Low-End Device Constraints (Market-Specific)

- **Image optimization**: All images served as WebP/AVIF, max 80KB per card image, `loading="lazy"`. Hero image capped at 200KB. Offer "Data Saver" mode (toggle in settings) that loads text-only.
- **Critical path works offline**: Ticket QR cached on device and fully viewable without internet. My Tickets list cached.
- **SMS as first-class channel**: Ticket delivery, payment confirmation, reminders, and event updates all work via SMS for users who close the app or have no data. SMS includes a short link and the ticket ID (for manual lookup).
- **Performance budget**: First contentful paint < 2.5s on 3G. No heavy JS frameworks; vanilla + progressive enhancement. Bundle < 150KB gzipped.
- **Battery**: No continuous background polling. Payment status polls only during the 60s processing window. Scanner camera active only when scanner screen is open.

---

## 7.6 Motion & Cognitive

- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables all transitions, skeleton pulse, and animations. Spinners replaced by static "Loading..." text.
- **No auto-playing video/sound** on homepage. If video is used, it's muted + click-to-play.
- **Consistent patterns**: Primary button always accent fill; back button always top-left; bottom tab order never changes. Predictability reduces cognitive load.
- **Error messages are helpful**: State what went wrong + what to do next. Never "Error 500" or "Invalid request."
- **Timeouts are generous**: Payment processing waits 60s before declaring failure. Sessions don't expire mid-checkout (24h grace for pending bookings).

---

## 7.7 Inclusivity & Local Context

- **Names**: Support full Ethiopian naming (first + father + grandfather). No "first name / last name" split that forces wrong formatting — use one "Full name" field.
- **Phone numbers**: +251 prefix locked; accept both 9 and 10 digit local formats. SMS delivery tested on Ethio Telecom + Safaricom.
- **Payment inclusivity**: Pay-at-gate option ensures unbanked users (no Telebirr/CBE, no card) can still reserve and attend. This is a core accessibility feature, not a convenience.
- **Illiteracy / low digital literacy**: Visual-first design — event cards dominated by images; icons reinforce every key action; confirmation screens show the actual ticket (visual) not just text. Onboarding uses 3 illustrated slides (skip allowed).
- **Religious/cultural calendar**: Date picker shows Gregorian; Ethiopian calendar equivalent displayed alongside (post-MVP). Event times clearly note if they break during religious holidays (organizer-provided).
- **Gender & identity**: No mandatory gender field. If collected (optional), include "Prefer not to say."

---

## 7.8 Accessibility QA Checklist (Pre-Launch)

- [ ] All text passes contrast (automated scan + spot check)
- [ ] Full booking flow completed with keyboard only (tab/enter)
- [ ] Screen reader (TalkBack on Android) announces ticket status and payment result
- [ ] Zoom to 150% — no horizontal scroll, no hidden content
- [ ] Data Saver mode loads homepage in < 500KB
- [ ] Ticket viewable in airplane mode
- [ ] Amharic UI fully translated, no truncation, no English fallback strings
- [ ] Reduced-motion preference respected throughout
- [ ] Form errors announced and focusable
- [ ] QR scannable from screen brightness 50% on low-end Android
