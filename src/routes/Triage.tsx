import { useEffect, useState } from "react"
import {
  Activity,
  ArrowRight,
  Bot,
  ChevronRight,
  CircleDot,
  Globe2,
  HeartPulse,
  Languages,
  Loader2,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
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
import { ChannelChip, type Channel } from "@/components/widgets/ChannelChip"
import { UrgencyMeter } from "@/components/widgets/UrgencyMeter"
import { Sparkline } from "@/components/widgets/Sparkline"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────────────
const THROUGHPUT = Array.from({ length: 24 }, (_, i) => {
  const base = 18 + Math.sin(i / 2) * 6 + i * 0.6
  return {
    h: `${String((i + 10) % 24).padStart(2, "0")}:00`,
    inbound: Math.round(base + 4 + Math.random() * 4),
    classified: Math.round(base + 2),
    routed: Math.round(base - 1 + Math.random() * 2),
  }
})

const CATEGORIES = [
  { key: "medical",   label: "Medical Assistance", pct: 32, count: 412, tone: "critical", spark: [12, 14, 18, 22, 25, 26, 30, 33, 31, 35, 38, 42] },
  { key: "trip",      label: "Trip Interruption",  pct: 22, count: 284, tone: "high",     spark: [22, 21, 24, 23, 26, 28, 29, 32, 30, 34, 35, 32] },
  { key: "baggage",   label: "Baggage / Delay",    pct: 18, count: 232, tone: "medium",   spark: [16, 18, 19, 17, 20, 22, 23, 21, 25, 24, 26, 24] },
  { key: "cancel",    label: "Cancellation",       pct: 14, count: 180, tone: "low",      spark: [10, 12, 11, 13, 14, 15, 14, 17, 16, 18, 17, 19] },
  { key: "evac",      label: "Repatriation / Evac", pct: 8, count: 102, tone: "critical", spark: [4, 6, 5, 7, 8, 6, 9, 8, 10, 9, 11, 12] },
  { key: "other",     label: "Other",              pct: 6, count: 78,  tone: "secondary", spark: [3, 4, 4, 5, 4, 6, 5, 5, 7, 6, 6, 7] },
] as const

type Severity = "critical" | "high" | "medium" | "low"

interface Intake {
  id: string
  channel: Channel
  traveler: string
  location: string
  language: string
  policy: string
  message: string
  category: string
  categoryTone: "critical" | "high" | "medium" | "low" | "accent"
  urgency: number
  severity: Severity
  receivedAgo: string
  status: "live" | "queued" | "routed" | "auto-cleared"
  nextAction?: string
}

const FEED: Intake[] = [
  {
    id: "IN-44218",
    channel: "voice",
    traveler: "Henrik J.",
    location: "Bangkok, TH",
    language: "EN",
    policy: "GOLD-1820",
    message: "Motorcycle accident on Sukhumvit Road. Local hospital can stabilize but recommends evac to Bumrungrad. He sounds disoriented.",
    category: "Medical evacuation",
    categoryTone: "critical",
    urgency: 88,
    severity: "critical",
    receivedAgo: "2m ago",
    status: "queued",
    nextAction: "Route to evac desk · Pre-auth $42k",
  },
  {
    id: "IN-44216",
    channel: "email",
    traveler: "Aisha O.",
    location: "Rome, IT",
    language: "EN",
    policy: "PLAT-2400",
    message: "My husband was admitted to Gemelli ER overnight with chest pain. They're asking how the hospital bill will be covered.",
    category: "Hospital admission",
    categoryTone: "high",
    urgency: 76,
    severity: "high",
    receivedAgo: "5m ago",
    status: "queued",
    nextAction: "Issue GoP · Notify medical desk",
  },
  {
    id: "IN-44213",
    channel: "whatsapp",
    traveler: "Sofia C.",
    location: "Lisbon, PT",
    language: "PT → EN",
    policy: "SILV-1010",
    message: "TP123 chegou sem a minha bagagem. Tenho medicação de tiroide lá dentro, preciso recuperar urgente.",
    category: "Baggage delay · medication",
    categoryTone: "high",
    urgency: 71,
    severity: "high",
    receivedAgo: "9m ago",
    status: "routed",
    nextAction: "Provider outreach to TAP baggage ops",
  },
  {
    id: "IN-44211",
    channel: "portal",
    traveler: "Diego P.",
    location: "Cusco, PE",
    language: "ES → EN",
    policy: "GOLD-1820",
    message: "Severe altitude sickness, in ICU at Clínica Pardo. Wife requesting medical assistance.",
    category: "ICU admission",
    categoryTone: "critical",
    urgency: 84,
    severity: "high",
    receivedAgo: "12m ago",
    status: "routed",
    nextAction: "Open medical case · Provider on-call",
  },
  {
    id: "IN-44209",
    channel: "app",
    traveler: "Lina B.",
    location: "Berlin, DE",
    language: "DE → EN",
    policy: "SILV-1010",
    message: "Mein Koffer ist seit 36 Stunden nicht aufgetaucht. Ich brauche Erstattung für Kleidung und Hygieneartikel.",
    category: "Baggage reimbursement",
    categoryTone: "low",
    urgency: 28,
    severity: "low",
    receivedAgo: "21m ago",
    status: "auto-cleared",
    nextAction: "Auto-adjudicated · $420 approved",
  },
  {
    id: "IN-44207",
    channel: "sms",
    traveler: "Kemal A.",
    location: "Istanbul, TR",
    language: "TR → EN",
    policy: "SILV-1010",
    message: "Acil aile durumu — gezimi iptal etmem gerekiyor. Geri ödeme nasıl olacak?",
    category: "Trip cancellation",
    categoryTone: "medium",
    urgency: 45,
    severity: "medium",
    receivedAgo: "26m ago",
    status: "queued",
    nextAction: "Verify policy · Request documentation",
  },
]

// The hero "live" intake — animated reasoning trail
const LIVE: Intake = {
  id: "IN-44221",
  channel: "whatsapp",
  traveler: "Marisol R.",
  location: "Mexico City, MX",
  language: "ES → EN",
  policy: "PLAT-2400",
  message:
    "Estoy en el hospital aquí en CDMX, me ingresaron anoche. El hospital necesita confirmación de pago AHORA o no continúan con el tratamiento. Por favor ayúdenme.",
  category: "Hospital admission · GoP needed",
  categoryTone: "critical",
  urgency: 92,
  severity: "critical",
  receivedAgo: "12s ago",
  status: "live",
  nextAction: "Open medical workflow · Pre-auth $14.2k",
}

const REASONING = [
  { icon: Languages,    label: "Language detected", value: "Spanish → English (98%)" },
  { icon: MapPin,       label: "Geolocation",       value: "Mexico City, MX · IP + phone + policy match" },
  { icon: HeartPulse,   label: "Category",          value: "Medical · Hospital admission · GoP request" },
  { icon: ShieldCheck,  label: "Policy coverage",   value: "PLAT-2400 · in-network, eligible" },
  { icon: Activity,     label: "Provider history",  value: "3 prior settlements with Hospital Ángeles, avg ‑18% vs benchmark" },
  { icon: Zap,          label: "Urgency score",     value: "92 / 100 · CRITICAL" },
] as const

// ── Page ───────────────────────────────────────────────────────────────
export function Triage() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <LiveAnalysis />
          <TriageFeed />
        </div>
        <aside className="space-y-5">
          <ThroughputCard />
          <CategoryMixCard />
          <RoutingCard />
        </aside>
      </section>
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -bottom-32 right-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Intelligence · Triage</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">Co-pilot online · 312ms median</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Triage</span> in flight,
            <br />
            <span className="text-foreground/80">routing</span>{" "}
            <span className="num text-foreground">1,288</span>{" "}
            <span className="text-foreground/80">inbound today.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Every voice call, WhatsApp message, email, portal submission, and app event is classified, scored,
            and routed in under a second. Human agents only see what genuinely needs them.
          </p>
        </div>

        <div className="rise grid grid-cols-2 gap-px self-end rounded-md border border-border bg-border-soft" style={{ animationDelay: "120ms" }}>
          {[
            { label: "Inbound (24h)",   value: "1,288", delta: "+12% vs avg",   tone: "text-foreground" },
            { label: "Auto-routed",     value: "82%",   delta: "+4 pts WoW",     tone: "text-[hsl(var(--severity-low))]" },
            { label: "Median triage",   value: "312ms", delta: "AI latency",      tone: "text-foreground" },
            { label: "Escalated human", value: "186",   delta: "14% of inbound",  tone: "text-[hsl(var(--severity-high))]" },
          ].map((kpi) => (
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

// ── Live analysis (the demo moment) ────────────────────────────────────
function LiveAnalysis() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= REASONING.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 650)
    return () => clearTimeout(t)
  }, [step])

  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--severity-critical)/0.06)] via-transparent to-[hsl(var(--accent)/0.06)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[hsl(var(--severity-critical))] to-transparent" />

      <CardHeader className="relative space-y-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="beacon h-2 w-2 rounded-full bg-[hsl(var(--severity-critical))] text-[hsl(var(--severity-critical))]" />
            <div>
              <CardTitle className="flex items-center gap-2 text-[13px]">
                Live intake · classifying now
                <Loader2 className="h-3 w-3 animate-spin text-[hsl(var(--severity-critical))]" />
              </CardTitle>
              <CardDescription>Sentinel co-pilot is reading message in real time</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ChannelChip channel={LIVE.channel} />
            <Badge variant="critical">CRITICAL · 92</Badge>
            <span className="num text-[10px] text-muted-foreground">{LIVE.receivedAgo}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Message + meta */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/5 ring-1 ring-accent/30 text-[11px] font-medium text-accent">
              MR
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-baseline gap-2">
                <span className="text-[13.5px] font-medium text-foreground">{LIVE.traveler}</span>
                <span className="num text-[10.5px] text-muted-foreground">{LIVE.id}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {LIVE.location} · {LIVE.language} · Policy {LIVE.policy}
              </div>
            </div>
          </div>

          <blockquote className="relative rounded-md border border-border-soft bg-card/60 p-4">
            <span className="absolute -top-2 left-3 bg-[hsl(var(--background-elevated))] px-1.5 font-display text-[26px] leading-none text-muted-foreground/40">
              "
            </span>
            <p className="font-display-italic text-[15px] leading-snug text-foreground/95">
              {LIVE.message}
            </p>
            <p className="mt-3 border-t border-border-soft pt-3 text-[11.5px] text-muted-foreground">
              <span className="label-cap mr-1">English</span>
              "I'm in the hospital here in Mexico City, they admitted me last night. The hospital needs payment confirmation NOW or they won't continue treatment. Please help."
            </p>
          </blockquote>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="gap-1.5">
              <HeartPulse className="h-3 w-3" /> Open medical workflow
            </Button>
            <Button size="sm" variant="accent" className="gap-1.5">
              <ShieldCheck className="h-3 w-3" /> Approve GoP $14.2k
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> Why this?
            </Button>
          </div>
        </div>

        {/* Reasoning trail */}
        <div className="rounded-md border border-border-soft bg-[hsl(var(--background)/0.6)] p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-accent" />
              <span className="label-cap">Reasoning trail · v3.2</span>
            </div>
            <span className="num text-[10px] text-muted-foreground">312 ms</span>
          </div>
          <ul className="space-y-2.5">
            {REASONING.map((r, i) => {
              const done = i < step
              const active = i === step
              return (
                <li
                  key={r.label}
                  className={cn(
                    "flex items-start gap-3 transition-opacity",
                    done ? "opacity-100" : active ? "opacity-100" : "opacity-30"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      done
                        ? "border-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low))/0.15]"
                        : active
                        ? "border-accent bg-accent/10"
                        : "border-border bg-secondary/40"
                    )}
                  >
                    {done ? (
                      <CircleDot className="h-2 w-2 text-[hsl(var(--severity-low))]" />
                    ) : active ? (
                      <Loader2 className="h-2 w-2 animate-spin text-accent" />
                    ) : (
                      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <r.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="label-cap">{r.label}</span>
                    </div>
                    <p className={cn(
                      "mt-0.5 text-[12px] leading-snug",
                      done || active ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {r.value}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="mt-4 flex items-center gap-2 border-t border-border-soft pt-3 text-[11px]">
            <span className="label-cap">Next step</span>
            <span className="text-foreground">{LIVE.nextAction}</span>
            <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Feed ──────────────────────────────────────────────────────────────
function TriageFeed() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Intake stream</CardTitle>
          <CardDescription>Last 30 minutes · grouped by recency</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Auto-refresh 5s</Badge>
          <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
            Open full feed <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <ul className="divide-y divide-border-soft">
        {FEED.map((it, i) => (
          <li
            key={it.id}
            className="rise grid grid-cols-[auto_1fr_180px] gap-4 px-5 py-4"
            style={{ animationDelay: `${200 + i * 60}ms` }}
          >
            <div className="flex flex-col items-start gap-1.5 pt-0.5">
              <ChannelChip channel={it.channel} />
              <span className="num text-[10px] text-muted-foreground/80">{it.receivedAgo}</span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-[13px] font-medium text-foreground">{it.traveler}</span>
                <span className="text-[11px] text-muted-foreground">· {it.location}</span>
                <span className="num text-[10px] text-muted-foreground/70">{it.id}</span>
                <Badge variant="outline" className="ml-1">{it.language}</Badge>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[12px] leading-snug text-muted-foreground">
                "{it.message}"
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant={it.categoryTone}>{it.category}</Badge>
                <span className="num text-[10.5px] text-muted-foreground">Policy {it.policy}</span>
                <span className={cn(
                  "label-cap",
                  it.status === "live" && "text-[hsl(var(--severity-critical))]",
                  it.status === "auto-cleared" && "text-[hsl(var(--severity-low))]",
                  it.status === "routed" && "text-accent",
                )}>
                  {it.status === "auto-cleared" ? "Auto-cleared" : it.status === "routed" ? "Routed" : it.status === "live" ? "Live" : "Queued"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between gap-2">
              <UrgencyMeter score={it.urgency} className="w-[150px]" size="sm" />
              <div className="text-right text-[11px] leading-snug">
                <span className="label-cap text-[9px]">Next</span>
                <p className="text-foreground/90">{it.nextAction}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// ── Side panels ───────────────────────────────────────────────────────
function ThroughputCard() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Triage throughput
          </CardTitle>
          <CardDescription>24-hour window · 10 min buckets</CardDescription>
        </div>
        <Badge variant="default">Live</Badge>
      </CardHeader>
      <CardContent>
        <div className="h-[150px] w-full">
          <ResponsiveContainer>
            <AreaChart data={THROUGHPUT} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="g-in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-rt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="hsl(var(--accent))"  stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(var(--accent))"  stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" hide />
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
              <Area
                type="monotone"
                dataKey="inbound"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill="url(#g-in)"
              />
              <Area
                type="monotone"
                dataKey="routed"
                stroke="hsl(var(--accent))"
                strokeWidth={1.5}
                fill="url(#g-rt)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <Legend dot="bg-primary" label="Inbound" value="1,288" />
          <Legend dot="bg-accent" label="Routed" value="1,056" />
          <Legend dot="bg-[hsl(var(--severity-high))]" label="To human" value="186" />
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

function CategoryMixCard() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe2 className="h-3.5 w-3.5 text-accent" />
          Category mix
        </CardTitle>
        <CardDescription>Auto-classified today</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2.5">
          {CATEGORIES.map((c) => (
            <li key={c.key} className="flex items-center gap-3">
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  c.tone === "critical" && "bg-[hsl(var(--severity-critical))]",
                  c.tone === "high"     && "bg-[hsl(var(--severity-high))]",
                  c.tone === "medium"   && "bg-[hsl(var(--severity-medium))]",
                  c.tone === "low"      && "bg-[hsl(var(--severity-low))]",
                  c.tone === "secondary" && "bg-muted-foreground/60"
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-[12px] text-foreground">{c.label}</span>
                  <span className="num text-[11px] text-muted-foreground">{c.pct}%</span>
                </div>
              </div>
              <Sparkline
                data={[...c.spark]}
                width={56}
                height={16}
                color={
                  c.tone === "critical" ? "hsl(var(--severity-critical))"
                  : c.tone === "high"   ? "hsl(var(--severity-high))"
                  : c.tone === "medium" ? "hsl(var(--severity-medium))"
                  : c.tone === "low"    ? "hsl(var(--severity-low))"
                  : "hsl(var(--muted-foreground))"
                }
              />
              <span className="num w-10 text-right text-[11px] text-foreground">{c.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function RoutingCard() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
          Where they're going
        </CardTitle>
        <CardDescription>Last 60 minutes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {[
          { dest: "Medical desk · LATAM",   count: 18, tone: "critical" as const },
          { dest: "Medical desk · EMEA",    count: 14, tone: "high"     as const },
          { dest: "Evac coordination",       count: 6,  tone: "critical" as const },
          { dest: "Claims auto-adjudication", count: 27, tone: "low"     as const },
          { dest: "Provider outreach",       count: 9,  tone: "medium"   as const },
          { dest: "Human review queue",      count: 8,  tone: "high"     as const },
        ].map((r) => (
          <div
            key={r.dest}
            className="flex items-center justify-between rounded-md border border-border-soft bg-card/40 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  r.tone === "critical" && "bg-[hsl(var(--severity-critical))]",
                  r.tone === "high"     && "bg-[hsl(var(--severity-high))]",
                  r.tone === "medium"   && "bg-[hsl(var(--severity-medium))]",
                  r.tone === "low"      && "bg-[hsl(var(--severity-low))]",
                )}
              />
              <span className="text-[12px] text-foreground">{r.dest}</span>
            </div>
            <span className="num text-[12px] font-medium text-foreground">{r.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
