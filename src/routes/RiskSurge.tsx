import {
  AlertTriangle,
  ArrowUpRight,
  CloudLightning,
  Plane,
  Radio,
  Sparkles,
  Users,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ReferenceLine,
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
  { label: "Travelers in storm zone", value: "159", delta: "8 critical care · 14 with claims open", tone: "text-[hsl(var(--severity-critical))]" },
  { label: "Forecast inbound 24h",    value: "+38",  delta: "vs 18 baseline · 211% volume",          tone: "text-[hsl(var(--severity-high))]" },
  { label: "SLA pace",                 value: "96.8%", delta: "−1.4 pts vs steady state",            tone: "text-[hsl(var(--severity-medium))]" },
  { label: "Staffing capacity",        value: "82%",   delta: "Headroom 14/18 agents",               tone: "text-foreground" },
] as const

const CLUSTERS = [
  { code: "CUN", label: "Cancún",        x: 158, y: 138, count: 42, severity: "critical" as const },
  { code: "MIA", label: "Miami transit", x: 200, y: 92,  count: 38, severity: "high"     as const },
  { code: "SDQ", label: "Santo Domingo", x: 282, y: 170, count: 24, severity: "high"     as const },
  { code: "HAV", label: "Havana",        x: 196, y: 138, count: 18, severity: "medium"   as const },
  { code: "SJU", label: "San Juan",      x: 332, y: 168, count: 16, severity: "medium"   as const },
  { code: "NAS", label: "Nassau",        x: 226, y: 118, count: 12, severity: "low"      as const },
  { code: "KIN", label: "Kingston",      x: 238, y: 188, count: 9,  severity: "low"      as const },
]

const FORECAST = [
  { h: "‑8h", actual: 14, forecast: null },
  { h: "‑6h", actual: 16, forecast: null },
  { h: "‑4h", actual: 18, forecast: null },
  { h: "‑2h", actual: 22, forecast: null },
  { h: "Now", actual: 29, forecast: 29 },
  { h: "+2h", actual: null, forecast: 34 },
  { h: "+4h", actual: null, forecast: 41 },
  { h: "+6h", actual: null, forecast: 48 },
  { h: "+8h", actual: null, forecast: 52 },
  { h: "+12h", actual: null, forecast: 56 },
  { h: "+18h", actual: null, forecast: 48 },
  { h: "+24h", actual: null, forecast: 38 },
]

const AFFECTED = [
  { name: "Marisol R.",  loc: "CUN · Hospital Ángeles", status: "Hospitalized · GoP pending", severity: "critical" as const, action: "Medical · CASE-8821" },
  { name: "James T.",    loc: "CUN · Iberostar Cancún",  status: "Awaiting evac flight",       severity: "high"     as const, action: "Trip support · CASE-8823" },
  { name: "Pär L.",       loc: "SDQ · Hilton Santo Domingo", status: "Flight TPA cancelled",   severity: "high"     as const, action: "Rebook · CASE-8826" },
  { name: "Adaeze N.",   loc: "MIA · Transit FLL",        status: "Rerouted via DFW",          severity: "medium"   as const, action: "Trip support · CASE-8829" },
  { name: "Tomás A.",    loc: "HAV · Hotel Nacional",     status: "Stranded · power out",      severity: "high"     as const, action: "Wellness check · CASE-8831" },
  { name: "Hannah K.",   loc: "SJU · Cruise Carnival",   status: "Cruise route diverted",     severity: "low"      as const, action: "Notify · CASE-8835" },
]

const RECOMMENDATIONS = [
  {
    tag: "Surge",
    title: "Shift 8 agents to LATAM night desk",
    body: "Forecast +38 inbound by 14:00 GMT. Current night desk at 62% capacity; reassignment keeps SLA above 95%.",
    metric: "+8 agents · SLA risk -3.4 pts",
    cta: "Reassign now",
  },
  {
    tag: "Comms",
    title: "Broadcast WhatsApp alert to 159 travelers",
    body: "Templated EN/ES message with local emergency line, hotel waivers, and rebooking link. Auto-translated.",
    metric: "159 recipients",
    cta: "Send broadcast",
  },
  {
    tag: "Partners",
    title: "Pre-authorize Iberostar + Hilton emergency rate",
    body: "Lock partner rates at +12% cap for 96 hours. Prevents post-storm price spikes on rebookings.",
    metric: "Est. $48k saved",
    cta: "Lock rates",
  },
  {
    tag: "Carriers",
    title: "Coordinate AeroMéxico + JetBlue rebook waiver",
    body: "Both carriers offered fee waivers in 2024 storms. Sentinel can request batch rebooking concession.",
    metric: "186 itineraries",
    cta: "Request waiver",
  },
] as const

// ── Page ───────────────────────────────────────────────────────────────
export function RiskSurge() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        <RadarPanel />
        <ForecastPanel />
      </section>
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
        <AffectedList />
        <Recommendations />
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-[hsl(var(--severity-high)/0.18)] blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-[hsl(var(--severity-critical)/0.12)] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Intelligence · Risk & Surge</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <Badge variant="high" className="gap-1.5">
              <CloudLightning className="h-2.5 w-2.5" /> Storm watch · 09:14 GMT
            </Badge>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Tropical storm</span> Esmeralda,
            <br />
            <span className="text-foreground/80">tracking the Yucatán channel.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            159 travelers within forecast cone. Surge protocol engaged at 09:14 — staffing, partner pre-auth,
            and traveler comms recommendations prepared. Volume forecast through next 24 hours.
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

// ── Radar scope ────────────────────────────────────────────────────────
function RadarPanel() {
  return (
    <Card elevated className="relative overflow-hidden">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-primary" />
            Operational scope · Caribbean
          </CardTitle>
          <CardDescription>Traveler clusters within storm forecast cone</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Refresh 30s</Badge>
          <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
            Full map <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <svg viewBox="0 0 480 320" className="w-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="rs-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border-soft))" strokeWidth="0.6" />
            </pattern>
            <radialGradient id="storm-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="hsl(var(--severity-critical))" stopOpacity="0.45" />
              <stop offset="60%"  stopColor="hsl(var(--severity-high))"     stopOpacity="0.18" />
              <stop offset="100%" stopColor="hsl(var(--severity-high))"     stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cone-grad" cx="0%" cy="50%" r="100%">
              <stop offset="0%"   stopColor="hsl(var(--severity-high))" stopOpacity="0.32" />
              <stop offset="100%" stopColor="hsl(var(--severity-high))" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="rs-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Grid */}
          <rect width="480" height="320" fill="url(#rs-grid)" />

          {/* Compass rings around HQ marker */}
          {[60, 110, 160, 210].map((r) => (
            <circle key={r} cx="240" cy="160" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.5" />
          ))}

          {/* Storm forecast cone (widening as it moves NW) */}
          <path
            d="M 300 200 L 80 100 L 80 220 Z"
            fill="url(#cone-grad)"
          />
          <text x="92" y="98" className="fill-[hsl(var(--severity-high))]" fontSize="9" fontFamily="Geist Mono">
            +24H FORECAST CONE
          </text>

          {/* Storm zone (current position) */}
          <ellipse cx="200" cy="160" rx="90" ry="62" fill="url(#storm-grad)" />
          <ellipse cx="200" cy="160" rx="46" ry="32" fill="hsl(var(--severity-critical))" fillOpacity="0.18" />

          {/* Storm eye */}
          <circle cx="200" cy="160" r="6" fill="none" stroke="hsl(var(--severity-critical))" strokeWidth="1.2">
            <animate attributeName="r" values="6;10;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="200" cy="160" r="3" fill="hsl(var(--severity-critical))" />
          <text x="210" y="155" className="fill-foreground" fontSize="10" fontFamily="Geist Mono" letterSpacing="1">
            ESMERALDA
          </text>
          <text x="210" y="167" className="fill-muted-foreground" fontSize="8" fontFamily="Geist Mono">
            CAT 2 · 105 mph · 18°N 86°W
          </text>

          {/* Sweep line (slowly rotating around storm eye) */}
          <line x1="200" y1="160" x2="290" y2="160" stroke="url(#rs-sweep)" strokeWidth="2">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 200 160"
              to="360 200 160"
              dur="6s"
              repeatCount="indefinite"
            />
          </line>

          {/* Predicted path */}
          <path
            d="M 200 160 Q 150 130 100 110"
            fill="none"
            stroke="hsl(var(--severity-high))"
            strokeWidth="1.2"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <circle cx="100" cy="110" r="2" fill="hsl(var(--severity-high))" />
          <text x="80" y="100" className="fill-[hsl(var(--severity-high))]" fontSize="8" fontFamily="Geist Mono">
            T+18H
          </text>

          {/* Traveler clusters */}
          {CLUSTERS.map((c) => {
            const r = 4 + Math.sqrt(c.count) * 1.2
            const color =
              c.severity === "critical" ? "hsl(var(--severity-critical))"
              : c.severity === "high"   ? "hsl(var(--severity-high))"
              : c.severity === "medium" ? "hsl(var(--severity-medium))"
              : "hsl(var(--severity-low))"
            return (
              <g key={c.code}>
                <circle cx={c.x} cy={c.y} r={r + 6} fill={color} fillOpacity="0.12">
                  <animate attributeName="r" values={`${r + 6};${r + 12};${r + 6}`} dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx={c.x} cy={c.y} r={r} fill={color} stroke="hsl(var(--background))" strokeWidth="1.2" />
                <text x={c.x + r + 4} y={c.y + 3} className="fill-foreground" fontSize="9" fontFamily="Geist Mono">
                  {c.code}
                </text>
                <text x={c.x + r + 4} y={c.y + 13} className="fill-muted-foreground" fontSize="8" fontFamily="Geist Mono">
                  {c.count}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Legend strip */}
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border-soft pt-3 text-[11px]">
          <Legend dot="bg-[hsl(var(--severity-critical))]" label="Critical care" value="8" />
          <Legend dot="bg-[hsl(var(--severity-high))]"     label="In-zone, support open" value="46" />
          <Legend dot="bg-[hsl(var(--severity-medium))]"   label="Watching" value="62" />
          <Legend dot="bg-[hsl(var(--severity-low))]"      label="Notified" value="43" />
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

// ── Forecast chart ────────────────────────────────────────────────────
function ForecastPanel() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudLightning className="h-3.5 w-3.5 text-[hsl(var(--severity-high))]" />
          Volume forecast · 24h
        </CardTitle>
        <CardDescription>Actual (last 8h) and AI projection (next 24h)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full">
          <ResponsiveContainer>
            <AreaChart data={FORECAST} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="g-actual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-fc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--severity-high))" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--severity-high))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={{ stroke: "hsl(var(--border))" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))", fontFamily: "Geist Mono" }} tickLine={false} axisLine={false} width={28} />
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
              <ReferenceLine x="Now" stroke="hsl(var(--accent))" strokeDasharray="3 3" label={{ value: "Now", fill: "hsl(var(--accent))", fontSize: 10, fontFamily: "Geist Mono", position: "top" }} />
              <Area type="monotone" dataKey="actual"   stroke="hsl(var(--primary))"          strokeWidth={1.5} fill="url(#g-actual)" />
              <Area type="monotone" dataKey="forecast" stroke="hsl(var(--severity-high))"    strokeWidth={1.5} strokeDasharray="4 4" fill="url(#g-fc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border-soft bg-border-soft text-center">
          <Tile label="Peak load" value="56" sub="at +12h" />
          <Tile label="Δ vs baseline" value="+211%" sub="surge factor" tone="text-[hsl(var(--severity-high))]" />
          <Tile label="Forecast conf." value="92%" sub="historical fit" tone="text-[hsl(var(--severity-low))]" />
        </div>
      </CardContent>
    </Card>
  )
}

function Tile({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: string }) {
  return (
    <div className="bg-[hsl(var(--background-elevated))] px-3 py-2.5">
      <div className="label-cap">{label}</div>
      <div className={cn("mt-0.5 num text-[16px] font-medium text-foreground", tone)}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  )
}

// ── Affected travelers ────────────────────────────────────────────────
function AffectedList() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary" />
            Affected travelers
          </CardTitle>
          <CardDescription>Highest-priority subset · full list 159</CardDescription>
        </div>
        <Badge variant="critical">8 critical</Badge>
      </CardHeader>
      <ul className="divide-y divide-border-soft">
        {AFFECTED.map((t, i) => (
          <li
            key={t.name + i}
            className="rise grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3"
            style={{ animationDelay: `${200 + i * 50}ms` }}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary/60 ring-1 ring-border text-[10px] font-medium text-foreground">
              {t.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-foreground">{t.name}</span>
                <span className="text-[11px] text-muted-foreground">· {t.loc}</span>
              </div>
              <p className="truncate text-[11.5px] text-muted-foreground">{t.status}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={t.severity}>{t.severity}</Badge>
              <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[10.5px]">
                <Plane className="h-3 w-3" /> {t.action.split(" · ")[1]}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ── Recommendations ──────────────────────────────────────────────────
function Recommendations() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Surge protocol · recommended actions
        </CardTitle>
        <CardDescription>4 interventions ranked by impact</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {RECOMMENDATIONS.map((r, i) => (
          <div
            key={r.tag}
            className="rise rounded-md border border-border-soft bg-card/60 p-3"
            style={{ animationDelay: `${200 + i * 70}ms` }}
          >
            <div className="flex items-center justify-between gap-2">
              <Badge variant={r.tag === "Surge" ? "high" : r.tag === "Comms" ? "default" : r.tag === "Partners" ? "accent" : "low"}>
                {r.tag}
              </Badge>
              <span className="num text-[10px] text-muted-foreground">{r.metric}</span>
            </div>
            <p className="mt-2 text-[12.5px] font-medium leading-snug text-foreground">{r.title}</p>
            <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{r.body}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" variant={r.tag === "Surge" ? "default" : r.tag === "Comms" || r.tag === "Carriers" ? "secondary" : "accent"} className="h-6 px-2 text-[10.5px]">
                {r.cta}
              </Button>
              <Button size="sm" variant="ghost" className="h-6 px-2 text-[10.5px]">Why this?</Button>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-md border border-border-soft bg-[hsl(var(--severity-low)/0.06)] px-3 py-2 text-[11px]">
          <AlertTriangle className="h-3 w-3 text-[hsl(var(--severity-low))]" />
          <span className="text-muted-foreground">Combined impact: SLA pace 96.8% → 98.4% · est. savings $48k · 24h staff coverage holds</span>
        </div>
      </CardContent>
    </Card>
  )
}
