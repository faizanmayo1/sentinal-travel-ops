import { useState } from "react"
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts"
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
  { label: "Partner programs",     value: "20",     delta: "8 tier-1 · 12 regional",  tone: "text-foreground" },
  { label: "Combined volume MTD",   value: "21,840", delta: "Cases + claims",          tone: "text-foreground" },
  { label: "Avg NPS",               value: "+68",     delta: "+4 vs prior month",       tone: "text-[hsl(var(--severity-low))]" },
  { label: "Savings to partners",  value: "$4.2M",   delta: "MTD · 14.8% leakage",     tone: "text-[hsl(var(--severity-low))]" },
] as const

interface Partner {
  id: string
  name: string
  tier: "Tier 1" | "Tier 2" | "Regional"
  region: string
  initials: string
  active: { cases: number; claims: number }
  nps: number
  sla: number
  savings: string
  responseMin: number
  trend: number[]
  monthly: Array<{ m: string; cases: number; claims: number }>
  highlights: Array<{ label: string; value: string; tone: "low" | "default" | "accent" | "high" }>
  activity: Array<{ time: string; event: string; meta: string }>
}

const PARTNERS: Partner[] = [
  {
    id: "P-101",
    name: "Allianz Travel",
    tier: "Tier 1",
    region: "Global",
    initials: "AT",
    active: { cases: 86, claims: 412 },
    nps: 72,
    sla: 97.4,
    savings: "$1.84M",
    responseMin: 1.3,
    trend: [62, 68, 71, 70, 74, 78, 80, 82, 85, 88, 92, 98],
    monthly: [
      { m: "Jun", cases: 312, claims: 1820 },
      { m: "Jul", cases: 348, claims: 1940 },
      { m: "Aug", cases: 382, claims: 2120 },
      { m: "Sep", cases: 401, claims: 2280 },
      { m: "Oct", cases: 412, claims: 2410 },
      { m: "Nov", cases: 442, claims: 2580 },
      { m: "Dec", cases: 460, claims: 2740 },
      { m: "Jan", cases: 412, claims: 2480 },
      { m: "Feb", cases: 430, claims: 2620 },
      { m: "Mar", cases: 462, claims: 2810 },
      { m: "Apr", cases: 484, claims: 2980 },
      { m: "May", cases: 312, claims: 1864 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "68%",   tone: "low"     },
      { label: "Median time to settle",    value: "4m 02s", tone: "low"     },
      { label: "Provider negotiations",     value: "112",    tone: "accent"  },
      { label: "Escalations to specialist", value: "9",      tone: "default" },
    ],
    activity: [
      { time: "12 min", event: "GoP issued for member 442881",         meta: "$14.2k · Mexico City" },
      { time: "26 min", event: "Cost containment review on INV-4471",  meta: "Saved $7.4k" },
      { time: "1h",     event: "Monthly report exported",                meta: "Partner ops · PDF" },
      { time: "2h",     event: "12 claims auto-paid",                    meta: "$9,420 disbursed" },
    ],
  },
  {
    id: "P-102",
    name: "AXA Partners",
    tier: "Tier 1",
    region: "EMEA",
    initials: "AX",
    active: { cases: 64, claims: 318 },
    nps: 69,
    sla: 96.8,
    savings: "$1.12M",
    responseMin: 1.5,
    trend: [54, 58, 60, 64, 66, 70, 72, 75, 78, 82, 84, 88],
    monthly: [
      { m: "Jun", cases: 248, claims: 1420 },
      { m: "Jul", cases: 268, claims: 1500 },
      { m: "Aug", cases: 280, claims: 1640 },
      { m: "Sep", cases: 304, claims: 1740 },
      { m: "Oct", cases: 318, claims: 1880 },
      { m: "Nov", cases: 340, claims: 1980 },
      { m: "Dec", cases: 358, claims: 2120 },
      { m: "Jan", cases: 322, claims: 1900 },
      { m: "Feb", cases: 338, claims: 2020 },
      { m: "Mar", cases: 362, claims: 2180 },
      { m: "Apr", cases: 384, claims: 2300 },
      { m: "May", cases: 242, claims: 1440 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "61%",   tone: "low"     },
      { label: "Median time to settle",    value: "5m 12s", tone: "default" },
      { label: "Provider negotiations",     value: "84",     tone: "accent"  },
      { label: "Escalations to specialist", value: "6",      tone: "default" },
    ],
    activity: [
      { time: "8 min",  event: "Bordereau file generated",              meta: "Auto · April closeout" },
      { time: "42 min", event: "New facility added to network",          meta: "Lyon · CHU Lyon" },
      { time: "3h",     event: "SLA threshold renegotiated",             meta: "97% → 98%" },
    ],
  },
  {
    id: "P-103",
    name: "Generali Global Assistance",
    tier: "Tier 1",
    region: "Global",
    initials: "GG",
    active: { cases: 48, claims: 226 },
    nps: 65,
    sla: 95.4,
    savings: "$0.78M",
    responseMin: 2.0,
    trend: [38, 42, 46, 48, 52, 56, 58, 62, 64, 68, 72, 74],
    monthly: [
      { m: "Jun", cases: 184, claims: 980 },
      { m: "Jul", cases: 196, claims: 1040 },
      { m: "Aug", cases: 212, claims: 1100 },
      { m: "Sep", cases: 226, claims: 1180 },
      { m: "Oct", cases: 240, claims: 1240 },
      { m: "Nov", cases: 262, claims: 1320 },
      { m: "Dec", cases: 276, claims: 1380 },
      { m: "Jan", cases: 242, claims: 1240 },
      { m: "Feb", cases: 258, claims: 1320 },
      { m: "Mar", cases: 278, claims: 1420 },
      { m: "Apr", cases: 294, claims: 1480 },
      { m: "May", cases: 188, claims: 940 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "54%",   tone: "default" },
      { label: "Median time to settle",    value: "6m 24s", tone: "default" },
      { label: "Provider negotiations",     value: "62",     tone: "accent"  },
      { label: "Escalations to specialist", value: "11",     tone: "high"    },
    ],
    activity: [
      { time: "18 min", event: "Quarterly review prep",                  meta: "Joint call · May 22" },
      { time: "2h",     event: "Onboarded 4 new providers",                meta: "APAC region" },
      { time: "5h",     event: "Sentiment uplift on cancellation claims", meta: "+9 NPS" },
    ],
  },
  {
    id: "P-104",
    name: "Chubb Travel",
    tier: "Tier 2",
    region: "Americas",
    initials: "CB",
    active: { cases: 32, claims: 148 },
    nps: 64,
    sla: 96.2,
    savings: "$0.34M",
    responseMin: 2.1,
    trend: [28, 30, 32, 36, 38, 42, 44, 46, 48, 52, 54, 58],
    monthly: [
      { m: "Jun", cases: 120, claims: 640 },
      { m: "Jul", cases: 132, claims: 680 },
      { m: "Aug", cases: 142, claims: 720 },
      { m: "Sep", cases: 154, claims: 780 },
      { m: "Oct", cases: 162, claims: 820 },
      { m: "Nov", cases: 174, claims: 880 },
      { m: "Dec", cases: 184, claims: 920 },
      { m: "Jan", cases: 162, claims: 820 },
      { m: "Feb", cases: 174, claims: 880 },
      { m: "Mar", cases: 186, claims: 940 },
      { m: "Apr", cases: 198, claims: 1000 },
      { m: "May", cases: 124, claims: 624 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "58%",   tone: "default" },
      { label: "Median time to settle",    value: "5m 48s", tone: "default" },
      { label: "Provider negotiations",     value: "38",     tone: "accent"  },
      { label: "Escalations to specialist", value: "4",      tone: "default" },
    ],
    activity: [
      { time: "32 min", event: "Bordereau API connection healthy", meta: "Uptime 99.94%" },
      { time: "1h",     event: "Expansion proposal sent",          meta: "Caribbean cruise add-on" },
    ],
  },
  {
    id: "P-105",
    name: "Zurich Travel",
    tier: "Tier 1",
    region: "EMEA",
    initials: "ZU",
    active: { cases: 58, claims: 268 },
    nps: 70,
    sla: 96.9,
    savings: "$0.96M",
    responseMin: 1.6,
    trend: [42, 46, 50, 54, 58, 62, 66, 68, 72, 76, 80, 84],
    monthly: [
      { m: "Jun", cases: 224, claims: 1240 },
      { m: "Jul", cases: 240, claims: 1320 },
      { m: "Aug", cases: 254, claims: 1380 },
      { m: "Sep", cases: 268, claims: 1440 },
      { m: "Oct", cases: 282, claims: 1520 },
      { m: "Nov", cases: 296, claims: 1620 },
      { m: "Dec", cases: 312, claims: 1740 },
      { m: "Jan", cases: 278, claims: 1560 },
      { m: "Feb", cases: 292, claims: 1640 },
      { m: "Mar", cases: 310, claims: 1740 },
      { m: "Apr", cases: 328, claims: 1840 },
      { m: "May", cases: 212, claims: 1180 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "65%",   tone: "low"     },
      { label: "Median time to settle",    value: "4m 32s", tone: "low"     },
      { label: "Provider negotiations",     value: "72",     tone: "accent"  },
      { label: "Escalations to specialist", value: "7",      tone: "default" },
    ],
    activity: [
      { time: "14 min", event: "Cost containment summary delivered", meta: "Wallet · April · $96k" },
      { time: "2h",     event: "Compliance attestation refreshed",   meta: "SOC 2 + GDPR" },
    ],
  },
  {
    id: "P-106",
    name: "TravelGuard (AIG)",
    tier: "Tier 2",
    region: "Americas",
    initials: "TG",
    active: { cases: 24, claims: 92 },
    nps: 62,
    sla: 95.2,
    savings: "$0.18M",
    responseMin: 2.4,
    trend: [18, 22, 24, 28, 30, 32, 34, 38, 40, 42, 44, 46],
    monthly: [
      { m: "Jun", cases: 72,  claims: 412 },
      { m: "Jul", cases: 84,  claims: 440 },
      { m: "Aug", cases: 92,  claims: 478 },
      { m: "Sep", cases: 102, claims: 510 },
      { m: "Oct", cases: 110, claims: 546 },
      { m: "Nov", cases: 118, claims: 582 },
      { m: "Dec", cases: 128, claims: 612 },
      { m: "Jan", cases: 116, claims: 548 },
      { m: "Feb", cases: 124, claims: 582 },
      { m: "Mar", cases: 132, claims: 610 },
      { m: "Apr", cases: 142, claims: 642 },
      { m: "May", cases: 92,  claims: 412 },
    ],
    highlights: [
      { label: "Auto-adjudication rate",    value: "49%",   tone: "high"    },
      { label: "Median time to settle",    value: "7m 14s", tone: "high"    },
      { label: "Provider negotiations",     value: "22",     tone: "default" },
      { label: "Escalations to specialist", value: "8",      tone: "high"    },
    ],
    activity: [
      { time: "1h", event: "Improvement plan kicked off",              meta: "Auto-adj target 60% in 60d" },
      { time: "5h", event: "New SLA dashboard shared",                  meta: "Read-only access" },
    ],
  },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Partners() {
  const [activeId, setActiveId] = useState(PARTNERS[0].id)
  const active = PARTNERS.find((p) => p.id === activeId) ?? PARTNERS[0]

  return (
    <div className="space-y-6 px-8 py-8">
      <Hero />
      <PartnerSwitcher partners={PARTNERS} activeId={activeId} onSelect={setActiveId} />
      <PartnerDetail p={active} />
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
            <span className="label-cap">Network · Partners</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">20 programs · 8 tier-1</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">One pane</span> per partner,
            <br />
            <span className="text-foreground/80">every metric they ask for.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Insurers see their travelers, claims, cases, savings, SLA performance, and service quality on one
            program-level dashboard — exportable to their format, refreshed every minute.
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

// ── Switcher ──────────────────────────────────────────────────────────
function PartnerSwitcher({
  partners,
  activeId,
  onSelect,
}: {
  partners: Partner[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-6">
      {partners.map((p) => {
        const isActive = p.id === activeId
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={cn(
              "group relative flex items-center gap-3 overflow-hidden rounded-md border px-3 py-2.5 text-left transition-all",
              isActive
                ? "border-primary/40 bg-[hsl(var(--card-elevated))] glow-primary"
                : "border-border-soft bg-card/40 hover:border-border hover:bg-card"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[11px] font-medium",
              isActive ? "bg-primary/20 text-primary ring-1 ring-primary/40" : "bg-secondary text-foreground/80 ring-1 ring-border"
            )}>
              {p.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-foreground">{p.name}</p>
              <p className="text-[10.5px] text-muted-foreground">{p.tier} · {p.region}</p>
            </div>
            {isActive ? (
              <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

// ── Detail ────────────────────────────────────────────────────────────
function PartnerDetail({ p }: { p: Partner }) {
  return (
    <div className="space-y-5">
      {/* Identity strip */}
      <Card elevated>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr_auto]">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30 font-display text-[20px] text-primary">
              {p.initials}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="font-display text-[28px] leading-none tracking-tight text-foreground">{p.name}</h2>
                <Badge variant="default">{p.tier}</Badge>
                <Badge variant="outline">{p.region}</Badge>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><HeartPulse className="h-3 w-3" /> {p.active.cases} active cases</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Briefcase className="h-3 w-3" /> {p.active.claims} claims</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> SLA {p.sla}%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border-soft bg-border-soft">
            <Cell label="NPS"            value={`+${p.nps}`} tone="text-[hsl(var(--severity-low))]" />
            <Cell label="Savings MTD"    value={p.savings} tone="text-accent" />
            <Cell label="Avg response"   value={`${p.responseMin}m`} tone="text-foreground" />
            <Cell label="SLA pace"       value={`${p.sla}%`} tone="text-[hsl(var(--severity-low))]" />
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" className="gap-1.5">
              <Download className="h-3 w-3" /> Export report
            </Button>
            <Button size="sm" variant="accent" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> AI summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chart + Highlights */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card elevated>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Monthly volume · cases + claims
              </CardTitle>
              <CardDescription>12-month rolling · current month MTD</CardDescription>
            </div>
            <Badge variant="outline">Last 12 mo</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full">
              <ResponsiveContainer>
                <BarChart data={p.monthly} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border-soft))" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={false} width={36} />
                  <RTooltip
                    cursor={{ fill: "hsl(var(--secondary) / 0.4)" }}
                    contentStyle={{
                      background: "hsl(var(--card-elevated))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: "Geist Mono, monospace",
                    }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                  />
                  <Bar dataKey="claims" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} maxBarSize={18} />
                  <Bar dataKey="cases"  fill="hsl(var(--accent))"  radius={[2, 2, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3 text-[11px]">
              <Legend dot="bg-primary" label="Claims" value={p.monthly.reduce((a, m) => a + m.claims, 0).toLocaleString()} />
              <Legend dot="bg-accent"  label="Cases"  value={p.monthly.reduce((a, m) => a + m.cases,  0).toLocaleString()} />
              <Legend dot="bg-[hsl(var(--severity-low))]" label="Net savings" value={p.savings} />
            </div>
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-accent" />
              Program highlights
            </CardTitle>
            <CardDescription>What's driving the numbers this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {p.highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-center justify-between rounded-md border border-border-soft bg-card/40 px-3 py-2"
              >
                <span className="text-[12px] text-foreground">{h.label}</span>
                <Badge variant={h.tone}>{h.value}</Badge>
              </div>
            ))}
            <div className="mt-3 flex items-center gap-2 rounded-md border border-border-soft bg-[hsl(var(--severity-low)/0.06)] px-3 py-2 text-[11px]">
              <CheckCircle2 className="h-3 w-3 text-[hsl(var(--severity-low))]" />
              <span className="text-muted-foreground">Compliance attestations current · SOC 2 Type II / GDPR</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Activity */}
      <Card elevated>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Recent program activity
            </CardTitle>
            <CardDescription>Operational moments worth sharing with the partner</CardDescription>
          </div>
          <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
            Open full feed <ChevronRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <ul className="divide-y divide-border-soft">
          {p.activity.map((a, i) => (
            <li
              key={i}
              className="rise grid grid-cols-[80px_1fr_auto] items-center gap-4 px-5 py-3"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <span className="num text-[10.5px] text-muted-foreground">{a.time} ago</span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-foreground">{a.event}</p>
                <p className="text-[11px] text-muted-foreground">{a.meta}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[10.5px]">
                Detail <ArrowUpRight className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Cell({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="bg-[hsl(var(--background-elevated))] px-3 py-2.5">
      <div className="label-cap">{label}</div>
      <div className={cn("mt-1 num text-[18px] font-medium leading-none", tone)}>{value}</div>
    </div>
  )
}

function Legend({ dot, label, value }: { dot: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="num text-foreground">{value}</span>
    </div>
  )
}
