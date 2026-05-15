import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Presentation,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
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
  { label: "Volume this week",     value: "5,128", delta: "+8.2% WoW",                          trend: "up"   as const, tone: "text-[hsl(var(--severity-low))]" },
  { label: "Auto-adjudication",    value: "64.2%", delta: "+1.4 pts",                            trend: "up"   as const, tone: "text-[hsl(var(--severity-low))]" },
  { label: "Avg cost containment", value: "14.8%", delta: "+0.6 pts",                            trend: "up"   as const, tone: "text-accent" },
  { label: "Traveler NPS",          value: "+68",  delta: "−2 from last week",                  trend: "down" as const, tone: "text-[hsl(var(--severity-medium))]" },
] as const

const TRENDS = [
  { w: "W14", volume: 4480, autoAdj: 58.4, savings: 1.42, sla: 96.2 },
  { w: "W15", volume: 4620, autoAdj: 59.1, savings: 1.48, sla: 96.4 },
  { w: "W16", volume: 4720, autoAdj: 60.2, savings: 1.55, sla: 96.7 },
  { w: "W17", volume: 4810, autoAdj: 61.4, savings: 1.62, sla: 97.0 },
  { w: "W18", volume: 4920, autoAdj: 62.0, savings: 1.71, sla: 97.2 },
  { w: "W19", volume: 4736, autoAdj: 62.8, savings: 1.78, sla: 97.0 },
  { w: "W20", volume: 5128, autoAdj: 64.2, savings: 1.84, sla: 96.8 },
]

const WINS = [
  { metric: "$184k", label: "GoP issued today across 12 facilities",              tone: "low" as const },
  { metric: "‑38%",  label: "Median time-to-pay on claims vs Q1 baseline",        tone: "low" as const },
  { metric: "211%",  label: "Surge protocol activated for Caribbean storm",       tone: "default" as const },
  { metric: "+4",    label: "AXA partnership SLA renegotiated · 97 → 98",          tone: "accent" as const },
]

const WATCH = [
  { metric: "‑2 pts", label: "NPS dipped on cancellation cohort · Turkey + India", tone: "medium" as const },
  { metric: "9",       label: "Fraud-flagged invoices · $42k under dispute",        tone: "high"   as const },
  { metric: "8 min",   label: "Voice call wait time peaked above SLA on May 16",    tone: "medium" as const },
]

const BOTTLENECKS = [
  {
    title: "Translation backlog · Turkish + Arabic medical docs",
    owner: "Document Intelligence",
    impact: "Slows 14 cases · avg +28 min to GoP",
    severity: "high" as const,
    action: "Add language-pair specialist · ETA 7 days",
  },
  {
    title: "Air-ambulance partner SLA · 2.8h vs 2.0h target",
    owner: "Provider Network · APAC",
    impact: "Higher exposure on evac cases",
    severity: "medium" as const,
    action: "RFQ second provider in region",
  },
  {
    title: "Cancellation claim documentation request loop",
    owner: "Claims Auto-Adjudication",
    impact: "Drives most NPS dips in cancellation cohort",
    severity: "medium" as const,
    action: "Reduce mandatory docs from 5 → 3 for amounts < $1k",
  },
  {
    title: "Cost-containment review queue at 184 invoices",
    owner: "Cost Containment",
    impact: "Above 150 healthy threshold",
    severity: "low" as const,
    action: "Auto-routing review every 12h",
  },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Executive() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <Summary />
      <Trends />
      <Bottlenecks />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Intelligence · Executive BI</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">Week 20 · May 12 – 18 · auto-refreshed 06:00 GMT</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">The week,</span>
            <br />
            <span className="text-foreground/80">read in one minute.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            A narrative summary, the metrics that moved, and the bottlenecks worth raising in the next leadership
            sync. Generated every Monday at 06:00 GMT; exportable as PDF, Excel, or board deck.
          </p>
        </div>

        <div className="rise grid grid-cols-2 gap-px self-end rounded-md border border-border bg-border-soft" style={{ animationDelay: "120ms" }}>
          {KPIS.map((kpi) => (
            <div key={kpi.label} className="bg-[hsl(var(--background-elevated))] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="label-cap">{kpi.label}</span>
                {kpi.trend === "up"
                  ? <ArrowUpRight className="h-3 w-3 text-[hsl(var(--severity-low))]" />
                  : <ArrowDownRight className="h-3 w-3 text-[hsl(var(--severity-medium))]" />
                }
              </div>
              <div className="mt-1 num text-[22px] font-medium leading-none text-foreground">{kpi.value}</div>
              <div className={cn("mt-1 text-[10.5px]", kpi.tone)}>{kpi.delta}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── AI Summary ────────────────────────────────────────────────────────
function Summary() {
  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--accent)/0.06)] via-transparent to-[hsl(var(--primary)/0.06)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-accent to-transparent" />

      <CardHeader className="relative flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/12 ring-1 ring-accent/30">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle>Week in review · AI brief</CardTitle>
            <CardDescription>Generated from 5,128 events · cited from underlying data</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="gap-1.5">
            <FileText className="h-3 w-3" /> PDF
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5">
            <FileSpreadsheet className="h-3 w-3" /> Excel
          </Button>
          <Button size="sm" variant="accent" className="gap-1.5">
            <Presentation className="h-3 w-3" /> Board deck
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5">
        {/* The serif briefing */}
        <div className="relative rounded-md border border-border-soft bg-card/60 p-6">
          <span className="absolute -top-3 left-5 bg-[hsl(var(--card-elevated))] px-1.5 font-display-italic text-[40px] leading-none text-accent/80">
            "
          </span>
          <p className="font-display text-[20px] leading-[1.5] text-foreground/95 text-balance">
            <span className="font-display-italic">Volume rose to</span>{" "}
            <span className="num text-foreground">5,128</span> events this week, an{" "}
            <span className="text-[hsl(var(--severity-low))]">8.2% lift</span> versus W19,
            absorbed entirely by auto-adjudication crossing{" "}
            <span className="num text-foreground">64.2%</span> for the first time.
            Cost-containment stayed at{" "}
            <span className="num text-accent">14.8%</span> leakage prevented, with the
            Caribbean storm protocol containing what would have been a service-quality risk.
            The one watch item:{" "}
            <span className="font-display-italic text-[hsl(var(--severity-medium))]">NPS slipped two points</span>{" "}
            on cancellation claims in two markets — recommend a documentation-loop fix this sprint.
          </p>
        </div>

        {/* Wins + Watch */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-[hsl(var(--severity-low))]" />
              <span className="label-cap">Top wins · this week</span>
            </div>
            <ul className="space-y-2">
              {WINS.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-border-soft bg-card/40 px-3 py-2"
                >
                  <span className={cn(
                    "num shrink-0 text-[13px] font-medium",
                    w.tone === "low"     && "text-[hsl(var(--severity-low))]",
                    w.tone === "accent"  && "text-accent",
                    w.tone === "default" && "text-foreground",
                  )}>
                    {w.metric}
                  </span>
                  <span className="text-[12px] leading-snug text-muted-foreground">{w.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-[hsl(var(--severity-high))]" />
              <span className="label-cap">Watch closely</span>
            </div>
            <ul className="space-y-2">
              {WATCH.map((w, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-md border border-border-soft bg-card/40 px-3 py-2"
                >
                  <span className={cn(
                    "num shrink-0 text-[13px] font-medium",
                    w.tone === "medium" && "text-[hsl(var(--severity-medium))]",
                    w.tone === "high"   && "text-[hsl(var(--severity-high))]",
                  )}>
                    {w.metric}
                  </span>
                  <span className="text-[12px] leading-snug text-muted-foreground">{w.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border-soft bg-[hsl(var(--severity-low)/0.06)] px-3 py-2 text-[11px]">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="text-muted-foreground">
            Citations available · every claim in this brief links to its underlying data slice
          </span>
          <Button size="sm" variant="ghost" className="ml-auto h-5 gap-1 px-2 text-[10.5px]">
            View citations <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Trends chart ──────────────────────────────────────────────────────
function Trends() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            7-week performance · four series
          </CardTitle>
          <CardDescription>Volume · auto-adjudication % · cost savings ($M) · SLA %</CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1.5">
          <Download className="h-3 w-3" /> Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer>
            <LineChart data={TRENDS} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border-soft))" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="w" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
              <YAxis yAxisId="left"  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={false} width={42} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={false} width={36} />
              <RTooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                contentStyle={{
                  background: "hsl(var(--card-elevated))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "Geist Mono, monospace",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              />
              <Line yAxisId="left"  type="monotone" dataKey="volume"   stroke="hsl(var(--primary))"             strokeWidth={1.8} dot={{ r: 2.5, fill: "hsl(var(--primary))" }} />
              <Line yAxisId="right" type="monotone" dataKey="autoAdj"  stroke="hsl(var(--severity-low))"        strokeWidth={1.5} dot={{ r: 2, fill: "hsl(var(--severity-low))" }} strokeDasharray="4 3" />
              <Line yAxisId="right" type="monotone" dataKey="sla"      stroke="hsl(var(--severity-medium))"     strokeWidth={1.5} dot={{ r: 2, fill: "hsl(var(--severity-medium))" }} strokeDasharray="4 3" />
              <Line yAxisId="right" type="monotone" dataKey="savings"  stroke="hsl(var(--accent))"              strokeWidth={1.5} dot={{ r: 2, fill: "hsl(var(--accent))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-soft pt-3 text-[11px]">
          <Legend dot="bg-primary"                       label="Volume (left)"        value="5,128" />
          <Legend dot="bg-[hsl(var(--severity-low))]"    label="Auto-adj %"            value="64.2%" />
          <Legend dot="bg-[hsl(var(--severity-medium))]" label="SLA %"                 value="96.8%" />
          <Legend dot="bg-accent"                        label="Savings ($M)"          value="$1.84" />
        </div>
      </CardContent>
    </Card>
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

// ── Bottlenecks ───────────────────────────────────────────────────────
function Bottlenecks() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--severity-high))]" />
            Bottlenecks worth surfacing
          </CardTitle>
          <CardDescription>Ranked by impact on SLA + traveler outcomes</CardDescription>
        </div>
        <Badge variant="outline">4 items</Badge>
      </CardHeader>
      <ul className="divide-y divide-border-soft">
        {BOTTLENECKS.map((b, i) => (
          <li
            key={b.title}
            className="rise grid grid-cols-[auto_1fr_220px_auto] items-start gap-4 px-5 py-4"
            style={{ animationDelay: `${200 + i * 60}ms` }}
          >
            <Badge variant={b.severity}>{b.severity}</Badge>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">{b.title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Owner · {b.owner}
              </p>
              <p className="mt-1 text-[11.5px] text-muted-foreground">{b.impact}</p>
            </div>
            <p className="text-[11.5px] leading-snug text-foreground">
              <span className="label-cap mr-1 text-[8.5px]">Action</span>
              {b.action}
            </p>
            <Button size="sm" variant="ghost" className="gap-1 text-[10.5px]">
              Open <ArrowUpRight className="h-3 w-3" />
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
