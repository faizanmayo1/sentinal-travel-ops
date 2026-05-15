import {
  CheckCircle2,
  ChevronRight,
  Eye,
  FileCheck,
  Filter,
  KeyRound,
  Lock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserCog,
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
  { label: "Audit events today",  value: "84,210", delta: "Immutable · WORM storage",     tone: "text-foreground" },
  { label: "MFA enforcement",      value: "100%",   delta: "All operator accounts",        tone: "text-[hsl(var(--severity-low))]" },
  { label: "Data retention",       value: "7 yrs",   delta: "Per partner config",            tone: "text-foreground" },
  { label: "Open compliance items", value: "0",     delta: "SOC 2 + GDPR · last quarter",   tone: "text-[hsl(var(--severity-low))]" },
] as const

type EventKind = "read" | "write" | "comm" | "approve" | "doc" | "auth"

const EVENTS: Array<{
  time: string
  operator: string
  initials: string
  role: string
  action: string
  resource: string
  kind: EventKind
  ip: string
  device: string
  outcome: "ok" | "blocked"
}> = [
  { time: "10:42:18", operator: "Carmen Ruiz",     initials: "CR", role: "Sr. Medical Ops", action: "Issued Guarantee-of-Payment",      resource: "CASE-8821 · $14,200",     kind: "approve", ip: "10.4.18.221", device: "MacBook · Chrome",    outcome: "ok" },
  { time: "10:41:02", operator: "Carmen Ruiz",     initials: "CR", role: "Sr. Medical Ops", action: "Reviewed extracted invoice",         resource: "DOC-49218",               kind: "read",    ip: "10.4.18.221", device: "MacBook · Chrome",    outcome: "ok" },
  { time: "10:38:55", operator: "Carmen Ruiz",     initials: "CR", role: "Sr. Medical Ops", action: "Uploaded notes to case",             resource: "CASE-8821",               kind: "write",   ip: "10.4.18.221", device: "MacBook · Chrome",    outcome: "ok" },
  { time: "10:24:11", operator: "Carmen Ruiz",     initials: "CR", role: "Sr. Medical Ops", action: "Voice call with traveler · 6m 14s", resource: "CASE-8821 · Marisol R.",  kind: "comm",    ip: "10.4.18.221", device: "MacBook · WebRTC",    outcome: "ok" },
  { time: "10:18:42", operator: "AI Co-pilot",     initials: "AI", role: "Service account",  action: "Generated GoP recommendation",       resource: "CASE-8821",               kind: "doc",     ip: "—",            device: "service · sentinel-ai", outcome: "ok" },
  { time: "10:14:08", operator: "Aiden Kim",       initials: "AK", role: "Ops Director",     action: "Read case timeline",                resource: "CASE-8821",               kind: "read",    ip: "10.4.18.118", device: "iPad · Safari",       outcome: "ok" },
  { time: "07:22:01", operator: "AI Co-pilot",     initials: "AI", role: "Service account",  action: "Policy verification succeeded",      resource: "CASE-8821 · PLAT-2400",   kind: "doc",     ip: "—",            device: "service · sentinel-ai", outcome: "ok" },
  { time: "07:18:46", operator: "AI Co-pilot",     initials: "AI", role: "Service account",  action: "Opened medical workflow",            resource: "CASE-8821",               kind: "write",   ip: "—",            device: "service · sentinel-ai", outcome: "ok" },
  { time: "07:14:22", operator: "—",               initials: "TR", role: "Traveler",         action: "Inbound message · WhatsApp",         resource: "Thread T-1 · Marisol R.", kind: "comm",    ip: "—",            device: "WhatsApp Cloud API",   outcome: "ok" },
  { time: "06:48:11", operator: "Jules N.",        initials: "JN", role: "Junior Ops",       action: "Attempted read on partner P-104",   resource: "Restricted ACL",          kind: "auth",    ip: "10.4.18.42",  device: "Windows · Edge",      outcome: "blocked" },
]

const ROLES = [
  { name: "Ops Director",       count: 6,   perms: ["read all", "approve > $25k", "configure SLAs"],   tone: "default" as const },
  { name: "Sr. Medical Ops",    count: 24,  perms: ["read medical", "issue GoP < $25k", "contact providers"], tone: "default" as const },
  { name: "Junior Ops",         count: 86,  perms: ["read assigned", "draft only"],                       tone: "default" as const },
  { name: "Claims Specialist",  count: 18,  perms: ["read claims", "approve < $5k", "request docs"],     tone: "default" as const },
  { name: "Auditor (read-only)", count: 4,   perms: ["read all", "export audit log"],                      tone: "accent" as const },
  { name: "Service accounts",   count: 12,  perms: ["scoped tokens", "rate-limited"],                     tone: "accent" as const },
]

const COMPLIANCE = [
  { label: "SOC 2 Type II",          status: "Renewed Mar 2026 · annual review on track", tone: "low" as const },
  { label: "ISO 27001",               status: "Certified · next audit Aug 2026",              tone: "low" as const },
  { label: "GDPR · DPA",              status: "Signed with 18 of 20 partners",                tone: "medium" as const },
  { label: "HIPAA-aligned controls",  status: "Where applicable · medical workflows",         tone: "low" as const },
  { label: "Penetration testing",     status: "Q1 2026 · 0 critical findings",                tone: "low" as const },
  { label: "Data encryption",         status: "At rest (AES-256) · in transit (TLS 1.3)",     tone: "low" as const },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Audit() {
  return (
    <div className="space-y-8 px-8 py-8">
      <Hero />
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AuditTrail />
        <aside className="space-y-5">
          <AccessControls />
          <ComplianceCard />
        </aside>
      </section>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute -bottom-32 left-32 h-72 w-72 rounded-full bg-[hsl(var(--severity-low)/0.12)] blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Compliance · Audit & Access</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">SOC 2 Type II · ISO 27001 · GDPR</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">Every action,</span>
            <br />
            <span className="text-foreground/80">written down forever.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            Read, write, communicate, approve. Whether an operator, an AI service account, or a traveler — every
            event lands in an immutable audit log with operator, role, resource, IP, and outcome. Replayable any time.
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

// ── Audit trail ───────────────────────────────────────────────────────
function AuditTrail() {
  return (
    <Card elevated>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Audit trail · CASE-8821
          </CardTitle>
          <CardDescription>Every action on Marisol R.'s case · last 10 events shown</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-7 gap-1.5 px-2 text-[11px]">
            <Filter className="h-3 w-3" /> Filter
          </Button>
          <Button size="sm" variant="ghost" className="gap-1 text-[11px]">
            Full log <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <div className="grid grid-cols-[90px_1fr_170px_120px_60px] gap-3 border-b border-border-soft px-5 py-2">
        <span className="label-cap">Time GMT</span>
        <span className="label-cap">Operator · Action</span>
        <span className="label-cap">Resource</span>
        <span className="label-cap">Device · IP</span>
        <span className="label-cap text-right">Outcome</span>
      </div>
      <ul>
        {EVENTS.map((e, i) => (
          <li
            key={i}
            className="rise grid grid-cols-[90px_1fr_170px_120px_60px] items-center gap-3 border-b border-border-soft/40 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/30"
            style={{ animationDelay: `${200 + i * 40}ms` }}
          >
            <span className="num text-[10.5px] text-muted-foreground">{e.time}</span>
            <div className="flex min-w-0 items-center gap-2">
              <KindIcon kind={e.kind} />
              <div className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-medium",
                e.operator === "AI Co-pilot"
                  ? "bg-accent/15 text-accent ring-1 ring-accent/30"
                  : e.operator === "—"
                  ? "bg-secondary text-muted-foreground ring-1 ring-border"
                  : "bg-primary/15 text-primary ring-1 ring-primary/30"
              )}>
                {e.initials}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="truncate text-[12.5px] text-foreground">{e.action}</span>
                </div>
                <p className="truncate text-[10.5px] text-muted-foreground">
                  {e.operator === "—" ? e.role : `${e.operator} · ${e.role}`}
                </p>
              </div>
            </div>
            <span className="num truncate text-[11px] text-muted-foreground">{e.resource}</span>
            <div className="text-[10.5px] leading-tight text-muted-foreground">
              <p className="truncate">{e.device}</p>
              <p className="num text-[10px] text-muted-foreground/70">{e.ip}</p>
            </div>
            <div className="flex justify-end">
              {e.outcome === "ok" ? (
                <Badge variant="low" className="h-4 px-1 py-0 text-[8.5px]">
                  <CheckCircle2 className="h-2 w-2" /> ok
                </Badge>
              ) : (
                <Badge variant="destructive" className="h-4 px-1 py-0 text-[8.5px]">
                  <Lock className="h-2 w-2" /> blocked
                </Badge>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-2 border-t border-border-soft bg-card/40 px-5 py-3 text-[11px]">
        <Sparkles className="h-3 w-3 text-accent" />
        <span className="text-muted-foreground">
          Replayable timeline · export to JSON / SIEM · WORM-archived 7 yrs · cryptographically signed
        </span>
        <Button size="sm" variant="ghost" className="ml-auto h-5 gap-1 px-2 text-[10.5px]">
          Export <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  )
}

function KindIcon({ kind }: { kind: EventKind }) {
  const MAP = {
    read:    { Icon: Eye,           color: "text-muted-foreground" },
    write:   { Icon: FileCheck,     color: "text-primary" },
    comm:    { Icon: MessageCircle, color: "text-accent" },
    approve: { Icon: Wallet,        color: "text-[hsl(var(--severity-low))]" },
    doc:     { Icon: FileCheck,     color: "text-primary" },
    auth:    { Icon: KeyRound,      color: "text-[hsl(var(--severity-critical))]" },
  } as const
  const m = MAP[kind]
  const Icon = m.Icon
  return (
    <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border-soft bg-card/60", m.color)}>
      <Icon className="h-3 w-3" />
    </span>
  )
}

// ── Access controls ───────────────────────────────────────────────────
function AccessControls() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-3.5 w-3.5 text-primary" />
          Roles & access
        </CardTitle>
        <CardDescription>Least-privilege · scoped tokens for service accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {ROLES.map((r) => (
          <div key={r.name} className="rounded-md border border-border-soft bg-card/40 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-foreground">{r.name}</span>
              <Badge variant={r.tone}>{r.count}</Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {r.perms.map((p) => (
                <span key={p} className="rounded-sm border border-border-soft bg-secondary/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-md border border-border-soft bg-[hsl(var(--severity-low)/0.06)] px-3 py-2 text-[11px]">
          <CheckCircle2 className="h-3 w-3 text-[hsl(var(--severity-low))]" />
          <span className="text-muted-foreground">Quarterly access review · last completed Apr 2026</span>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Compliance ────────────────────────────────────────────────────────
function ComplianceCard() {
  return (
    <Card elevated>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-[hsl(var(--severity-low))]" />
          Compliance posture
        </CardTitle>
        <CardDescription>Current attestations and controls</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {COMPLIANCE.map((c) => (
          <div
            key={c.label}
            className={cn(
              "flex items-center gap-3 rounded-md border px-3 py-2",
              c.tone === "low"    && "border-[hsl(var(--severity-low)/0.25)] bg-[hsl(var(--severity-low)/0.05)]",
              c.tone === "medium" && "border-[hsl(var(--severity-medium)/0.25)] bg-[hsl(var(--severity-medium)/0.05)]"
            )}
          >
            {c.tone === "low" ? (
              <CheckCircle2 className="h-3 w-3 shrink-0 text-[hsl(var(--severity-low))]" />
            ) : (
              <FileCheck className="h-3 w-3 shrink-0 text-[hsl(var(--severity-medium))]" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium text-foreground">{c.label}</p>
              <p className="text-[10.5px] text-muted-foreground">{c.status}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
