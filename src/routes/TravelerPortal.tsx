import {
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileText,
  HeartPulse,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Wifi,
  Battery,
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

const KPIS = [
  { label: "Active portal sessions",   value: "1,284", delta: "App + web",                       tone: "text-foreground" },
  { label: "Self-service deflection",   value: "62%",  delta: "Calls avoided",                   tone: "text-[hsl(var(--severity-low))]" },
  { label: "Median claim submission", value: "3m 12s", delta: "Guided flow",                     tone: "text-foreground" },
  { label: "Traveler NPS",             value: "+72",   delta: "Self-service users",              tone: "text-[hsl(var(--severity-low))]" },
] as const

// ── Page ───────────────────────────────────────────────────────────────
export function TravelerPortal() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Phones />
        <Sidebar />
      </section>
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
            <span className="label-cap">Network · Traveler Portal</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">62% deflection · +72 NPS</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Traveler-side</span>,
            <br />
            <span className="text-foreground/80">guided, self-serve.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Travelers see their case status in real time, file claims with AI-guided document checklists,
            and reach an agent in one tap when they need to. Operations teams see every action immediately on this side.
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

// ── Phones ────────────────────────────────────────────────────────────
function Phones() {
  return (
    <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <PhoneFrame label="Active case">
        <CaseScreen />
      </PhoneFrame>
      <PhoneFrame label="New claim · guided">
        <ClaimScreen />
      </PhoneFrame>
    </div>
  )
}

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-sm border border-border bg-[hsl(var(--background-elevated))] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="rounded-[36px] border border-border bg-[hsl(222_30%_5%)] p-2 shadow-[0_24px_60px_-20px_hsl(0_0%_0%/0.8),inset_0_1px_0_0_hsl(36_25%_94%/0.04)]">
        <div className="relative overflow-hidden rounded-[28px] bg-[hsl(222_42%_6%)] ring-1 ring-border-soft">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pb-1.5 pt-3 text-[10px] text-foreground/80">
            <span className="num">10:42</span>
            <div className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-[hsl(222_30%_5%)]" />
            <div className="flex items-center gap-1.5">
              <Wifi className="h-2.5 w-2.5" />
              <Battery className="h-3 w-3" />
            </div>
          </div>
          <div className="h-[520px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function CaseScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* Top app bar */}
      <div className="flex items-center justify-between border-b border-border-soft px-4 pb-3 pt-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3 text-primary" />
          <span className="font-display text-[13px] text-foreground">Sentinel</span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/80 text-[9px] font-medium">MR</div>
      </div>

      {/* Greeting + status hero */}
      <div className="space-y-2 bg-gradient-to-br from-[hsl(var(--severity-low)/0.12)] to-transparent px-4 py-3">
        <span className="label-cap text-[8.5px]">Your case</span>
        <h3 className="font-display text-[20px] leading-tight tracking-tight text-foreground">
          You're <span className="font-display-italic gradient-headline">covered</span>.
        </h3>
        <p className="text-[10.5px] text-muted-foreground">
          Hospital confirmed — treatment continues. We'll keep you updated here.
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Badge variant="low" className="gap-1 text-[8.5px]">
            <CheckCircle2 className="h-2 w-2" /> GoP issued
          </Badge>
          <Badge variant="outline" className="text-[8.5px]">CASE-8821</Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
        <span className="label-cap text-[8.5px]">Today</span>
        {[
          { time: "07:48", label: "Guarantee of Payment confirmed", tone: "low" as const,    done: true },
          { time: "07:24", label: "Sentinel agent Carmen called you", tone: "primary" as const, done: true },
          { time: "07:18", label: "Case opened by Sentinel",          tone: "accent" as const,  done: true },
          { time: "07:14", label: "You messaged on WhatsApp",         tone: "muted" as const,   done: true },
        ].map((e, i) => (
          <div key={i} className="flex items-start gap-2 rounded-md border border-border-soft bg-card/40 px-2.5 py-2">
            <span
              className={cn(
                "mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full",
                e.tone === "low"     && "bg-[hsl(var(--severity-low))]",
                e.tone === "primary" && "bg-primary",
                e.tone === "accent"  && "bg-accent",
                e.tone === "muted"   && "bg-muted-foreground/60",
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-foreground">{e.label}</p>
              <p className="num text-[9.5px] text-muted-foreground">{e.time}</p>
            </div>
          </div>
        ))}

        <span className="label-cap mt-3 inline-block text-[8.5px]">Your documents</span>
        {[
          { name: "Admission record", status: "received" as const },
          { name: "CT abdomen report", status: "received" as const },
          { name: "Treatment plan", status: "pending" as const },
        ].map((d) => (
          <div key={d.name} className="flex items-center gap-2 rounded-md border border-border-soft bg-card/40 px-2.5 py-1.5">
            <FileText className="h-3 w-3 text-primary" />
            <span className="flex-1 text-[10.5px] text-foreground">{d.name}</span>
            <Badge variant={d.status === "received" ? "low" : "high"} className="h-3.5 px-1 py-0 text-[8.5px]">
              {d.status}
            </Badge>
          </div>
        ))}
      </div>

      {/* Bottom action bar */}
      <div className="grid grid-cols-3 gap-1.5 border-t border-border-soft bg-card/40 p-3">
        <button className="flex flex-col items-center gap-1 rounded-md bg-primary/12 px-2 py-1.5 text-primary">
          <MessageCircle className="h-3 w-3" />
          <span className="text-[9px]">Message</span>
        </button>
        <button className="flex flex-col items-center gap-1 rounded-md border border-border-soft px-2 py-1.5 text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span className="text-[9px]">Call ops</span>
        </button>
        <button className="flex flex-col items-center gap-1 rounded-md border border-border-soft px-2 py-1.5 text-muted-foreground">
          <Upload className="h-3 w-3" />
          <span className="text-[9px]">Upload</span>
        </button>
      </div>
    </div>
  )
}

function ClaimScreen() {
  return (
    <div className="flex h-full flex-col">
      {/* Top app bar */}
      <div className="flex items-center justify-between border-b border-border-soft px-4 pb-3 pt-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="font-display text-[13px] text-foreground">New claim</span>
        </div>
        <span className="num text-[9.5px] text-muted-foreground">Step 2 / 3</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 px-4 pt-3">
        {[true, true, false].map((done, i) => (
          <span
            key={i}
            className={cn(
              "h-0.5 flex-1 rounded-full",
              done ? "bg-accent" : "bg-secondary"
            )}
          />
        ))}
      </div>

      {/* Heading */}
      <div className="space-y-1 px-4 py-3">
        <span className="label-cap text-[8.5px]">AI-classified</span>
        <h3 className="font-display text-[18px] leading-tight tracking-tight text-foreground">
          Baggage delay · <span className="font-display-italic gradient-headline">TP523</span>
        </h3>
        <p className="text-[10.5px] text-muted-foreground">
          We've matched your itinerary. Add a few documents and we'll handle the rest.
        </p>
      </div>

      {/* Checklist */}
      <div className="flex-1 space-y-2 overflow-y-auto px-4 pb-3">
        <span className="label-cap text-[8.5px]">Required</span>
        {[
          { name: "Boarding pass", status: "done" as const, hint: "Auto-imported from app" },
          { name: "PIR baggage report", status: "done" as const, hint: "TAP delivered" },
          { name: "Receipts for replacement items", status: "active" as const, hint: "Up to $500" },
          { name: "Photo of delayed luggage tag", status: "todo" as const, hint: "Optional but speeds approval" },
        ].map((d) => (
          <div
            key={d.name}
            className={cn(
              "rounded-md border px-2.5 py-2",
              d.status === "done"   && "border-[hsl(var(--severity-low)/0.3)] bg-[hsl(var(--severity-low)/0.06)]",
              d.status === "active" && "border-accent/30 bg-accent/8",
              d.status === "todo"   && "border-border-soft bg-card/40",
            )}
          >
            <div className="flex items-center gap-2">
              {d.status === "done" ? (
                <CheckCircle2 className="h-3 w-3 text-[hsl(var(--severity-low))]" />
              ) : d.status === "active" ? (
                <CircleDot className="h-3 w-3 text-accent" />
              ) : (
                <span className="h-3 w-3 rounded-full border border-muted-foreground/40" />
              )}
              <span className="flex-1 text-[10.5px] font-medium text-foreground">{d.name}</span>
              {d.status === "active" ? (
                <Badge variant="accent" className="h-3.5 px-1 py-0 text-[8.5px]">Now</Badge>
              ) : null}
            </div>
            <p className="ml-5 mt-1 text-[9px] text-muted-foreground">{d.hint}</p>
          </div>
        ))}

        {/* Upload tile */}
        <div className="mt-2 rounded-md border border-dashed border-border bg-secondary/30 p-3 text-center">
          <Upload className="mx-auto h-4 w-4 text-accent" />
          <p className="mt-1.5 text-[10.5px] text-foreground">Tap to upload receipts</p>
          <p className="text-[9px] text-muted-foreground">PDF · JPG · HEIC · up to 10 files</p>
        </div>

        {/* AI hint */}
        <div className="flex items-start gap-2 rounded-md border border-border-soft bg-card/40 p-2">
          <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
          <p className="text-[9.5px] leading-snug text-muted-foreground">
            Approved claims under $500 usually settle the same day. Three receipts so far — looking good.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-border-soft bg-card/40 p-3">
        <button className="flex w-full items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-[11px] font-medium text-accent-foreground">
          Continue · review
          <ChevronRight className="h-3 w-3" />
        </button>
        <p className="mt-1 text-center text-[9px] text-muted-foreground">Estimated payout · $312–$420</p>
      </div>
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <div className="space-y-5">
      <Card elevated>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5 text-primary" />
            What travelers do here
          </CardTitle>
          <CardDescription>Top 5 self-service actions · 24h</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {[
            { label: "Track active case",            count: 4280, pct: 84 },
            { label: "Submit new claim (guided)",    count: 612,  pct: 28 },
            { label: "Upload documents",             count: 1840, pct: 52 },
            { label: "Find nearby provider",         count: 384,  pct: 18 },
            { label: "Tap-to-call agent",            count: 142,  pct: 8  },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="text-foreground">{r.label}</span>
                <span className="num text-muted-foreground">{r.count.toLocaleString()}</span>
              </div>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary/60">
                <div className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary" style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card elevated>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-3.5 w-3.5 text-accent" />
            Live activity
          </CardTitle>
          <CardDescription>Last 90 seconds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { who: "Lina B. · DE",    action: "Claim CLM-77104 submitted",       tone: "accent" as const, time: "12s" },
            { who: "Marisol R. · MX", action: "Opened case timeline",            tone: "primary" as const, time: "26s" },
            { who: "Diego P. · PE",   action: "Uploaded oxygen-sat trend",       tone: "primary" as const, time: "48s" },
            { who: "Yuki M. · IS",    action: "Confirmed surgery consent",       tone: "low" as const,    time: "1m 12s" },
            { who: "Sofia C. · PT",   action: "Marked baggage received",         tone: "low" as const,    time: "1m 24s" },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-2 rounded-md border border-border-soft bg-card/40 px-3 py-2">
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  e.tone === "accent"  && "bg-accent",
                  e.tone === "primary" && "bg-primary",
                  e.tone === "low"     && "bg-[hsl(var(--severity-low))]",
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] text-foreground">{e.action}</p>
                <p className="text-[10px] text-muted-foreground">{e.who}</p>
              </div>
              <span className="num text-[10px] text-muted-foreground">{e.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card elevated>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Plane className="h-3.5 w-3.5 text-primary" />
            <span className="label-cap">Tip for ops</span>
          </div>
          <p className="text-[12px] text-foreground">
            Every traveler action lands on this side instantly. Live activity feeds the inbox; uploads route through
            document intelligence; new claims enter the auto-adjudication pipeline within seconds.
          </p>
          <Button size="sm" variant="ghost" className="-ml-2 gap-1 text-[11px]">
            <MapPin className="h-3 w-3" /> See full traveler journey
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
