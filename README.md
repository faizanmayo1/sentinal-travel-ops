# Sentinel Travel Ops — Presales Demo

Single-page web app simulating an AI-powered travel assistance & claims intelligence platform.
Built for a Tuesday 2026-05-19 prospect call. React 19 + Vite 8 + TS + Tailwind + shadcn/ui + Recharts.

## Run

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # production bundle
npm run preview  # serve /dist locally
```

Open `http://localhost:5173` and walk the script below. No backend, no real AI — every "AI" response is pre-scripted off the seed data.

## Demo script · 14 minutes · 12 stops

| # | Route                | Beat                                                              | ~Time |
|---|----------------------|-------------------------------------------------------------------|-------|
| 1 | `/`                  | Command Center · 312 cases worldwide · urgent queue · AI co-pilot | 1:30  |
| 2 | `/triage`            | Marisol's WhatsApp · animated reasoning trail                     | 2:00  |
| 3 | `/cases`             | CASE-8821 detail · timeline · GoP next action                     | 1:45  |
| 4 | `/cost-containment`  | INV-4471 · 5 flagged lines · save $7.4k                            | 1:30  |
| 5 | `/claims`            | Lina B. baggage $420 · rules engine animation · auto-approved      | 1:15  |
| 6 | `/risk`              | Storm Esmeralda · radar · 24h forecast · surge protocol            | 2:00  |
| 7 | `/inbox`             | Marisol unified thread · WhatsApp + voice + portal + email         | 1:00  |
| 8 | `/providers`         | Top 3 ranked recommendation cards for Mexico City                  | 0:45  |
| 9 | `/traveler-portal`   | Two phone mockups · active case + guided new claim                | 0:45  |
| 10| `/partners`          | Allianz program dashboard · monthly chart · highlights             | 1:00  |
| 11| `/executive`         | Weekly AI brief · wins / watch / bottlenecks                       | 0:45  |
| 12| `/audit`             | CASE-8821 audit trail · SOC 2 + ISO + GDPR posture                | 0:45  |

`/admin/data` is the **presenter control room** — every script row is clickable to jump to that stop.

## Animations that auto-play on page load
- `/triage` · 6-step AI reasoning trail (Marisol's case)
- `/claims` · 6-step rules engine on baggage claim (transitions header to "Approved")

Both refresh themselves when you re-navigate to the route, so re-entering each page replays the demo moment.

## Architecture notes
- All routes in `src/routes/*.tsx`; AppShell in `src/components/layout/AppShell.tsx`
- shadcn primitives in `src/components/ui/*`
- Domain widgets in `src/components/widgets/*` (Sparkline, UrgencyMeter, ChannelChip, RegionLoad)
- All mock data co-located inside each route file for easy presenter edits
- Design tokens (deep-ink + petrol/copper + signal-tower severity) in `src/index.css`
- Typography: Instrument Serif (display italic) + Geist (body) + Geist Mono (numerics)

## Pre-flight checklist
- [x] `npm run build` clean
- [x] All 14 routes resolve
- [x] World clock ticks in topbar (NYC / LDN / DXB / HKG)
- [x] Live SLA / sentiment beacons pulsing
- [x] Storm radar sweep animates
- [ ] Browser zoom at 100%, 1920×1080 ideal (operator check before demo)
- [ ] Tab open in full-screen, dev tools closed
