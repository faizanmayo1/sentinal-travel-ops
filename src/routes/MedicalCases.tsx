import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock,
  FileText,
  Globe2,
  HeartPulse,
  Hospital,
  Languages,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
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
type Severity = "critical" | "high" | "medium" | "low"

interface MedicalCase {
  id: string
  traveler: string
  initials: string
  age: number
  location: string
  language: string
  policy: string
  severity: Severity
  sla: string
  status: string
  issue: string
  facility: {
    name: string
    city: string
    type: string
    attending: string
    prior: string
  }
  coverage: {
    tier: string
    limit: string
    exposure: string
    gop: { issued: boolean; amount: string }
  }
  timeline: Array<{ time: string; label: string; detail?: string; tone?: "critical" | "primary" | "accent" | "low" | "muted"; done?: boolean }>
  documents: Array<{ name: string; type: string; status: "received" | "translated" | "pending" }>
  nextAction: { title: string; body: string; cta: string; metric: string }
}

const CASES: MedicalCase[] = [
  {
    id: "CASE-8821",
    traveler: "Marisol Rivera",
    initials: "MR",
    age: 47,
    location: "Mexico City, MX",
    language: "ES",
    policy: "PLAT-2400",
    severity: "critical",
    sla: "00:04:12",
    status: "GoP pending · hospital awaiting confirmation",
    issue: "Acute pancreatitis · admitted via ER · pancreatic enzymes elevated",
    facility: {
      name: "Hospital Ángeles Pedregal",
      city: "Mexico City, MX",
      type: "In-network · tier-1 private",
      attending: "Dr. Eduardo Vázquez · Gastroenterology",
      prior: "3 prior settlements · avg ‑18% vs benchmark",
    },
    coverage: {
      tier: "Platinum 2400",
      limit: "$500,000 medical / $1M evac",
      exposure: "$14,200 (est.)",
      gop: { issued: false, amount: "$14,200" },
    },
    timeline: [
      { time: "21:48 yest", label: "ER admission",          detail: "Walk-in, severe abdominal pain", tone: "critical", done: true },
      { time: "22:14",       label: "Triage at hospital",   detail: "Imaging ordered · CT abdomen",                       done: true },
      { time: "23:02",       label: "Diagnosis confirmed",  detail: "Acute pancreatitis · Ranson score 4",                done: true },
      { time: "07:14",       label: "Family contacted Sentinel",  detail: "WhatsApp · husband initiated",   tone: "accent", done: true },
      { time: "07:18",       label: "AI triage classified", detail: "Urgency 92 · medical workflow opened",  tone: "primary", done: true },
      { time: "07:22",       label: "Policy verified",      detail: "PLAT-2400 · in coverage · in-network",                done: true },
      { time: "10:38",       label: "GoP request prepared", detail: "Awaiting ops approval · $14.2k", tone: "critical", done: false },
      { time: "—",           label: "GoP transmitted",      detail: "Hospital billing · expected ≤ 15 min", tone: "muted", done: false },
    ],
    documents: [
      { name: "Admission record",    type: "Hospital",    status: "received" },
      { name: "CT abdomen report",   type: "Imaging",     status: "translated" },
      { name: "Lab results (lipase)", type: "Lab",         status: "received" },
      { name: "Treatment plan",       type: "Clinical",   status: "pending" },
      { name: "Itemized estimate",   type: "Billing",     status: "pending" },
      { name: "Patient consent",     type: "Compliance",  status: "received" },
    ],
    nextAction: {
      title: "Issue Guarantee-of-Payment to Hospital Ángeles",
      body: "Policy verified, in-network facility, 3 prior clean settlements averaging 18% below regional benchmark. Pre-authorized cap $20,000; estimate $14,200.",
      cta: "Authorize $14.2k",
      metric: "Saves 47 minutes · keeps SLA above 95%",
    },
  },
  {
    id: "CASE-8814",
    traveler: "Henrik Jensen",
    initials: "HJ",
    age: 34,
    location: "Bangkok, TH",
    language: "EN",
    policy: "GOLD-1820",
    severity: "critical",
    sla: "00:11:48",
    status: "Evac coordination · awaiting receiving facility",
    issue: "Polytrauma · motorcycle RTA · ortho + neuro stabilization in-country",
    facility: {
      name: "Bumrungrad International Hospital",
      city: "Bangkok, TH",
      type: "In-network · tier-1 international",
      attending: "Dr. Anchalee Suk · Trauma",
      prior: "12 prior cases · avg LOS 4.2 days",
    },
    coverage: {
      tier: "Gold 1820",
      limit: "$250,000 medical / $500k evac",
      exposure: "$42,000 (est. evac + stay)",
      gop: { issued: true, amount: "$42,000" },
    },
    timeline: [
      { time: "06:12", label: "Accident reported",     detail: "Family WhatsApp · scene photos uploaded", tone: "critical", done: true },
      { time: "06:18", label: "AI triage classified",  detail: "Urgency 88 · evac workflow opened",         tone: "primary",  done: true },
      { time: "07:02", label: "Receiving hospital admit", detail: "Bumrungrad · ER trauma bay 2",                          done: true },
      { time: "07:48", label: "GoP issued",            detail: "$42k pre-auth · billing notified",          tone: "low",     done: true },
      { time: "09:14", label: "Evac assessment",      detail: "Air ambulance options · Singapore",                          done: false },
    ],
    documents: [
      { name: "Police report",       type: "Compliance", status: "received" },
      { name: "Trauma imaging",      type: "Imaging",    status: "translated" },
      { name: "Stabilization notes", type: "Clinical",   status: "received" },
      { name: "Evac quote",          type: "Logistics",  status: "pending" },
    ],
    nextAction: {
      title: "Confirm air ambulance to Mt. Elizabeth Singapore",
      body: "Patient stable for transport. Provider quotes: $38k (Hope MedFlight, 4hr ETA) vs $44k (International SOS, 2.5hr ETA). Recommend faster option given neuro risk.",
      cta: "Approve Int'l SOS $44k",
      metric: "1.5 hour earlier · neuro stability",
    },
  },
  {
    id: "CASE-8809",
    traveler: "Aisha Okafor",
    initials: "AO",
    age: 58,
    location: "Rome, IT",
    language: "EN",
    policy: "PLAT-2400",
    severity: "high",
    sla: "00:19:55",
    status: "ER under observation · GoP issued",
    issue: "Cardiac event · chest pain · troponin elevated · stent placement pending",
    facility: {
      name: "Policlinico Gemelli",
      city: "Rome, IT",
      type: "In-network · academic",
      attending: "Dr. Marco Rinaldi · Cardiology",
      prior: "8 prior cases · avg billing clean",
    },
    coverage: {
      tier: "Platinum 2400",
      limit: "$500,000 medical",
      exposure: "$18,500 (est.)",
      gop: { issued: true, amount: "$18,500" },
    },
    timeline: [
      { time: "02:14", label: "ER admission",          detail: "Husband called +39 Roma",                tone: "critical", done: true },
      { time: "02:42", label: "Cardiac workup",        detail: "ECG · troponin · echo",                                  done: true },
      { time: "04:12", label: "AI triage classified",  detail: "Urgency 76 · cardiac workflow",          tone: "primary",  done: true },
      { time: "05:30", label: "GoP issued",            detail: "$18.5k pre-auth",                         tone: "low",     done: true },
      { time: "10:15", label: "Stent placement scheduled", detail: "Cath lab 14:00 local",                                done: false },
    ],
    documents: [
      { name: "ECG strip",     type: "Cardiology", status: "received" },
      { name: "Troponin labs", type: "Lab",        status: "received" },
      { name: "Procedure note", type: "Clinical",  status: "pending" },
    ],
    nextAction: {
      title: "Confirm second opinion on stent vs medical management",
      body: "Stable on heparin drip. Sentinel medical board can review imaging in 20 min. Optional but recommended for $18k decision.",
      cta: "Request review",
      metric: "Low-risk window · 20 min",
    },
  },
  {
    id: "CASE-8801",
    traveler: "Diego Paredes",
    initials: "DP",
    age: 29,
    location: "Cusco, PE",
    language: "ES",
    policy: "GOLD-1820",
    severity: "high",
    sla: "00:24:02",
    status: "ICU · oxygen support · stabilization plan",
    issue: "Severe HAPE (altitude pulmonary edema) · ICU monitoring",
    facility: {
      name: "Clínica Pardo",
      city: "Cusco, PE",
      type: "In-network · regional",
      attending: "Dr. Lucía Ramos · Pulmonology",
      prior: "First case · cost benchmark pending",
    },
    coverage: {
      tier: "Gold 1820",
      limit: "$250,000 medical / $500k evac",
      exposure: "$8,500 (est.)",
      gop: { issued: true, amount: "$8,500" },
    },
    timeline: [
      { time: "23:40 yest", label: "Symptoms reported", detail: "Wife portal submission", tone: "critical", done: true },
      { time: "00:12",       label: "ICU admission",     detail: "Oxygen + dexamethasone",                done: true },
      { time: "06:42",       label: "AI triage classified", detail: "Urgency 84 · ICU workflow", tone: "primary", done: true },
      { time: "07:00",       label: "GoP issued",        detail: "$8.5k pre-auth",          tone: "low", done: true },
      { time: "11:24",       label: "Descent transport planned", detail: "Ground ambulance Cusco → Lima",       done: false },
    ],
    documents: [
      { name: "ICU admission note", type: "Clinical",  status: "translated" },
      { name: "Oxygen sat trend",   type: "Vitals",    status: "received" },
      { name: "Transport quote",    type: "Logistics", status: "pending" },
    ],
    nextAction: {
      title: "Schedule descent transport to Lima sea-level facility",
      body: "Oxygen saturation stable on 4L. Lima transfer reduces HAPE risk; ground ambulance $1,200 (8 hr) or air evac $9,400 (1 hr).",
      cta: "Approve ground ambulance",
      metric: "$8.2k saved · stable for ground",
    },
  },
  {
    id: "CASE-8794",
    traveler: "Yuki Murakami",
    initials: "YM",
    age: 41,
    location: "Reykjavík, IS",
    language: "JA → EN",
    policy: "SILV-1010",
    severity: "medium",
    sla: "00:42:11",
    status: "Surgery cleared · scheduled tomorrow",
    issue: "Open tibia fracture · snowmobile accident · ORIF pending",
    facility: {
      name: "Landspítali Háskólasjúkrahús",
      city: "Reykjavík, IS",
      type: "Public · tier-1",
      attending: "Dr. Jón Sigurðsson · Orthopedics",
      prior: "First case",
    },
    coverage: {
      tier: "Silver 1010",
      limit: "$100,000 medical",
      exposure: "$9,200 (est. ORIF + 3 nights)",
      gop: { issued: true, amount: "$9,200" },
    },
    timeline: [
      { time: "13:48 yest", label: "Accident reported",  detail: "App submission · ski guide",   tone: "critical", done: true },
      { time: "14:30",       label: "ER admission",       detail: "Initial fracture stabilization",                done: true },
      { time: "16:00",       label: "AI triage classified", detail: "Urgency 58 · ortho workflow", tone: "primary", done: true },
      { time: "18:42",       label: "GoP issued",         detail: "$9.2k pre-auth",                tone: "low",    done: true },
      { time: "Tomorrow 08:00", label: "ORIF surgery",    detail: "Scheduled · informed consent received",            done: false },
    ],
    documents: [
      { name: "X-ray tibia",         type: "Imaging",   status: "received" },
      { name: "Surgical plan",        type: "Clinical",  status: "translated" },
      { name: "Anesthesia consent",  type: "Compliance", status: "received" },
    ],
    nextAction: {
      title: "Arrange post-op repatriation flight to Tokyo",
      body: "Recovery 7-10 days, then medical-escort flight required. Sentinel partner JAL Medical Service · economy with stretcher: $7,800.",
      cta: "Reserve repat slot",
      metric: "Books window day 8",
    },
  },
]

const KPIS = [
  { label: "Active medical cases", value: "75",  delta: "15 critical / 18 high", tone: "text-[hsl(var(--severity-critical))]" },
  { label: "GoP issued today",     value: "$184k", delta: "12 facilities · 9 countries", tone: "text-foreground" },
  { label: "Avg cost exposure",    value: "$11.8k", delta: "−14% vs benchmark", tone: "text-[hsl(var(--severity-low))]" },
  { label: "Median time to GoP",   value: "11m", delta: "−42% vs Q1", tone: "text-[hsl(var(--severity-low))]" },
] as const

// ── Page ───────────────────────────────────────────────────────────────
export function MedicalCases() {
  const [activeId, setActiveId] = useState(CASES[0].id)
  const active = CASES.find((c) => c.id === activeId) ?? CASES[0]

  return (
    <div className="space-y-6 px-8 py-8">
      <Hero />
      <CaseSwitcher cases={CASES} activeId={activeId} onSelect={setActiveId} />
      <CaseDetail c={active} />
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-[hsl(var(--severity-critical)/0.15)] blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Operations · Medical</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-critical))]">15 critical</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">75</span> medical cases
            <br />
            <span className="text-foreground/80">in active coordination.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Hospital admissions, evacuations, ICU coordination, and guarantee-of-payment workflows — all on one
            timeline with the treating facility, attending physician, policy coverage, and recommended next action.
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
function CaseSwitcher({
  cases,
  activeId,
  onSelect,
}: {
  cases: MedicalCase[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
      {cases.map((c) => {
        const isActive = c.id === activeId
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "group relative overflow-hidden rounded-md border px-3 py-2.5 text-left transition-all",
              isActive
                ? "border-primary/40 bg-[hsl(var(--card-elevated))] glow-primary"
                : "border-border-soft bg-card/40 hover:border-border hover:bg-card"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="num text-[10px] text-muted-foreground">{c.id}</span>
              <Badge variant={c.severity} className="h-4 px-1 py-0 text-[8.5px]">
                {c.severity}
              </Badge>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[12.5px] font-medium text-foreground">{c.traveler.split(" ")[0]} {c.traveler.split(" ")[1]?.[0]}.</span>
              <span className="text-[11px] text-muted-foreground">· {c.location.split(",")[0]}</span>
            </div>
            <div className="mt-1 truncate text-[11px] text-muted-foreground">
              {c.facility.name}
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="num text-[10px] text-muted-foreground">SLA</span>
              <span className={cn(
                "num text-[11px]",
                c.severity === "critical" ? "text-[hsl(var(--severity-critical))]"
                : c.severity === "high"   ? "text-[hsl(var(--severity-high))]"
                : "text-foreground"
              )}>
                {c.sla}
              </span>
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
function CaseDetail({ c }: { c: MedicalCase }) {
  return (
    <div className="space-y-5">
      {/* Identity strip */}
      <Card elevated className="relative overflow-hidden">
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-px",
            c.severity === "critical" && "bg-gradient-to-b from-transparent via-[hsl(var(--severity-critical))] to-transparent",
            c.severity === "high"     && "bg-gradient-to-b from-transparent via-[hsl(var(--severity-high))] to-transparent",
            c.severity === "medium"   && "bg-gradient-to-b from-transparent via-[hsl(var(--severity-medium))] to-transparent",
          )}
        />
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr_auto]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/5 ring-1 ring-accent/30 text-[14px] font-medium text-accent">
              {c.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="font-display text-[26px] leading-none tracking-tight text-foreground">
                  {c.traveler}
                </h2>
                <span className="num text-[11px] text-muted-foreground">{c.id}</span>
                <Badge variant={c.severity}>{c.severity}</Badge>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {c.age}y</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Globe2 className="h-3 w-3" /> {c.location}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Languages className="h-3 w-3" /> {c.language}</span>
                <span>·</span>
                <span className="num">Policy {c.policy}</span>
              </div>
              <p className="mt-2 text-[12.5px] text-foreground/90">{c.issue}</p>
            </div>
          </div>

          <div className="space-y-1.5 lg:border-l lg:border-border-soft lg:pl-5">
            <span className="label-cap">Current status</span>
            <p className="text-[13px] text-foreground">{c.status}</p>
            <div className="flex items-center gap-2 pt-1">
              <Clock className={cn(
                "h-3 w-3",
                c.severity === "critical" ? "text-[hsl(var(--severity-critical))]" : "text-muted-foreground"
              )} />
              <span className={cn(
                "num text-[12px]",
                c.severity === "critical" ? "text-[hsl(var(--severity-critical))]" : "text-foreground"
              )}>
                SLA {c.sla}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" className="gap-1.5" asChild>
              <Link to="/inbox"><Phone className="h-3 w-3" /> Open comms</Link>
            </Button>
            <Button size="sm" variant="accent" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> AI brief
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Three info cards */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <InfoCard
          icon={Hospital}
          title="Treating facility"
        >
          <div className="text-[13px] font-medium text-foreground">{c.facility.name}</div>
          <div className="text-[11.5px] text-muted-foreground">{c.facility.city} · {c.facility.type}</div>
          <div className="mt-3 space-y-1.5 border-t border-border-soft pt-3">
            <Row icon={Stethoscope} label="Attending" value={c.facility.attending} />
            <Row icon={Activity} label="Prior history" value={c.facility.prior} />
          </div>
        </InfoCard>

        <InfoCard
          icon={ShieldCheck}
          title="Coverage & exposure"
        >
          <div className="text-[13px] font-medium text-foreground">{c.coverage.tier}</div>
          <div className="text-[11.5px] text-muted-foreground">{c.coverage.limit}</div>
          <div className="mt-3 space-y-1.5 border-t border-border-soft pt-3">
            <Row icon={Wallet} label="Exposure (est.)" value={c.coverage.exposure} numeric />
            <Row
              icon={CheckCircle2}
              label="Guarantee-of-Payment"
              value={c.coverage.gop.issued ? `Issued · ${c.coverage.gop.amount}` : `Pending · ${c.coverage.gop.amount}`}
              tone={c.coverage.gop.issued ? "low" : "critical"}
            />
          </div>
        </InfoCard>

        <InfoCard
          icon={Sparkles}
          title="Recommended next action"
          tone="accent"
        >
          <p className="text-[13px] font-medium text-foreground">{c.nextAction.title}</p>
          <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">{c.nextAction.body}</p>
          <div className="mt-3 flex items-center justify-between border-t border-border-soft pt-3">
            <span className="num text-[10.5px] text-[hsl(var(--severity-low))]">{c.nextAction.metric}</span>
            <Button size="sm" variant="accent" className="gap-1.5">
              {c.nextAction.cta} <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </InfoCard>
      </section>

      {/* Timeline + Documents */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card elevated>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-3.5 w-3.5 text-[hsl(var(--severity-critical))]" />
              Case timeline
            </CardTitle>
            <CardDescription>From first contact through current status · all timestamps GMT</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-3 border-l border-border-soft pl-5">
              {c.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[26px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full ring-2 ring-background",
                      t.done
                        ? t.tone === "critical" ? "bg-[hsl(var(--severity-critical))]"
                        : t.tone === "primary"  ? "bg-primary"
                        : t.tone === "accent"   ? "bg-accent"
                        : t.tone === "low"      ? "bg-[hsl(var(--severity-low))]"
                        : "bg-foreground/60"
                        : "border border-border bg-secondary/60"
                    )}
                  >
                    {!t.done ? <CircleDot className="h-1.5 w-1.5 text-muted-foreground" /> : null}
                  </span>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={cn(
                      "text-[12.5px] font-medium",
                      t.done ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {t.label}
                    </span>
                    <span className="num text-[10.5px] text-muted-foreground/80">{t.time}</span>
                  </div>
                  {t.detail ? (
                    <p className={cn(
                      "mt-0.5 text-[11.5px] leading-snug",
                      t.done ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}>
                      {t.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card elevated>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Documents
            </CardTitle>
            <CardDescription>{c.documents.length} files · collected, translated, pending</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {c.documents.map((d, i) => {
                const tone =
                  d.status === "received"   ? "bg-[hsl(var(--severity-low))]"
                  : d.status === "translated" ? "bg-primary"
                  : "bg-[hsl(var(--severity-high))]"
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-md border border-border-soft bg-card/40 px-3 py-2"
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", tone)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] text-foreground">{d.name}</div>
                      <div className="text-[10.5px] text-muted-foreground">{d.type}</div>
                    </div>
                    <Badge
                      variant={d.status === "pending" ? "high" : d.status === "translated" ? "default" : "low"}
                      className="h-4 px-1 py-0 text-[9px]"
                    >
                      {d.status}
                    </Badge>
                  </li>
                )
              })}
            </ul>
            {c.documents.some((d) => d.status === "pending") ? (
              <Button size="sm" variant="ghost" className="mt-3 w-full gap-1.5">
                <AlertTriangle className="h-3 w-3 text-[hsl(var(--severity-high))]" />
                Chase pending documents
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────
function InfoCard({
  icon: Icon,
  title,
  children,
  tone,
}: {
  icon: typeof Hospital
  title: string
  children: React.ReactNode
  tone?: "accent"
}) {
  return (
    <Card elevated className={cn(tone === "accent" && "ring-1 ring-accent/20")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={cn("h-3.5 w-3.5", tone === "accent" ? "text-accent" : "text-primary")} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Row({
  icon: Icon,
  label,
  value,
  numeric,
  tone,
}: {
  icon: typeof Hospital
  label: string
  value: string
  numeric?: boolean
  tone?: "low" | "critical"
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="label-cap">{label}</div>
        <div className={cn(
          "text-[12px] leading-snug",
          numeric && "num",
          tone === "low" && "text-[hsl(var(--severity-low))]",
          tone === "critical" && "text-[hsl(var(--severity-critical))]",
          !tone && "text-foreground/90"
        )}>
          {value}
        </div>
      </div>
    </div>
  )
}
