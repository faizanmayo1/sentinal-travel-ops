import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  FileText,
  Globe2,
  Link2,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react"
import { Link } from "react-router-dom"
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
  { label: "Documents processed",    value: "8,420", delta: "Today · 184 in flight",         tone: "text-foreground" },
  { label: "Avg extraction time",     value: "2.4s",  delta: "−61% vs human review",          tone: "text-[hsl(var(--severity-low))]" },
  { label: "Languages handled",      value: "23",    delta: "All translated to EN",          tone: "text-foreground" },
  { label: "Fraud / inconsistency flagged", value: "9", delta: "Last 24h · $42k disputed",   tone: "text-[hsl(var(--severity-high))]" },
] as const

interface Field {
  label: string
  value: string
  confidence: number
  translated?: string
  mismatch?: boolean
}

const FIELDS: Field[] = [
  { label: "Document type",  value: "Hospital invoice", confidence: 98 },
  { label: "Issuer",          value: "Hospital Ángeles Pedregal", confidence: 99 },
  { label: "Patient",         value: "Marisol Rivera Hernández", confidence: 97 },
  { label: "Invoice no.",     value: "MX-44218-2026", confidence: 100 },
  { label: "Service period",  value: "Apr 14 – Apr 17, 2026", confidence: 96 },
  { label: "Currency",        value: "MXN → USD", confidence: 100 },
  { label: "Subtotal",        value: "MXN 412,840 ($21,620)", confidence: 99 },
  { label: "Diagnosis code",  value: "K85.9 · Acute pancreatitis", confidence: 94, translated: "Pancreatitis aguda no especificada" },
]

const FLAGS = [
  { label: "Missing: Treatment plan document",                tone: "high"     as const, action: "Request from facility" },
  { label: "Missing: Itemized cost estimate (Form B)",        tone: "high"     as const, action: "Request from facility" },
  { label: "Note: Facility surcharge 150% above benchmark",   tone: "medium"   as const, action: "Routed to cost containment" },
  { label: "Linked to case CASE-8821 and claim CLM-77064",   tone: "low"      as const, action: "View case" },
]

interface DocRow {
  id: string
  name: string
  type: string
  caseId: string
  source: string
  lang: string
  size: string
  status: "extracting" | "extracted" | "translated" | "pending" | "flagged"
  receivedAgo: string
}

const RECENT: DocRow[] = [
  { id: "DOC-49218", name: "Hospital invoice INV-4471",       type: "Billing",    caseId: "CASE-8821", source: "Hospital Ángeles",       lang: "ES → EN", size: "1.8 MB", status: "extracting", receivedAgo: "12s" },
  { id: "DOC-49216", name: "CT abdomen report",                type: "Imaging",    caseId: "CASE-8821", source: "Hospital Ángeles",       lang: "ES → EN", size: "3.2 MB", status: "translated", receivedAgo: "8m" },
  { id: "DOC-49214", name: "Lipase + amylase labs",            type: "Lab",        caseId: "CASE-8821", source: "Hospital Ángeles",       lang: "ES → EN", size: "0.4 MB", status: "extracted",  receivedAgo: "14m" },
  { id: "DOC-49212", name: "Trauma imaging packet",            type: "Imaging",    caseId: "CASE-8814", source: "Bumrungrad Intl",        lang: "TH → EN", size: "8.1 MB", status: "translated", receivedAgo: "1h" },
  { id: "DOC-49211", name: "Air ambulance quote",              type: "Logistics",  caseId: "CASE-8814", source: "International SOS",      lang: "EN",      size: "0.2 MB", status: "extracted",  receivedAgo: "1h" },
  { id: "DOC-49204", name: "Discharge summary",                 type: "Clinical",   caseId: "CASE-8809", source: "Policlinico Gemelli",    lang: "IT → EN", size: "1.1 MB", status: "translated", receivedAgo: "2h" },
  { id: "DOC-49196", name: "Suspicious invoice INV-3902",      type: "Billing",    caseId: "CASE-8651", source: "Anonymous clinic, TR",   lang: "TR → EN", size: "0.6 MB", status: "flagged",    receivedAgo: "yesterday" },
  { id: "DOC-49180", name: "Boarding pass + PIR",              type: "Travel",     caseId: "CLM-77104", source: "TAP Portugal",            lang: "EN",      size: "0.3 MB", status: "extracted",  receivedAgo: "yesterday" },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Documents() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <LiveAnalysis />
      <Recent />
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
            <span className="label-cap">Intelligence · Documents</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">All channels feed one OCR pipeline</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Every page</span> extracted,
            <br />
            <span className="text-foreground/80">translated, and routed.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Hospital invoices, lab results, boarding passes, police reports, consent forms. Every page is OCR'd
            in source language, translated to English, classified by type, and auto-linked to the right case or claim.
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

// ── Live analysis ─────────────────────────────────────────────────────
function LiveAnalysis() {
  return (
    <Card elevated className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary)/0.05)] via-transparent to-[hsl(var(--accent)/0.05)] pointer-events-none" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary to-transparent" />

      <CardHeader className="relative space-y-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/12 ring-1 ring-primary/30">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>Live document analysis</CardTitle>
              <CardDescription>DOC-49218 · Hospital invoice MX-44218-2026 · uploaded 12s ago</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="gap-1.5">
              <Loader2 className="h-2.5 w-2.5 animate-spin" /> Extracting
            </Badge>
            <Badge variant="outline">ES → EN</Badge>
            <Button size="sm" variant="ghost" className="gap-1 text-[11px]" asChild>
              <Link to="/cases"><Link2 className="h-3 w-3" /> Open in case</Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        <DocPreview />
        <ExtractedFields />
      </CardContent>

      <div className="relative space-y-2 border-t border-border-soft bg-card/40 px-5 py-3">
        {FLAGS.map((f) => (
          <div
            key={f.label}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 text-[11.5px]",
              f.tone === "high"   && "border-[hsl(var(--severity-high)/0.3)] bg-[hsl(var(--severity-high)/0.06)]",
              f.tone === "medium" && "border-[hsl(var(--severity-medium)/0.3)] bg-[hsl(var(--severity-medium)/0.06)]",
              f.tone === "low"    && "border-[hsl(var(--severity-low)/0.3)] bg-[hsl(var(--severity-low)/0.06)]",
            )}
          >
            {f.tone === "low" ? (
              <CheckCircle2 className="h-3 w-3 shrink-0 text-[hsl(var(--severity-low))]" />
            ) : (
              <AlertTriangle className={cn(
                "h-3 w-3 shrink-0",
                f.tone === "high"   && "text-[hsl(var(--severity-high))]",
                f.tone === "medium" && "text-[hsl(var(--severity-medium))]",
              )} />
            )}
            <span className="text-foreground">{f.label}</span>
            <Button size="sm" variant="ghost" className="ml-auto h-5 gap-1 px-2 text-[10.5px]">
              {f.action} <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Stylized doc preview with OCR bounding boxes ─────────────────────
function DocPreview() {
  return (
    <div className="relative">
      <div className="absolute -top-2 left-3 z-10 inline-flex items-center gap-1 rounded-sm border border-border bg-[hsl(var(--background-elevated))] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
        Source · ES
      </div>
      <svg
        viewBox="0 0 420 540"
        className="w-full rounded-md border border-border bg-[hsl(220_20%_94%)] shadow-[0_8px_32px_-12px_hsl(0_0%_0%/0.6)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="paper" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M 6 0 L 0 0 0 6" fill="none" stroke="hsl(220 15% 88%)" strokeWidth="0.3" />
          </pattern>
        </defs>
        <rect width="420" height="540" fill="url(#paper)" />

        {/* Header band */}
        <rect x="0" y="0" width="420" height="60" fill="hsl(220 20% 22%)" />
        <text x="22" y="28" fontSize="13" fontFamily="Geist" fontWeight="600" fill="hsl(36 25% 96%)">HOSPITAL ÁNGELES PEDREGAL</text>
        <text x="22" y="44" fontSize="9" fontFamily="Geist Mono" fill="hsl(36 25% 90%)" opacity="0.8">Camino Sta. Teresa 1055 · Mexico City · MX</text>
        <text x="380" y="28" fontSize="9" fontFamily="Geist Mono" fill="hsl(36 25% 90%)" textAnchor="end">FACTURA</text>
        <text x="380" y="42" fontSize="9" fontFamily="Geist Mono" fill="hsl(36 25% 96%)" textAnchor="end">MX-44218-2026</text>

        {/* Patient block */}
        <text x="22" y="86" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)">PACIENTE</text>
        <text x="22" y="102" fontSize="11" fontFamily="Geist" fontWeight="500" fill="hsl(220 25% 18%)">Marisol Rivera Hernández</text>
        <text x="22" y="116" fontSize="9" fontFamily="Geist Mono" fill="hsl(220 10% 40%)">47 años · póliza PLAT-2400</text>

        <text x="240" y="86" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)">PERIODO</text>
        <text x="240" y="102" fontSize="11" fontFamily="Geist" fill="hsl(220 25% 18%)">14 abril – 17 abril 2026</text>
        <text x="240" y="116" fontSize="9" fontFamily="Geist Mono" fill="hsl(220 10% 40%)">3 días · habitación 412</text>

        {/* Diagnosis */}
        <rect x="22" y="138" width="376" height="34" fill="hsl(220 20% 88%)" stroke="hsl(220 15% 80%)" />
        <text x="34" y="156" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)">DIAGNÓSTICO</text>
        <text x="34" y="170" fontSize="10.5" fontFamily="Geist" fill="hsl(220 25% 18%)">K85.9 — Pancreatitis aguda no especificada</text>

        {/* Line items header */}
        <line x1="22" y1="200" x2="398" y2="200" stroke="hsl(220 15% 70%)" strokeWidth="0.8" />
        <text x="22" y="214" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)">CONCEPTO</text>
        <text x="320" y="214" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)" textAnchor="end">UNITARIO</text>
        <text x="390" y="214" fontSize="8" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)" textAnchor="end">TOTAL</text>
        <line x1="22" y1="222" x2="398" y2="222" stroke="hsl(220 15% 80%)" strokeWidth="0.6" />

        {[
          { d: "Atención en urgencias",                u: "1,200",  t: "1,200" },
          { d: "TAC abdomen con contraste",            u: "2,800",  t: "2,800" },
          { d: "Panel lipasa + amilasa",               u: "480",    t: "480" },
          { d: "Pantoprazol IV (3 días)",              u: "920",    t: "920" },
          { d: "Habitación privada · 2 noches",        u: "2,400",  t: "4,800" },
          { d: "Consulta gastroenterología × 3",       u: "600",    t: "1,800" },
          { d: "Internista visita diaria × 2",          u: "550",    t: "1,100" },
          { d: "Suministro IV y electrolitos",          u: "720",    t: "720" },
          { d: "Sobrecargo de hospital",               u: "4,500",  t: "4,500" },
          { d: "Gastos administrativos",                u: "1,470",  t: "1,470" },
        ].map((row, i) => (
          <g key={i}>
            <text x="22" y={240 + i * 18} fontSize="10" fontFamily="Geist" fill="hsl(220 25% 22%)">{row.d}</text>
            <text x="320" y={240 + i * 18} fontSize="10" fontFamily="Geist Mono" fill="hsl(220 15% 35%)" textAnchor="end">{row.u}</text>
            <text x="390" y={240 + i * 18} fontSize="10" fontFamily="Geist Mono" fill="hsl(220 25% 22%)" textAnchor="end">{row.t}</text>
          </g>
        ))}

        {/* Total */}
        <line x1="22" y1="430" x2="398" y2="430" stroke="hsl(220 15% 70%)" strokeWidth="0.8" />
        <text x="320" y="450" fontSize="10" fontFamily="Geist Mono" letterSpacing="1" fill="hsl(220 10% 40%)" textAnchor="end">SUBTOTAL MXN</text>
        <text x="390" y="450" fontSize="11" fontFamily="Geist Mono" fontWeight="600" fill="hsl(220 25% 18%)" textAnchor="end">412,840</text>
        <text x="320" y="466" fontSize="9" fontFamily="Geist Mono" fill="hsl(220 10% 40%)" textAnchor="end">USD equiv.</text>
        <text x="390" y="466" fontSize="10" fontFamily="Geist Mono" fill="hsl(220 25% 22%)" textAnchor="end">$21,620.00</text>

        {/* OCR bounding boxes / highlights */}
        <Highlight x={14} y={68} w={220} h={40} label="Issuer" color="hsl(var(--primary))" />
        <Highlight x={14} y={92} w={200} h={30} label="Patient" color="hsl(var(--accent))" />
        <Highlight x={232} y={92} w={160} h={30} label="Period" color="hsl(var(--accent))" />
        <Highlight x={14} y={136} w={386} h={38} label="Diagnosis · K85.9" color="hsl(var(--severity-high))" />
        <Highlight x={14} y={382} w={386} h={22} label="Facility surcharge (+150%)" color="hsl(var(--severity-critical))" />
        <Highlight x={14} y={402} w={386} h={22} label="Non-reimbursable admin" color="hsl(var(--severity-critical))" />
        <Highlight x={232} y={438} w={170} h={34} label="Total · $21,620" color="hsl(var(--primary))" />
      </svg>
    </div>
  )
}

function Highlight({ x, y, w, h, label, color }: { x: number; y: number; w: number; h: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity="0.15" stroke={color} strokeWidth="0.8" strokeDasharray="3 2" rx="2" />
      <rect x={x} y={y - 8} width={label.length * 4.6 + 8} height="10" fill={color} rx="1" />
      <text x={x + 4} y={y - 1} fontSize="6.5" fontFamily="Geist Mono" letterSpacing="0.5" fill="hsl(var(--background))">{label}</text>
    </g>
  )
}

// ── Extracted fields ──────────────────────────────────────────────────
function ExtractedFields() {
  return (
    <div className="rounded-md border border-border-soft bg-[hsl(var(--background)/0.6)] p-4">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="label-cap">Extracted fields</span>
        </div>
        <span className="num text-[10px] text-muted-foreground">2.4s · v3.2</span>
      </div>

      <ul className="space-y-2">
        {FIELDS.map((f) => (
          <li key={f.label} className="grid grid-cols-[110px_1fr_44px] items-start gap-3 border-b border-border-soft/40 pb-2 last:border-0">
            <span className="label-cap pt-0.5">{f.label}</span>
            <div className="min-w-0">
              <span className="text-[12.5px] text-foreground">{f.value}</span>
              {f.translated ? (
                <p className="text-[10.5px] italic text-muted-foreground">
                  <span className="label-cap mr-1 text-[8.5px]">ES</span>{f.translated}
                </p>
              ) : null}
            </div>
            <ConfBar value={f.confidence} />
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-2 rounded-md border border-border-soft bg-card/40 px-3 py-2 text-[11px]">
        <Globe2 className="h-3 w-3 text-primary" />
        <span className="text-muted-foreground">Translated</span>
        <span className="text-foreground">ES → EN</span>
        <span className="text-muted-foreground/60">·</span>
        <Link2 className="h-3 w-3 text-accent" />
        <span className="text-muted-foreground">Linked to</span>
        <span className="num text-foreground">CASE-8821 · CLM-77064</span>
      </div>
    </div>
  )
}

function ConfBar({ value }: { value: number }) {
  const tone =
    value >= 95 ? "text-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low))]"
    : value >= 85 ? "text-[hsl(var(--severity-medium))] bg-[hsl(var(--severity-medium))]"
    : "text-[hsl(var(--severity-high))] bg-[hsl(var(--severity-high))]"
  const [textTone, barTone] = tone.split(" ")
  return (
    <div className="flex flex-col items-end gap-1">
      <span className={cn("num text-[10.5px]", textTone)}>{value}%</span>
      <div className="h-1 w-10 overflow-hidden rounded-full bg-secondary/60">
        <span className={cn("block h-full rounded-full", barTone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

// ── Recent documents ─────────────────────────────────────────────────
function Recent() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent documents</CardTitle>
          <CardDescription>Last 24 hours · all sources</CardDescription>
        </div>
        <Button size="sm" variant="accent" className="gap-1.5">
          <Upload className="h-3 w-3" /> Upload
        </Button>
      </CardHeader>
      <div className="grid grid-cols-[110px_1.6fr_120px_120px_140px_80px_120px_64px] gap-3 border-b border-border-soft px-5 py-2">
        <span className="label-cap">Doc ID</span>
        <span className="label-cap">Name · Source</span>
        <span className="label-cap">Type</span>
        <span className="label-cap">Linked</span>
        <span className="label-cap">Language</span>
        <span className="label-cap text-right">Size</span>
        <span className="label-cap">Status</span>
        <span className="label-cap text-right">Age</span>
      </div>
      <ul>
        {RECENT.map((d, i) => (
          <li
            key={d.id}
            className="rise grid grid-cols-[110px_1.6fr_120px_120px_140px_80px_120px_64px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
            style={{ animationDelay: `${200 + i * 40}ms` }}
          >
            <span className="num text-[11px] text-muted-foreground">{d.id}</span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{d.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{d.source}</p>
            </div>
            <Badge variant="outline">{d.type}</Badge>
            <Link to={d.caseId.startsWith("CASE") ? "/cases" : "/claims"} className="num text-[11px] text-primary hover:underline">
              {d.caseId}
            </Link>
            <span className="text-[11px] text-muted-foreground">{d.lang}</span>
            <span className="num text-right text-[11px] text-muted-foreground">{d.size}</span>
            <StatusTag status={d.status} />
            <span className="num text-right text-[11px] text-muted-foreground">{d.receivedAgo}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

function StatusTag({ status }: { status: DocRow["status"] }) {
  const MAP = {
    extracting: { label: "Extracting", variant: "default" as const, icon: Loader2 },
    extracted:  { label: "Extracted",  variant: "low" as const,     icon: CheckCircle2 },
    translated: { label: "Translated", variant: "low" as const,     icon: Globe2 },
    pending:    { label: "Pending",    variant: "high" as const,    icon: AlertTriangle },
    flagged:    { label: "Flagged",    variant: "destructive" as const, icon: AlertTriangle },
  }
  const m = MAP[status]
  const Icon = m.icon
  return (
    <Badge variant={m.variant} className="gap-1">
      <Icon className={cn("h-2.5 w-2.5", status === "extracting" && "animate-spin")} />
      {m.label}
    </Badge>
  )
}
