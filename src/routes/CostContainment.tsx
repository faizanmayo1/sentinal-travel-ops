import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Receipt,
  ShieldAlert,
  Sparkles,
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
  { label: "Net savings MTD",     value: "$1.84M", delta: "+18% YoY",            tone: "text-[hsl(var(--severity-low))]" },
  { label: "Invoices reviewed",   value: "4,182",  delta: "62% AI-only",          tone: "text-foreground" },
  { label: "Flagged for action",  value: "184",    delta: "$214k under review",  tone: "text-[hsl(var(--severity-high))]" },
  { label: "Avg leakage prevented", value: "9.4%", delta: "Per claim avg",        tone: "text-foreground" },
] as const

interface LineItem {
  code: string
  name: string
  charged: number
  benchmark: number
  flag: "ok" | "warn" | "high"
  note?: string
}

const INVOICE = {
  id: "INV-4471",
  caseId: "CASE-8821",
  traveler: "Marisol Rivera",
  facility: "Hospital Ángeles Pedregal · Mexico City",
  submitted: 21620,
  recommended: 14200,
  saved: 7420,
  uploadedAgo: "8 min ago",
}

const LINES: LineItem[] = [
  { code: "ER-001", name: "Emergency department admission",     charged: 1200,  benchmark: 1150,  flag: "ok" },
  { code: "IM-022", name: "CT abdomen with contrast",            charged: 2800,  benchmark: 1900,  flag: "high",  note: "47% above regional benchmark" },
  { code: "LB-104", name: "Lipase + amylase panel",              charged: 480,   benchmark: 320,   flag: "warn",  note: "50% above benchmark · acceptable" },
  { code: "RX-208", name: "Pantoprazole IV (3 days)",            charged: 920,   benchmark: 410,   flag: "high",  note: "124% above benchmark · negotiation candidate" },
  { code: "RM-301", name: "Private room (2 nights)",             charged: 4800,  benchmark: 3200,  flag: "high",  note: "Tier-1 rate · room downgrade option" },
  { code: "PR-410", name: "Gastroenterology consult x3",         charged: 1800,  benchmark: 1500,  flag: "warn" },
  { code: "PR-411", name: "Hospitalist daily x2",                 charged: 1100,  benchmark: 980,   flag: "ok"   },
  { code: "PR-412", name: "Anesthesia (endoscopy)",              charged: 1450,  benchmark: 1350,  flag: "ok"   },
  { code: "PH-505", name: "IV fluids + electrolytes (bundle)",   charged: 720,   benchmark: 280,   flag: "high",  note: "Duplicate of RX-208 partials" },
  { code: "SP-610", name: "Discharge medications",                charged: 380,   benchmark: 350,   flag: "ok"   },
  { code: "FA-702", name: "Facility surcharge",                  charged: 4500,  benchmark: 1800,  flag: "high",  note: "150% above benchmark · non-itemized" },
  { code: "ADM-9",  name: "Admin / paperwork fee",                charged: 1470,  benchmark: 0,     flag: "high",  note: "Not reimbursable per policy" },
]

const LEDGER = [
  { date: "Today",     provider: "Hospital Ángeles · MX",         caseId: "CASE-8821", submitted: "$21,620", after: "$14,200", saved: "$7,420", status: "Review",     tone: "high"     as const },
  { date: "Today",     provider: "Gemelli · IT",                  caseId: "CASE-8809", submitted: "$22,300", after: "$18,500", saved: "$3,800", status: "Paid",       tone: "low"      as const },
  { date: "Today",     provider: "Bumrungrad · TH",               caseId: "CASE-8814", submitted: "$48,200", after: "$42,000", saved: "$6,200", status: "Paid",       tone: "low"      as const },
  { date: "Yesterday", provider: "Mt. Elizabeth · SG",            caseId: "CASE-8702", submitted: "$58,900", after: "$51,200", saved: "$7,700", status: "Paid",       tone: "low"      as const },
  { date: "Yesterday", provider: "CHU Lyon · FR",                 caseId: "CASE-8688", submitted: "$9,400",  after: "$9,400",  saved: "$0",     status: "No findings", tone: "secondary" as const },
  { date: "Yesterday", provider: "Anonymous clinic · TR",         caseId: "CASE-8651", submitted: "$11,200", after: "$3,800",  saved: "$7,400", status: "Fraud hold",  tone: "destructive" as const },
] as const

// ── Page ───────────────────────────────────────────────────────────────
export function CostContainment() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <InvoiceAnalysis />
      <Ledger />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-[hsl(var(--severity-low)/0.15)] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Intelligence · Cost Containment</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">+18% YoY savings</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">$1.84M</span> saved
            <br />
            <span className="text-foreground/80">this month, without slowing care.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Every hospital invoice is read line-by-line against regional benchmarks. Inflated charges, duplicates,
            and non-reimbursable line items are flagged before payment — and routed to negotiation when worth pursuing.
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

// ── Invoice analysis (the demo moment) ─────────────────────────────────
function InvoiceAnalysis() {
  const highCount = LINES.filter((l) => l.flag === "high").length
  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--severity-high)/0.05)] via-transparent to-[hsl(var(--severity-low)/0.05)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[hsl(var(--severity-high))] to-transparent" />

      <CardHeader className="relative space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[hsl(var(--severity-high)/0.12)] ring-1 ring-[hsl(var(--severity-high)/0.3)]">
              <Receipt className="h-4 w-4 text-[hsl(var(--severity-high))]" />
            </div>
            <div>
              <CardTitle>Live invoice review</CardTitle>
              <CardDescription>{INVOICE.id} · {INVOICE.facility} · {INVOICE.caseId} · {INVOICE.traveler}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="high" className="gap-1.5">
              <ShieldAlert className="h-2.5 w-2.5" /> {highCount} flagged
            </Badge>
            <Badge variant="outline">{INVOICE.uploadedAgo}</Badge>
          </div>
        </div>
      </CardHeader>

      {/* Totals strip */}
      <div className="relative grid grid-cols-1 gap-px border-y border-border-soft bg-border-soft md:grid-cols-3">
        <TotalCell label="Submitted by hospital" value={`$${INVOICE.submitted.toLocaleString()}`} tone="text-foreground" />
        <TotalCell label="After Sentinel review" value={`$${INVOICE.recommended.toLocaleString()}`} tone="text-[hsl(var(--severity-low))]" sub="Recommended payment" />
        <TotalCell label="Containment savings" value={`$${INVOICE.saved.toLocaleString()}`} tone="text-accent" sub={`${Math.round((INVOICE.saved / INVOICE.submitted) * 100)}% leakage prevented`} prominent />
      </div>

      {/* AI summary */}
      <div className="relative flex flex-wrap items-center gap-3 border-b border-border-soft bg-card/40 px-5 py-3">
        <Sparkles className="h-3.5 w-3.5 text-accent" />
        <span className="label-cap">AI summary</span>
        <p className="flex-1 text-[12.5px] text-foreground/90">
          <span className="text-[hsl(var(--severity-high))] font-medium">{highCount} of {LINES.length} line items</span> exceed regional benchmark.
          Top drivers: facility surcharge (+150%), duplicate IV bundle, non-reimbursable admin fee, premium-room charge.
          Hospital has settled 3 prior cases — likely to accept negotiated rate.
        </p>
      </div>

      {/* Line items */}
      <div className="relative">
        <div className="grid grid-cols-[72px_1fr_110px_110px_140px_72px] gap-3 border-b border-border-soft px-5 py-2">
          <span className="label-cap">Code</span>
          <span className="label-cap">Line item</span>
          <span className="label-cap text-right">Charged</span>
          <span className="label-cap text-right">Benchmark</span>
          <span className="label-cap">Variance</span>
          <span className="label-cap text-right">Flag</span>
        </div>
        <ul>
          {LINES.map((l, i) => (
            <li
              key={l.code}
              className="rise grid grid-cols-[72px_1fr_110px_110px_140px_72px] items-center gap-3 border-b border-border-soft/40 px-5 py-2.5 transition-colors last:border-0 hover:bg-secondary/20"
              style={{ animationDelay: `${100 + i * 30}ms` }}
            >
              <span className="num text-[10.5px] text-muted-foreground">{l.code}</span>
              <div className="min-w-0">
                <p className="truncate text-[12.5px] text-foreground">{l.name}</p>
                {l.note ? (
                  <p className="truncate text-[10.5px] text-muted-foreground">{l.note}</p>
                ) : null}
              </div>
              <span className="num text-right text-[12px] text-foreground">${l.charged.toLocaleString()}</span>
              <span className="num text-right text-[12px] text-muted-foreground">
                {l.benchmark === 0 ? "—" : `$${l.benchmark.toLocaleString()}`}
              </span>
              <VarianceBar charged={l.charged} benchmark={l.benchmark} flag={l.flag} />
              <div className="flex justify-end">
                <FlagDot flag={l.flag} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-border-soft bg-card/40 px-5 py-3">
        <span className="text-[11.5px] text-muted-foreground">
          Audit trail · 12 checks · benchmark v2026.Q2 · regional weights applied
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="gap-1.5">
            Approve as-is
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Pause payment
          </Button>
          <Button size="sm" variant="accent" className="gap-1.5">
            <Wallet className="h-3 w-3" /> Open negotiation
          </Button>
        </div>
      </div>
    </Card>
  )
}

function TotalCell({
  label,
  value,
  tone,
  sub,
  prominent,
}: {
  label: string
  value: string
  tone: string
  sub?: string
  prominent?: boolean
}) {
  return (
    <div className="bg-[hsl(var(--background-elevated))] px-5 py-4">
      <span className="label-cap">{label}</span>
      <div
        className={cn(
          "mt-1 num leading-none tracking-tight",
          prominent ? "text-[32px] font-medium" : "text-[22px] font-medium",
          tone
        )}
      >
        {value}
      </div>
      {sub ? <div className="mt-1.5 text-[10.5px] text-muted-foreground">{sub}</div> : null}
    </div>
  )
}

function VarianceBar({
  charged,
  benchmark,
  flag,
}: {
  charged: number
  benchmark: number
  flag: LineItem["flag"]
}) {
  if (benchmark === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="num text-[11px] text-[hsl(var(--severity-critical))]">non-cov</span>
      </div>
    )
  }
  const pct = ((charged - benchmark) / benchmark) * 100
  const width = Math.min(Math.abs(pct), 100)
  const color =
    flag === "high"  ? "bg-[hsl(var(--severity-critical))]"
    : flag === "warn" ? "bg-[hsl(var(--severity-medium))]"
    : "bg-[hsl(var(--severity-low))]"
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-secondary/60">
        <span className={cn("absolute inset-y-0 left-0 rounded-full", color)} style={{ width: `${width}%` }} />
        <span className="absolute top-0 h-full w-px bg-foreground/30" style={{ left: "50%" }} />
      </div>
      <span
        className={cn(
          "num text-[11px]",
          flag === "high"  && "text-[hsl(var(--severity-critical))]",
          flag === "warn"  && "text-[hsl(var(--severity-medium))]",
          flag === "ok"    && "text-muted-foreground"
        )}
      >
        {pct >= 0 ? "+" : ""}{Math.round(pct)}%
      </span>
    </div>
  )
}

function FlagDot({ flag }: { flag: LineItem["flag"] }) {
  if (flag === "ok") return <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--severity-low))]" />
  if (flag === "warn") return <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--severity-medium))]" />
  return <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--severity-critical))]" />
}

// ── Ledger ────────────────────────────────────────────────────────────
function Ledger() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Containment ledger</CardTitle>
          <CardDescription>Recent reviews · before / after / status</CardDescription>
        </div>
        <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
          Open full ledger <ChevronRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <div className="grid grid-cols-[80px_1.4fr_110px_110px_110px_110px_120px] gap-3 border-b border-border-soft px-5 py-2">
        <span className="label-cap">Date</span>
        <span className="label-cap">Provider · Case</span>
        <span className="label-cap text-right">Submitted</span>
        <span className="label-cap text-right">After</span>
        <span className="label-cap text-right">Saved</span>
        <span className="label-cap">Status</span>
        <span className="label-cap text-right"></span>
      </div>
      <ul>
        {LEDGER.map((r, i) => (
          <li
            key={r.caseId + i}
            className="rise grid grid-cols-[80px_1.4fr_110px_110px_110px_110px_120px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
            style={{ animationDelay: `${200 + i * 50}ms` }}
          >
            <span className="num text-[11px] text-muted-foreground">{r.date}</span>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] text-foreground">{r.provider}</p>
              <p className="num text-[10.5px] text-muted-foreground">{r.caseId}</p>
            </div>
            <span className="num text-right text-[12px] text-foreground">{r.submitted}</span>
            <span className="num text-right text-[12px] text-muted-foreground">{r.after}</span>
            <span className={cn(
              "num text-right text-[12px] font-medium",
              r.tone === "destructive" ? "text-[hsl(var(--severity-critical))]" :
              r.tone === "secondary"   ? "text-muted-foreground" :
              "text-accent"
            )}>
              {r.saved}
            </span>
            <Badge variant={r.tone}>{r.status}</Badge>
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" className="h-6 gap-1 px-2 text-[10.5px]">
                Open <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
