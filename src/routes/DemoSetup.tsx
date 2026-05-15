import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CloudLightning,
  HeartPulse,
  Hospital,
  Layers,
  ListChecks,
  Play,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────────────
const SCENARIOS = [
  { id: "default",            label: "Steady state",        sub: "Baseline ops · no surge",        active: false, icon: Activity,        to: "/" },
  { id: "caribbean-storm",    label: "Caribbean storm",     sub: "Surge protocol, 159 in zone",    active: true,  icon: CloudLightning,  to: "/risk" },
  { id: "mexico-hospital",    label: "Mexico hospital",     sub: "Marisol R. critical case",       active: true,  icon: HeartPulse,      to: "/cases" },
  { id: "inflated-invoice",   label: "Inflated invoice",    sub: "Cost containment moment",        active: true,  icon: Receipt,         to: "/cost-containment" },
  { id: "baggage-auto-approve", label: "Baggage auto-approve", sub: "Lina B. live adjudication",    active: false, icon: Wallet,          to: "/claims" },
]

const SEED = [
  { label: "Traveler profiles",        story: "5,000", rendered: 80,  domain: "travelers.ts" },
  { label: "Claims",                    story: "1,000", rendered: 60,  domain: "claims.ts" },
  { label: "Active assistance cases",  story: "300",   rendered: 100, domain: "cases.ts" },
  { label: "Medical emergencies",       story: "75",    rendered: 15,  domain: "medical.ts" },
  { label: "Providers",                 story: "500",   rendered: 60,  domain: "providers.ts" },
  { label: "Partner programs",          story: "20",    rendered: 6,   domain: "partners.ts" },
  { label: "Documents",                 story: "—",     rendered: 40,  domain: "documents.ts" },
  { label: "Communication threads",     story: "—",     rendered: 25,  domain: "messages.ts" },
]

const SCRIPT = [
  { tag: "1",  step: "Command Center",        beat: "312 cases · urgent queue · AI co-pilot",          time: "1:30",  cleared: true,  to: "/" },
  { tag: "2",  step: "AI Triage",             beat: "Marisol's WhatsApp · live reasoning trail",       time: "2:00",  cleared: true,  to: "/triage" },
  { tag: "3",  step: "Medical Cases",         beat: "Open CASE-8821 · timeline · next action",         time: "1:45",  cleared: false, to: "/cases" },
  { tag: "4",  step: "Cost Containment",      beat: "INV-4471 · 5 flagged lines · save $7.4k",         time: "1:30",  cleared: false, to: "/cost-containment" },
  { tag: "5",  step: "Claims · live",         beat: "Lina B. baggage · rules engine animation",       time: "1:15",  cleared: false, to: "/claims" },
  { tag: "6",  step: "Risk & Surge",          beat: "Storm Esmeralda · radar · forecast · actions",    time: "2:00",  cleared: false, to: "/risk" },
  { tag: "7",  step: "Inbox · omnichannel",   beat: "Marisol unified thread · 4 channels",             time: "1:00",  cleared: false, to: "/inbox" },
  { tag: "8",  step: "Providers",             beat: "Top 3 recommendation cards",                       time: "0:45",  cleared: false, to: "/providers" },
  { tag: "9",  step: "Traveler Portal",       beat: "Two phones · case + new claim",                    time: "0:45",  cleared: false, to: "/traveler-portal" },
  { tag: "10", step: "Partners",              beat: "Allianz dashboard · monthly chart",                time: "1:00",  cleared: false, to: "/partners" },
  { tag: "11", step: "Executive BI",          beat: "Weekly AI brief · export",                          time: "0:45",  cleared: false, to: "/executive" },
  { tag: "12", step: "Audit & Access",        beat: "CASE-8821 audit trail · SOC 2 posture",            time: "0:45",  cleared: false, to: "/audit" },
]

const CHECKS = [
  { label: "Live SLA countdowns ticking",                done: true },
  { label: "AI reasoning trails auto-play on Triage / Claims", done: true },
  { label: "Storm radar pulse + sweep animating",         done: true },
  { label: "World clocks ticking in topbar",              done: true },
  { label: "All 14 routes resolve · no console errors",    done: true },
  { label: "Browser zoom at 100% · 1920×1080 ideal",      done: false, note: "Operator check before demo" },
]

// ── Page ───────────────────────────────────────────────────────────────
export function DemoSetup() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <Scenarios />
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Script />
        <aside className="space-y-5">
          <SeedData />
          <PreflightChecks />
        </aside>
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Internal · Demo Setup</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">Presenter controls · not visible to prospects</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Run the demo,</span>
            <br />
            <span className="text-foreground/80">end to end, in 14 minutes.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Pick scenarios to pre-seed, walk the script in order, and check the preflight items before going live.
            The demo is fully deterministic — same flow every run, same numbers, same beats.
          </p>
        </div>

        <div className="rise grid grid-cols-2 gap-px self-end rounded-md border border-border bg-border-soft" style={{ animationDelay: "120ms" }}>
          {[
            { label: "Total runtime",      value: "≈ 14 min", tone: "text-foreground" },
            { label: "Active scenarios",   value: "3",         tone: "text-accent" },
            { label: "Screens to walk",   value: "12",        tone: "text-foreground" },
            { label: "Preflight ready",   value: "5 / 6",     tone: "text-[hsl(var(--severity-medium))]" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[hsl(var(--background-elevated))] px-4 py-3">
              <span className="label-cap">{kpi.label}</span>
              <div className={cn("mt-1 num text-[22px] font-medium leading-none", kpi.tone)}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Scenarios ─────────────────────────────────────────────────────────
function Scenarios() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary" />
            Demo scenarios
          </CardTitle>
          <CardDescription>Toggle scenarios to pre-seed the right alerts and queues</CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1.5">
          <Settings className="h-3 w-3" /> Reset all
        </Button>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            className={cn(
              "relative flex flex-col gap-2 rounded-md border px-3 py-3",
              s.active
                ? "border-primary/40 bg-[hsl(var(--card-elevated))] glow-primary"
                : "border-border-soft bg-card/40"
            )}
          >
            <div className="flex items-center gap-2">
              <s.icon className={cn("h-3.5 w-3.5", s.active ? "text-primary" : "text-muted-foreground")} />
              <span className="text-[12.5px] font-medium text-foreground">{s.label}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            <Button size="sm" variant={s.active ? "secondary" : "ghost"} className="h-6 px-2 text-[10.5px]" asChild>
              <Link to={s.to}>{s.active ? "Active · open" : "Preview"}</Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── Script ────────────────────────────────────────────────────────────
function Script() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-3.5 w-3.5 text-accent" />
            Demo script · in order
          </CardTitle>
          <CardDescription>14 minutes · 12 stops · ranked by narrative impact</CardDescription>
        </div>
        <Button size="sm" variant="accent" className="gap-1.5">
          <Play className="h-3 w-3" /> Rehearse mode
        </Button>
      </CardHeader>
      <ul>
        {SCRIPT.map((s, i) => (
          <li key={s.tag} className="rise border-b border-border-soft/40 last:border-0" style={{ animationDelay: `${200 + i * 35}ms` }}>
            <Link
              to={s.to}
              className="group grid grid-cols-[42px_1fr_70px_88px_24px] items-center gap-3 px-5 py-2.5 transition-colors hover:bg-secondary/30"
            >
              <span className={cn(
                "num text-center text-[11px] font-medium",
                s.cleared ? "text-[hsl(var(--severity-low))]" : "text-muted-foreground"
              )}>
                {s.tag}
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-foreground">{s.step}</p>
                <p className="truncate text-[11px] text-muted-foreground">{s.beat}</p>
              </div>
              <span className="num text-right text-[11px] text-muted-foreground">{s.time}</span>
              {s.cleared ? (
                <Badge variant="low" className="justify-self-end">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Rehearsed
                </Badge>
              ) : (
                <Badge variant="outline" className="justify-self-end">Pending</Badge>
              )}
              <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ── Seed Data ─────────────────────────────────────────────────────────
function SeedData() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="h-3.5 w-3.5 text-primary" />
          Seeded data
        </CardTitle>
        <CardDescription>Story scale shown in UI · render scale actually present</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {SEED.map((s) => (
          <div key={s.label} className="flex items-center justify-between rounded-md border border-border-soft bg-card/40 px-3 py-2">
            <div className="min-w-0">
              <p className="text-[12px] text-foreground">{s.label}</p>
              <p className="num text-[10px] text-muted-foreground">{s.domain}</p>
            </div>
            <div className="text-right">
              <span className="num text-[12px] font-medium text-foreground">{s.rendered}</span>
              <span className="num ml-1 text-[10px] text-muted-foreground">/ {s.story}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// ── Preflight ─────────────────────────────────────────────────────────
function PreflightChecks() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--severity-medium))]" />
          Preflight · before going live
        </CardTitle>
        <CardDescription>5 of 6 cleared</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {CHECKS.map((c) => (
          <div
            key={c.label}
            className={cn(
              "flex items-start gap-2 rounded-md border px-3 py-2",
              c.done
                ? "border-[hsl(var(--severity-low)/0.25)] bg-[hsl(var(--severity-low)/0.06)]"
                : "border-border-soft bg-card/40"
            )}
          >
            {c.done ? (
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-[hsl(var(--severity-low))]" />
            ) : (
              <span className="mt-0.5 h-3 w-3 shrink-0 rounded-full border border-muted-foreground/40" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] text-foreground">{c.label}</p>
              {c.note ? <p className="text-[10.5px] text-muted-foreground">{c.note}</p> : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
