import {
  ArrowUpRight,
  Brain,
  ChevronRight,
  ClipboardCheck,
  CloudLightning,
  Globe2,
  HeartPulse,
  Plane,
  Sparkles,
  TrendingDown,
  Wallet,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkline } from "@/components/widgets/Sparkline"
import { RegionLoad } from "@/components/widgets/RegionLoad"

const KPIS = [
  {
    label: "Active Travelers",
    value: "5,142",
    delta: "+2.4% vs LW",
    deltaTone: "text-[hsl(var(--severity-low))]",
    icon: Plane,
    spark: [38, 42, 39, 46, 50, 49, 54, 58, 56, 61, 64, 68],
    sparkColor: "hsl(var(--primary))",
  },
  {
    label: "Open Cases",
    value: "312",
    delta: "8 urgent · SLA 96.8%",
    deltaTone: "text-[hsl(var(--severity-critical))]",
    icon: HeartPulse,
    spark: [22, 24, 21, 28, 26, 31, 29, 33, 34, 31, 35, 38],
    sparkColor: "hsl(var(--severity-critical))",
  },
  {
    label: "Claims in Queue",
    value: "184",
    delta: "62% auto-adjudicated",
    deltaTone: "text-[hsl(var(--severity-low))]",
    icon: ClipboardCheck,
    spark: [12, 14, 18, 16, 22, 20, 24, 25, 23, 28, 30, 32],
    sparkColor: "hsl(var(--severity-low))",
  },
  {
    label: "Savings MTD",
    value: "$1.84M",
    delta: "+18% YoY",
    deltaTone: "text-[hsl(var(--accent))]",
    icon: TrendingDown,
    spark: [4, 6, 5, 9, 8, 11, 12, 14, 13, 16, 18, 21],
    sparkColor: "hsl(var(--accent))",
  },
]

const URGENT = [
  { id: "CASE-8821", traveler: "Marisol R.", country: "Mexico City, MX", issue: "Hospital admission · GoP pending", severity: "critical" as const, sla: "00:04:12", policy: "PLAT-2400" },
  { id: "CASE-8814", traveler: "Henrik J.",  country: "Bangkok, TH",    issue: "Medical evacuation requested",       severity: "critical" as const, sla: "00:11:48", policy: "GOLD-1820" },
  { id: "CASE-8809", traveler: "Aisha O.",   country: "Rome, IT",       issue: "ER admit, payment confirmation",     severity: "high"     as const, sla: "00:19:55", policy: "PLAT-2400" },
  { id: "CASE-8801", traveler: "Diego P.",   country: "Cusco, PE",      issue: "Altitude sickness · ICU",            severity: "high"     as const, sla: "00:24:02", policy: "GOLD-1820" },
  { id: "CASE-8794", traveler: "Yuki M.",    country: "Reykjavík, IS",  issue: "Fractured tibia · surgery cleared",  severity: "medium"   as const, sla: "00:42:11", policy: "SILV-1010" },
]

export function CommandCenter() {
  const navigate = useNavigate()
  return (
    <div className="space-y-8 px-8 py-8">
      {/* ── Hero stripe ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
        <div className="starfield absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute -top-24 right-12 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-6 p-8">
          <div className="rise max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="label-cap">Mission Report</span>
              <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
              <span className="label-cap text-[hsl(var(--severity-low))]">Live · Tuesday, 19 May 2026</span>
            </div>
            <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
              <span className="gradient-headline font-display-italic">312 cases</span> in flight,
              <br />
              <span className="text-foreground/80">across</span> <span className="num text-[40px] font-medium text-foreground">71</span>{" "}
              <span className="text-foreground/80">countries.</span>
            </h1>
            <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
              Caribbean tropical storm advisory active since 09:14 GMT. Surge protocol engaged.
              <span className="text-foreground"> 8 urgent medical cases</span> queued; AI co-pilot has surfaced{" "}
              <span className="text-accent">4 high-confidence interventions</span>.
            </p>
          </div>

          <div className="rise flex flex-col items-end gap-3" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center gap-2">
              <Badge variant="high" className="gap-1.5">
                <CloudLightning className="h-3 w-3" /> Storm watch
              </Badge>
              <Badge variant="outline">UTC 10:42</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1.5">
                <Globe2 className="h-3 w-3" /> Region · All
              </Button>
              <Button size="sm" variant="accent" className="gap-1.5">
                <Sparkles className="h-3 w-3" /> Generate brief
              </Button>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-px border-t border-border-soft bg-border-soft md:grid-cols-4">
          {KPIS.map((kpi, i) => (
            <div
              key={kpi.label}
              className="rise relative bg-[hsl(var(--background-elevated))] px-5 py-4"
              style={{ animationDelay: `${200 + i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="label-cap">{kpi.label}</span>
                  <span className="num text-[26px] font-medium leading-none tracking-tight text-foreground">
                    {kpi.value}
                  </span>
                  <span className={`text-[11px] ${kpi.deltaTone}`}>{kpi.delta}</span>
                </div>
                <Sparkline data={kpi.spark} color={kpi.sparkColor} />
              </div>
              <kpi.icon className="absolute right-4 bottom-3 h-3 w-3 text-muted-foreground/40" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Main grid ────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Urgent queue */}
        <Card elevated className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <div className="flex items-center gap-3">
              <span className="beacon h-1.5 w-1.5 rounded-full bg-[hsl(var(--severity-critical))] text-[hsl(var(--severity-critical))]" />
              <div>
                <CardTitle>Urgent medical queue</CardTitle>
                <CardDescription>AI-ranked by clinical severity, cost exposure, and SLA risk</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="critical">8 urgent</Badge>
              <Button variant="ghost" size="sm" className="gap-1 text-[11px]" asChild>
                <Link to="/cases">Open queue <ChevronRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <div className="grid grid-cols-[110px_1fr_140px_88px_72px] gap-3 border-b border-border-soft px-5 py-2">
            <span className="label-cap">Case ID</span>
            <span className="label-cap">Traveler · Location · Issue</span>
            <span className="label-cap">Policy</span>
            <span className="label-cap">Severity</span>
            <span className="label-cap text-right">SLA</span>
          </div>
          <ul>
            {URGENT.map((c, i) => (
              <li
                key={c.id}
                onClick={() => navigate("/cases")}
                className="rise group grid cursor-pointer grid-cols-[110px_1fr_140px_88px_72px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
                style={{ animationDelay: `${300 + i * 50}ms` }}
              >
                <span className="num text-[11px] text-muted-foreground">{c.id}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-foreground">{c.traveler}</span>
                    <span className="text-[11px] text-muted-foreground">· {c.country}</span>
                  </div>
                  <p className="truncate text-[11.5px] text-muted-foreground">{c.issue}</p>
                </div>
                <span className="num text-[11px] text-muted-foreground">{c.policy}</span>
                <Badge variant={c.severity}>{c.severity}</Badge>
                <div className="text-right">
                  <span className={`num text-[12px] tabular-nums ${
                    c.severity === "critical" ? "text-[hsl(var(--severity-critical))]"
                    : c.severity === "high"   ? "text-[hsl(var(--severity-high))]"
                    : "text-foreground"
                  }`}>
                    {c.sla}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* AI co-pilot console */}
        <Card elevated className="overflow-hidden">
          <CardHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/15 ring-1 ring-accent/30">
                  <Brain className="h-3 w-3 text-accent" />
                </div>
                <CardTitle>AI Co-pilot</CardTitle>
              </div>
              <Badge variant="accent" className="gap-1">
                <Sparkles className="h-2.5 w-2.5" /> 4 actions
              </Badge>
            </div>
            <CardDescription className="mt-1">Highest-leverage interventions, ranked by impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4 pt-4">
            <ActionCard
              tag="Authorize"
              tagTone="primary"
              title="Issue Guarantee-of-Payment for CASE-8821"
              body="Mexico City hospital. Policy verified · $14,200 est. 3 prior settlements with facility avg 18% below benchmark."
              metric="Saves 47 min"
              cta="Approve"
              href="/cases"
            />
            <ActionCard
              tag="Surge"
              tagTone="high"
              title="Reassign 6 Caribbean cases to LATAM night desk"
              body="Forecast: +38 inbound by 14:00 GMT. Reassignment keeps SLA pace above 95%."
              metric="+38 inbound"
              cta="Reassign"
              variant="secondary"
              href="/risk"
            />
            <ActionCard
              tag="Audit"
              tagTone="accent"
              title="Review flagged invoice INV-4471"
              body="Line items 41% above regional benchmark. Containment paused payment — savings est. $7.4k."
              metric="$7.4k saved"
              cta="Open invoice"
              variant="secondary"
              href="/cost-containment"
            />
          </CardContent>
        </Card>
      </section>

      {/* ── Region telemetry ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card elevated className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Regional case load</CardTitle>
              <CardDescription>Live distribution of active assistance + claims by region</CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline">Last 60 min</Badge>
              <Button variant="ghost" size="sm" className="gap-1 text-[11px]" asChild>
                <Link to="/risk">Open map <ArrowUpRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <RegionLoad />
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader className="space-y-0">
            <div className="flex items-center justify-between">
              <CardTitle>Cost containment</CardTitle>
              <Badge variant="accent">MTD</Badge>
            </div>
            <CardDescription>Provider negotiations, line-item adjustments, fraud prevention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="label-cap">Net savings</span>
                <div className="mt-1 font-display text-[40px] leading-none tracking-tightest text-foreground">
                  $<span className="num">1.84</span><span className="text-muted-foreground/60">M</span>
                </div>
              </div>
              <div className="text-right text-[11px] text-[hsl(var(--severity-low))]">
                <div>+18%</div>
                <div className="text-muted-foreground">YoY</div>
              </div>
            </div>
            <div className="space-y-2.5 border-t border-border-soft pt-3">
              <ContainmentRow label="Negotiated provider bills" value="$1.12M" pct={61} />
              <ContainmentRow label="Line-item containment" value="$0.46M" pct={25} />
              <ContainmentRow label="Fraud prevented" value="$0.18M" pct={10} />
              <ContainmentRow label="Duplicate invoices" value="$0.08M" pct={4} />
            </div>
            <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
              <Link to="/cost-containment"><Wallet className="h-3 w-3" /> Open containment ledger</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <p className="px-1 text-center text-[10px] text-muted-foreground/60">
        <span className="label-cap-tight">SOC 2 Type II · ISO 27001 · GDPR</span>
        <span className="mx-2">·</span>
        <span>Every action audit-logged. Showing aggregate metrics for demo workspace.</span>
      </p>
    </div>
  )
}

function ActionCard({
  tag,
  tagTone,
  title,
  body,
  metric,
  cta,
  variant = "primary",
  href,
}: {
  tag: string
  tagTone: "primary" | "accent" | "high" | "low"
  title: string
  body: string
  metric: string
  cta: string
  variant?: "primary" | "secondary"
  href?: string
}) {
  const tagVariant =
    tagTone === "primary" ? "default" : tagTone === "accent" ? "accent" : tagTone === "high" ? "high" : "low"
  return (
    <div className="group relative overflow-hidden rounded-md border border-border-soft bg-card/60 p-3 transition-colors hover:border-border">
      <div className="flex items-center justify-between gap-2">
        <Badge variant={tagVariant as any}>{tag}</Badge>
        <span className="num text-[10px] text-muted-foreground">{metric}</span>
      </div>
      <p className="mt-2 text-[12.5px] font-medium leading-snug text-foreground">{title}</p>
      <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{body}</p>
      <div className="mt-3 flex items-center gap-2">
        {href ? (
          <Button size="sm" variant={variant === "primary" ? "default" : "secondary"} className="h-6 px-2 text-[10.5px]" asChild>
            <Link to={href}>{cta}</Link>
          </Button>
        ) : (
          <Button size="sm" variant={variant === "primary" ? "default" : "secondary"} className="h-6 px-2 text-[10.5px]">
            {cta}
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-6 px-2 text-[10.5px]">Why this?</Button>
      </div>
    </div>
  )
}

function ContainmentRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] text-muted-foreground">{label}</span>
        <span className="num text-[11.5px] font-medium text-foreground">{value}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent/80 to-gold"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
