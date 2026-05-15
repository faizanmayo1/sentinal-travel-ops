import {
  Award,
  Building2,
  ChevronRight,
  Globe2,
  HeartPulse,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
  Wallet,
} from "lucide-react"
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
const KPIS = [
  { label: "Provider network",   value: "512", delta: "10 countries · 8 tier-1 markets",      tone: "text-foreground" },
  { label: "Preferred providers", value: "184", delta: "GoP accepted · billing < 7 days",     tone: "text-[hsl(var(--severity-low))]" },
  { label: "Avg cost vs benchmark", value: "‑14%", delta: "Across preferred network",          tone: "text-[hsl(var(--severity-low))]" },
  { label: "Pending outreach",   value: "9",   delta: "Avg response time 18 min",              tone: "text-foreground" },
] as const

interface Recommendation {
  name: string
  city: string
  country: string
  score: number
  specialties: string[]
  prior: { settlements: number; variance: string; lastUsed: string }
  payment: string
  reason: string
}

const RECS: Recommendation[] = [
  {
    name: "Hospital Ángeles Pedregal",
    city: "Mexico City",
    country: "MX",
    score: 96,
    specialties: ["Gastroenterology", "ER", "ICU"],
    prior: { settlements: 3, variance: "‑18% vs benchmark", lastUsed: "Apr 2026" },
    payment: "GoP accepted · electronic billing · 4-day settle",
    reason: "Closest tier-1 with gastro on-call. Prior settlements clean. English-speaking attending available.",
  },
  {
    name: "Hospital Médica Sur",
    city: "Mexico City",
    country: "MX",
    score: 89,
    specialties: ["ICU", "Gastroenterology", "Imaging"],
    prior: { settlements: 5, variance: "‑11% vs benchmark", lastUsed: "Mar 2026" },
    payment: "GoP accepted · 6-day settle",
    reason: "Higher complexity capability. Slightly further (12km). Strong imaging suite.",
  },
  {
    name: "ABC Medical Center",
    city: "Mexico City",
    country: "MX",
    score: 78,
    specialties: ["ER", "Cardiology"],
    prior: { settlements: 2, variance: "+4% vs benchmark", lastUsed: "Jan 2026" },
    payment: "GoP accepted · paper billing · 9-day settle",
    reason: "Reputable but gastro coverage limited overnight. Higher billing variance.",
  },
]

interface Provider {
  name: string
  city: string
  country: string
  flag: string
  type: string
  specialties: string[]
  cost: number      // 1–5
  service: number   // 1–5
  status: "preferred" | "active" | "watch" | "review"
  lastEngaged: string
  settlements: number
}

const DIRECTORY: Provider[] = [
  { name: "Hospital Ángeles Pedregal",     city: "Mexico City", country: "MX", flag: "🇲🇽", type: "Tier-1 private",  specialties: ["Gastro", "ICU", "ER"],     cost: 5, service: 5, status: "preferred", lastEngaged: "Today",       settlements: 3 },
  { name: "Bumrungrad International",       city: "Bangkok",     country: "TH", flag: "🇹🇭", type: "Tier-1 intl",     specialties: ["Trauma", "Cardiac", "Onc"], cost: 4, service: 5, status: "preferred", lastEngaged: "Today",       settlements: 12 },
  { name: "Mt. Elizabeth Novena",            city: "Singapore",   country: "SG", flag: "🇸🇬", type: "Tier-1 intl",     specialties: ["Neuro", "Cardiac"],         cost: 3, service: 5, status: "preferred", lastEngaged: "Yesterday",   settlements: 18 },
  { name: "Policlinico Gemelli",            city: "Rome",        country: "IT", flag: "🇮🇹", type: "Academic",        specialties: ["Cardio", "ICU"],            cost: 4, service: 4, status: "preferred", lastEngaged: "Today",       settlements: 8 },
  { name: "Clínica Pardo",                  city: "Cusco",       country: "PE", flag: "🇵🇪", type: "Regional",        specialties: ["Pulmonary"],                cost: 4, service: 4, status: "active",    lastEngaged: "Today",       settlements: 1 },
  { name: "Landspítali Háskólasjúkrahús",  city: "Reykjavík",   country: "IS", flag: "🇮🇸", type: "Public · tier-1", specialties: ["Ortho", "Trauma"],          cost: 5, service: 4, status: "active",    lastEngaged: "2 days ago",  settlements: 1 },
  { name: "CHU Lyon",                       city: "Lyon",        country: "FR", flag: "🇫🇷", type: "Public · academic", specialties: ["Multi"],                   cost: 4, service: 4, status: "preferred", lastEngaged: "Last week",   settlements: 6 },
  { name: "ABC Medical Center",             city: "Mexico City", country: "MX", flag: "🇲🇽", type: "Tier-1 private",  specialties: ["ER", "Cardio"],             cost: 3, service: 4, status: "active",    lastEngaged: "Jan 2026",    settlements: 2 },
  { name: "Aga Khan Hospital",              city: "Nairobi",     country: "KE", flag: "🇰🇪", type: "Tier-1 regional", specialties: ["Trauma", "Multi"],          cost: 4, service: 4, status: "active",    lastEngaged: "Mar 2026",    settlements: 4 },
  { name: "Anonymous Hospital",             city: "Istanbul",    country: "TR", flag: "🇹🇷", type: "Private",         specialties: ["Multi"],                    cost: 2, service: 2, status: "review",    lastEngaged: "Yesterday",   settlements: 3 },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Providers() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <Recommendation />
      <Directory />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Network · Providers</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">184 preferred · 10 countries</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">512</span> hospitals,
            <br />
            <span className="text-foreground/80">scored on every case.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Each provider is scored on clinical fit, prior settlement variance, billing speed, and traveler outcomes.
            When a case opens, Sentinel proposes the best three within seconds — with the context the provider needs.
          </p>
        </div>

        <div className="rise grid grid-cols-2 gap-px self-end rounded-md border border-border bg-border-soft" style={{ animationDelay: "120ms" }}>
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="bg-[hsl(var(--background-elevated))] px-4 py-3">
              <span className="label-cap">{kpi.label}</span>
              <div className="mt-1 num text-[22px] font-medium leading-none text-foreground">{kpi.value}</div>
              <div className={cn("mt-1 text-[10.5px]", kpi.tone)}>{kpi.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Recommendation moment ─────────────────────────────────────────────
function Recommendation() {
  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/0.06)] via-transparent to-[hsl(var(--primary)/0.06)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent" />

      <CardHeader className="relative space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/12 ring-1 ring-accent/30">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div>
              <CardTitle>Top providers for CASE-8821</CardTitle>
              <CardDescription>Marisol R. · Acute pancreatitis · Mexico City · PLAT-2400</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent" className="gap-1.5">
              <Sparkles className="h-2.5 w-2.5" /> 3 ranked
            </Badge>
            <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
              Show all 7 nearby <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative grid grid-cols-1 gap-4 lg:grid-cols-3">
        {RECS.map((r, i) => (
          <article
            key={r.name}
            className={cn(
              "rise relative flex flex-col gap-3 rounded-md border p-4",
              i === 0
                ? "border-accent/40 bg-[hsl(var(--card-elevated))] ring-1 ring-accent/20"
                : "border-border-soft bg-card/60"
            )}
            style={{ animationDelay: `${200 + i * 80}ms` }}
          >
            {i === 0 ? (
              <span className="absolute -top-2 left-3 inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-[hsl(var(--background-elevated))] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
                <Award className="h-2.5 w-2.5" /> Recommended
              </span>
            ) : null}

            <header className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[13.5px] font-medium leading-tight text-foreground">{r.name}</div>
                <div className="text-[11px] text-muted-foreground">{r.city} · {r.country}</div>
              </div>
              <div className="text-right">
                <div className="num text-[20px] font-medium leading-none text-foreground">{r.score}</div>
                <div className="label-cap text-[8.5px]">match</div>
              </div>
            </header>

            <div className="flex flex-wrap gap-1.5">
              {r.specialties.map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </div>

            <div className="space-y-1.5 border-t border-border-soft pt-3 text-[11.5px]">
              <Row label="Prior settlements" value={`${r.prior.settlements} · ${r.prior.variance}`} />
              <Row label="Last used"         value={r.prior.lastUsed} />
              <Row label="Billing"           value={r.payment} />
            </div>

            <p className="text-[11.5px] leading-snug text-muted-foreground">{r.reason}</p>

            <div className="mt-auto flex items-center gap-2 border-t border-border-soft pt-3">
              {i === 0 ? (
                <Button size="sm" variant="accent" className="flex-1 gap-1.5">
                  <MessageCircle className="h-3 w-3" /> Send outreach
                </Button>
              ) : (
                <Button size="sm" variant="secondary" className="flex-1 gap-1.5">
                  <Phone className="h-3 w-3" /> Contact
                </Button>
              )}
              <Button size="sm" variant="ghost" className="gap-1 text-[10.5px]">
                Why?
              </Button>
            </div>
          </article>
        ))}
      </CardContent>

      <div className="relative flex items-center gap-3 border-t border-border-soft bg-card/40 px-5 py-3 text-[11px]">
        <Sparkles className="h-3 w-3 text-accent" />
        <span className="text-muted-foreground">
          Outreach pre-fills traveler context, policy coverage, attending preferences, and GoP terms.
          Provider reply auto-attaches to the case timeline.
        </span>
      </div>
    </Card>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="label-cap text-[9px]">{label}</span>
      <span className="text-right text-foreground/90">{value}</span>
    </div>
  )
}

// ── Directory ─────────────────────────────────────────────────────────
function Directory() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Provider directory
          </CardTitle>
          <CardDescription>10 most-engaged · sorted by recent activity</CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
          Open full directory <ChevronRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <div className="grid grid-cols-[28px_2fr_1fr_140px_120px_92px_120px_64px] gap-3 border-b border-border-soft px-5 py-2">
        <span className="label-cap"></span>
        <span className="label-cap">Provider · Type</span>
        <span className="label-cap">Specialties</span>
        <span className="label-cap">Cost / Service</span>
        <span className="label-cap">Status</span>
        <span className="label-cap text-right">Settlements</span>
        <span className="label-cap">Last engaged</span>
        <span className="label-cap text-right"></span>
      </div>
      <ul>
        {DIRECTORY.map((p, i) => (
          <li
            key={p.name}
            className="rise grid grid-cols-[28px_2fr_1fr_140px_120px_92px_120px_64px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
            style={{ animationDelay: `${200 + i * 40}ms` }}
          >
            <span className="text-base leading-none">{p.flag}</span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{p.name}</p>
              <p className="text-[11px] text-muted-foreground">{p.city} · {p.type}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {p.specialties.slice(0, 2).map((s) => (
                <Badge key={s} variant="outline" className="h-4 px-1 py-0 text-[9px]">{s}</Badge>
              ))}
              {p.specialties.length > 2 ? (
                <span className="num text-[10px] text-muted-foreground">+{p.specialties.length - 2}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <Rating value={p.cost} label="$" />
              <Rating value={p.service} label="★" />
            </div>
            <StatusTag status={p.status} />
            <span className="num text-right text-[12px] text-foreground">{p.settlements}</span>
            <span className="text-[11px] text-muted-foreground">{p.lastEngaged}</span>
            <div className="flex items-center justify-end gap-1">
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Mail className="h-3 w-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Phone className="h-3 w-3" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function Rating({ value, label }: { value: number; label: string }) {
  const filled = "★★★★★".slice(0, value)
  const empty = "★★★★★".slice(0, 5 - value)
  if (label === "$") {
    const dollars = "$$$$$".slice(0, value)
    const dollarsEmpty = "$$$$$".slice(0, 5 - value)
    return (
      <span className="num text-[10px]">
        <span className="text-foreground">{dollars}</span>
        <span className="text-muted-foreground/30">{dollarsEmpty}</span>
      </span>
    )
  }
  return (
    <span className="text-[10px] tracking-wide">
      <span className="text-[hsl(var(--severity-medium))]">{filled}</span>
      <span className="text-muted-foreground/30">{empty}</span>
    </span>
  )
}

function StatusTag({ status }: { status: Provider["status"] }) {
  const MAP = {
    preferred: { label: "Preferred", variant: "low" as const,         icon: Award },
    active:    { label: "Active",    variant: "default" as const,     icon: Globe2 },
    watch:     { label: "Watch",     variant: "medium" as const,      icon: HeartPulse },
    review:    { label: "Review",    variant: "destructive" as const, icon: Wallet },
  }
  const m = MAP[status]
  const Icon = m.icon
  return (
    <Badge variant={m.variant} className="gap-1">
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </Badge>
  )
}
