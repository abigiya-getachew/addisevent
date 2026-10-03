# AddisEvent — Product Design Brief

**Version**: 1.0
**Date**: 2026-10-03
**Author**: Product Design
**Scope**: MVP — Addis Ababa Launch
**Status**: Ready for Engineering & Design Handoff

---

## About This Document Set

This design brief translates the AddisEvent PRD into actionable design specifications. It is split into focused files so each discipline (engineering, design, QA) can pull what it needs.

| File | Contents | Primary Audience |
|---|---|---|
| `01-user-flows.md` | Happy paths, edge flows, navigation map, decision points | PM, Design, Eng |
| `02-screen-inventory.md` | Full screen list, priority, dependencies, platform | Eng, QA, Design |
| `03-screen-layouts.md` | Wireframe layouts for every key screen | Design, Eng, QA |
| `04-component-list.md` | Reusable component library with specs | Eng, Design |
| `05-design-tokens.md` | Colors, type scale, spacing, radius, shadows, motion | Design, Eng (design system) |
| `06-ui-states.md` | Empty / loading / error / success states with copy | Design, Eng, QA |
| `07-accessibility.md` | A11y requirements, contrast, touch targets, low-data | Eng, QA, Design |

---

## Design Principles (Non-Negotiable)

1. **Trust by default** — Every screen surfaces verification (organizer badge, real ticket ID, transparent pricing). If a user can't tell it's real in 3 seconds, the design fails.
2. **Mobile-first, low-data tolerant** — Pages load fast on 3G; SMS is a first-class delivery channel, not a fallback.
3. **Bilingual from day one** — Amharic and English are equal citizens. No hardcoded strings; layout must expand for longer Amharic text.
4. **One primary action per screen** — The next step is always obvious. No competing CTAs.
5. **Payment is sacred** — The checkout flow has zero distractions, zero ambiguity, and an always-visible total.
6. **The ticket is the product** — The QR ticket screen is the most-touched screen after booking; it must be beautiful, scannable, and work offline.

---

## Platform Targets

- **Primary**: Mobile web (responsive, PWA-capable) — covers ~90% of expected users
- **Secondary**: Desktop web (organizer dashboard, admin CMS)
- **Deferred**: Native iOS/Android apps (post-MVP)

---

## Versioning

- `v1.0` — Initial design brief for MVP scope
- Changes tracked in this repo; bump minor version for token/component changes, major for flow changes
