import { useEffect, useState } from "react"
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FileCheck2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Wallet,
  XCircle,
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
  { label: "Claims in queue",      value: "184",  delta: "62% auto-adjudicated",   tone: "text-[hsl(var(--severity-low))]" },
  { label: "Auto-approved today",  value: "114",  delta: "$92,140 disbursed",       tone: "text-foreground" },
  { label: "Median time-to-pay",   value: "4m 12s", delta: "−38% vs Q1",            tone: "text-[hsl(var(--severity-low))]" },
  { label: "Sent to human review", value: "23",   delta: "Complex / high value",    tone: "text-[hsl(var(--severity-high))]" },
] as const

const LIVE = {
  id: "CLM-77104",
  traveler: "Lina B.",
  origin: "Berlin → Lisbon (TP523)",
  policy: "SILV-1010",
  type: "Baggage delay reimbursement",
  amount: "$420.00",
  receivedAgo: "23s ago",
}

const RULES = [
  { icon: ShieldCheck, label: "Policy active",         result: "SILV-1010 · in coverage window · baggage covered up to $1,500" },
  { icon: FileCheck2,  label: "Documents complete",    result: "Boarding pass · PIR baggage report · 4 receipts · all verified" },
  { icon: ShieldCheck, label: "Duplicate check",       result: "No prior claim on this trip · last 90 days clean" },
  { icon: Wallet,      label: "Auto-approve threshold", result: "$420 < $500 · within tier · pre-cleared" },
  { icon: Bot,         label: "Fraud risk score",      result: "0.04 / 1.00 · no anomalies · clean signature" },
  { icon: CheckCircle2,label: "Decision",              result: "APPROVED · $420 disbursement scheduled · portal updated" },
] as const

type Status = "auto-approved" | "auto-paid" | "auto-cleared" | "in-review" | "human" | "denied"

interface Claim {
  id: string
  traveler: string
  type: string
  amount: string
  policy: string
  age: string
  status: Status
  decision: string
}

const QUEUE: Claim[] = [
  { id: "CLM-77104", traveler: "Lina B.",     type: "Baggage delay",        amount: "$420",     policy: "SILV-1010", age: "23s",  status: "auto-approved", decision: "Auto-approve · live" },
  { id: "CLM-77098", traveler: "Sofia C.",    type: "Trip delay > 12h",      amount: "$1,200",   policy: "GOLD-1820", age: "4m",   status: "auto-paid",     decision: "Auto-paid · paid out" },
  { id: "CLM-77091", traveler: "Yuki M.",     type: "ER visit (low value)",  amount: "$890",     policy: "SILV-1010", age: "11m",  status: "auto-paid",     decision: "Auto-paid · paid out" },
  { id: "CLM-77080", traveler: "Kemal A.",    type: "Trip cancellation",     amount: "$3,400",   policy: "SILV-1010", age: "26m",  status: "in-review",     decision: "Awaiting documentation" },
  { id: "CLM-77064", traveler: "Marisol R.",  type: "Hospital admission",    amount: "$14,200",  policy: "PLAT-2400", age: "1h",   status: "human",         decision: "Specialist · GoP issued" },
  { id: "CLM-77051", traveler: "Henrik J.",   type: "Medical evacuation",    amount: "$42,000",  policy: "GOLD-1820", age: "2h",   status: "human",         decision: "Evac desk · pre-auth pending" },
  { id: "CLM-77038", traveler: "—",           type: "Lost personal items",   amount: "$640",     policy: "SILV-1010", age: "3h",   status: "denied",        decision: "Denied · outside coverage" },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Claims() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <LiveAdjudication />
      <Queue />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-[hsl(var(--severity-low)/0.18)] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Operations · Claims</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">Auto-adjudication online</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">62%</span> of claims
            <br />
            <span className="text-foreground/80">settle without a human.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Policy validation, document checklist, duplicate detection, fraud scoring, and disbursement —
            run in sequence on every inbound claim. Complex and high-value claims route to specialists with full context.
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

// ── Live auto-adjudication (the demo moment) ──────────────────────────
function LiveAdjudication() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= RULES.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 700)
    return () => clearTimeout(t)
  }, [step])
  const done = step >= RULES.length

  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--severity-low)/0.06)] via-transparent to-[hsl(var(--primary)/0.06)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[hsl(var(--severity-low))] to-transparent" />

      <CardHeader className="relative space-y-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={cn(
              "beacon h-2 w-2 rounded-full",
              done ? "bg-[hsl(var(--severity-low))] text-[hsl(var(--severity-low))]"
                   : "bg-primary text-primary"
            )} />
            <div>
              <CardTitle className="flex items-center gap-2">
                {done ? "Approved · disbursement scheduled" : "Auto-adjudicating now"}
                {done ? <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--severity-low))]" />
                      : <Loader2 className="h-3 w-3 animate-spin text-primary" />}
              </CardTitle>
              <CardDescription>Sentinel rules engine · v3.2 · 6 checks</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{LIVE.id}</Badge>
            <Badge variant={done ? "low" : "default"}>{done ? "AUTO-APPROVED" : "RUNNING"}</Badge>
            <span className="num text-[10px] text-muted-foreground">{LIVE.receivedAgo}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Claim summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/30 text-[11px] font-medium text-primary">
              LB
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-baseline gap-2">
                <span className="text-[13.5px] font-medium text-foreground">{LIVE.traveler}</span>
                <span className="num text-[10.5px] text-muted-foreground">{LIVE.id}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                {LIVE.origin} · Policy {LIVE.policy}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border-soft bg-border-soft">
            {[
              { label: "Claim type", value: LIVE.type },
              { label: "Amount",     value: LIVE.amount },
              { label: "Trip",       value: "Berlin → Lisbon · TP523" },
              { label: "Delay",      value: "36h baggage / PIR filed" },
            ].map((row) => (
              <div key={row.label} className="bg-card/60 px-3 py-2.5">
                <div className="label-cap">{row.label}</div>
                <div className="mt-0.5 text-[12.5px] text-foreground">{row.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" disabled={!done} className="gap-1.5">
              <Wallet className="h-3 w-3" /> Disburse $420
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> Explain decision
            </Button>
            <Button size="sm" variant="ghost" className="gap-1.5">
              Send to human <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Rules trail */}
        <div className="rounded-md border border-border-soft bg-[hsl(var(--background)/0.6)] p-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span className="label-cap">Rules engine · sequential</span>
            </div>
            <span className="num text-[10px] text-muted-foreground">2.1 s</span>
          </div>
          <ul className="space-y-2.5">
            {RULES.map((r, i) => {
              const passed = i < step
              const active = i === step
              return (
                <li
                  key={r.label}
                  className={cn(
                    "flex items-start gap-3 transition-opacity",
                    passed ? "opacity-100" : active ? "opacity-100" : "opacity-30"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      passed
                        ? "border-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low))/0.15]"
                        : active
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/40"
                    )}
                  >
                    {passed ? (
                      <CircleDot className="h-2 w-2 text-[hsl(var(--severity-low))]" />
                    ) : active ? (
                      <Loader2 className="h-2 w-2 animate-spin text-primary" />
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
                      passed || active ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {r.result}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>

          {done ? (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-[hsl(var(--severity-low)/0.3)] bg-[hsl(var(--severity-low)/0.06)] px-3 py-2 text-[11.5px]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--severity-low))]" />
              <span className="text-foreground">$420 disbursement queued · Traveler portal updated · Audit log entry written</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Queue ─────────────────────────────────────────────────────────────
function Queue() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Claims queue</CardTitle>
          <CardDescription>Most recent · auto-adjudicated, in-review, and escalated</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Last 4 hours</Badge>
          <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
            Open full queue <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <div className="grid grid-cols-[110px_1fr_180px_110px_120px_72px] gap-3 border-b border-border-soft px-5 py-2">
        <span className="label-cap">Claim ID</span>
        <span className="label-cap">Traveler · Type</span>
        <span className="label-cap">Decision</span>
        <span className="label-cap text-right">Amount</span>
        <span className="label-cap">Status</span>
        <span className="label-cap text-right">Age</span>
      </div>
      <ul>
        {QUEUE.map((c, i) => (
          <li
            key={c.id}
            className="rise grid grid-cols-[110px_1fr_180px_110px_120px_72px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
            style={{ animationDelay: `${200 + i * 50}ms` }}
          >
            <span className="num text-[11px] text-muted-foreground">{c.id}</span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium text-foreground">{c.traveler}</span>
                <span className="num text-[10.5px] text-muted-foreground">Policy {c.policy}</span>
              </div>
              <p className="truncate text-[11.5px] text-muted-foreground">{c.type}</p>
            </div>
            <span className="truncate text-[11.5px] text-muted-foreground">{c.decision}</span>
            <span className="num text-right text-[12px] font-medium text-foreground">{c.amount}</span>
            <StatusTag status={c.status} />
            <span className="num text-right text-[11px] text-muted-foreground">{c.age}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function StatusTag({ status }: { status: Status }) {
  const MAP: Record<Status, { label: string; variant: "low" | "default" | "medium" | "high" | "destructive" | "secondary" }> = {
    "auto-approved": { label: "Auto-approve", variant: "low" },
    "auto-paid":     { label: "Auto-paid",    variant: "low" },
    "auto-cleared":  { label: "Auto-cleared", variant: "low" },
    "in-review":     { label: "In review",    variant: "medium" },
    "human":         { label: "Human review", variant: "high" },
    "denied":        { label: "Denied",       variant: "destructive" },
  }
  const m = MAP[status]
  const Icon = status === "denied" ? XCircle : status.startsWith("auto") ? CheckCircle2 : CircleDot
  return (
    <Badge variant={m.variant} className="gap-1">
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </Badge>
  )
}
