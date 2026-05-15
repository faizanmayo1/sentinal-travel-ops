import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe2,
  Paperclip,
  PhoneCall,
  Send,
  Sparkles,
  Wand2,
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
import { ChannelChip, type Channel } from "@/components/widgets/ChannelChip"
import { cn } from "@/lib/utils"

// ── Data ──────────────────────────────────────────────────────────────
const KPIS = [
  { label: "Live threads",         value: "186",   delta: "62% multi-channel",                tone: "text-foreground" },
  { label: "Languages auto-translated", value: "27", delta: "EN routed to ops",                tone: "text-foreground" },
  { label: "Avg first response",    value: "1m 18s", delta: "−34% vs Q1",                       tone: "text-[hsl(var(--severity-low))]" },
  { label: "Sentiment flagged",    value: "14",    delta: "Distress detected",                 tone: "text-[hsl(var(--severity-high))]" },
] as const

interface Thread {
  id: string
  name: string
  initials: string
  channels: Channel[]
  preview: string
  time: string
  unread: number
  severity: "critical" | "high" | "medium" | "low"
  language: string
  caseId?: string
}

const THREADS: Thread[] = [
  { id: "T-1",  name: "Marisol Rivera",  initials: "MR", channels: ["whatsapp", "voice", "portal"], preview: "Gracias, ya recibí confirmación del hospital…", time: "12s",  unread: 2, severity: "critical", language: "ES → EN", caseId: "CASE-8821" },
  { id: "T-2",  name: "Henrik Jensen",   initials: "HJ", channels: ["voice", "email"],              preview: "I confirm air ambulance window …",              time: "4m",   unread: 0, severity: "critical", language: "EN",      caseId: "CASE-8814" },
  { id: "T-3",  name: "Aisha Okafor",    initials: "AO", channels: ["whatsapp", "email"],           preview: "Husband is stable. Will share update …",        time: "9m",   unread: 1, severity: "high",     language: "EN",      caseId: "CASE-8809" },
  { id: "T-4",  name: "Sofia Cardoso",   initials: "SC", channels: ["whatsapp", "portal"],          preview: "A bagagem chegou ao hotel obrigada!",            time: "26m",  unread: 0, severity: "medium",   language: "PT → EN", caseId: "CASE-8806" },
  { id: "T-5",  name: "Lina Brandt",     initials: "LB", channels: ["app", "email"],                preview: "Bestätigung erhalten, danke.",                   time: "41m",  unread: 0, severity: "low",      language: "DE → EN", caseId: "CLM-77104" },
  { id: "T-6",  name: "Kemal Aydın",     initials: "KA", channels: ["sms"],                          preview: "Belgeleri yüklemeye çalışıyorum.",               time: "1h",   unread: 1, severity: "medium",   language: "TR → EN", caseId: "CLM-77080" },
  { id: "T-7",  name: "Diego Paredes",   initials: "DP", channels: ["portal", "voice"],              preview: "Mi esposa está conmigo en la clínica.",          time: "1h",   unread: 0, severity: "high",     language: "ES → EN", caseId: "CASE-8801" },
  { id: "T-8",  name: "Yuki Murakami",   initials: "YM", channels: ["app", "whatsapp"],              preview: "手術は明朝予定です ありがとうございます。",        time: "2h",   unread: 0, severity: "medium",   language: "JA → EN", caseId: "CASE-8794" },
]

interface Message {
  channel: Channel
  from: "traveler" | "ops" | "system" | "ai"
  time: string
  body: string
  translated?: string
  attachments?: Array<{ name: string; type: string }>
  sentiment?: "distress" | "neutral" | "positive"
}

const CONVERSATION: Record<string, Message[]> = {
  "T-1": [
    {
      channel: "whatsapp",
      from: "traveler",
      time: "07:14",
      body: "Estoy en el hospital aquí en CDMX, me ingresaron anoche. El hospital necesita confirmación de pago AHORA o no continúan con el tratamiento. Por favor ayúdenme.",
      translated: "I'm in the hospital here in Mexico City, they admitted me last night. The hospital needs payment confirmation NOW or they won't continue treatment. Please help.",
      sentiment: "distress",
    },
    {
      channel: "portal",
      from: "system",
      time: "07:18",
      body: "AI triage classified as CRITICAL · medical workflow opened",
      attachments: [{ name: "Hospital admission record", type: "PDF · 2 pages" }],
    },
    {
      channel: "voice",
      from: "ops",
      time: "07:24",
      body: "Hola Marisol, soy Carmen de Sentinel — already have your policy in front of me and we are issuing the Guarantee-of-Payment within 10 minutes. Quédate tranquila.",
    },
    {
      channel: "portal",
      from: "traveler",
      time: "07:32",
      body: "",
      attachments: [
        { name: "CT abdomen report.pdf", type: "Imaging · 3.2 MB" },
        { name: "Lipase lab results.pdf", type: "Lab · 1 page" },
      ],
    },
    {
      channel: "whatsapp",
      from: "ops",
      time: "07:48",
      body: "Marisol, the Guarantee-of-Payment for $14,200 has been issued to Hospital Ángeles. Dr. Vázquez has been notified. Treatment can continue.",
      translated: "Marisol, se emitió la Garantía de Pago de $14,200 al Hospital Ángeles. Dr. Vázquez ha sido notificado. El tratamiento puede continuar.",
    },
    {
      channel: "whatsapp",
      from: "traveler",
      time: "Now",
      body: "Gracias, ya recibí confirmación del hospital. Empezarán con el tratamiento.",
      translated: "Thank you, I already received confirmation from the hospital. They will start with the treatment.",
      sentiment: "positive",
    },
  ],
}

const TEMPLATES = [
  { label: "Confirm GoP receipt",   body: "Confirming the Guarantee-of-Payment has been issued. The hospital can proceed with care immediately." },
  { label: "Provider intro",         body: "Hello, I'm reaching out from Sentinel on behalf of policyholder {{traveler}}. Coverage details and clinical context attached." },
  { label: "Document chase",         body: "Hi {{name}}, we still need the {{document}} to complete your claim. You can upload it directly from the portal link below." },
  { label: "Wellness check",         body: "Just checking in — how are you feeling? Anything else we can arrange while you recover?" },
]

// ── Page ───────────────────────────────────────────────────────────────
export function Inbox() {
  const [activeId, setActiveId] = useState("T-1")
  const active = THREADS.find((t) => t.id === activeId) ?? THREADS[0]
  const messages = CONVERSATION[active.id] ?? []

  return (
    <div className="space-y-6 px-8 py-8">
      <Hero />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[320px_1fr]">
        <ThreadList threads={THREADS} activeId={activeId} onSelect={setActiveId} />
        <Conversation thread={active} messages={messages} />
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-[hsl(var(--background-elevated))]">
      <div className="starfield absolute inset-0 opacity-30" />
      <div className="absolute -top-32 right-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid grid-cols-1 gap-6 p-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="rise">
          <div className="flex items-center gap-3">
            <span className="label-cap">Operations · Inbox</span>
            <div className="h-px w-12 bg-gradient-to-r from-border to-transparent" />
            <span className="label-cap text-[hsl(var(--severity-low))]">All channels stitched</span>
          </div>
          <h1 className="mt-4 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
            <span className="gradient-headline font-display-italic">One thread</span> per traveler,
            <br />
            <span className="text-foreground/80">across every channel.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
            WhatsApp, voice, SMS, email, portal, and app collapse into a single timeline. Auto-translated,
            sentiment-aware, and pre-summarized so agents pick up cold without losing context.
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

// ── Thread list ───────────────────────────────────────────────────────
function ThreadList({
  threads,
  activeId,
  onSelect,
}: {
  threads: Thread[]
  activeId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card elevated className="overflow-hidden">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <CardTitle>Threads</CardTitle>
          <Badge variant="outline">{threads.length}</Badge>
        </div>
      </CardHeader>
      <ul>
        {threads.map((t) => {
          const isActive = t.id === activeId
          return (
            <li key={t.id}>
              <button
                onClick={() => onSelect(t.id)}
                className={cn(
                  "group relative grid w-full grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-border-soft/50 px-4 py-3 text-left transition-colors last:border-0",
                  isActive ? "bg-secondary/40" : "hover:bg-secondary/30"
                )}
              >
                {isActive ? (
                  <span className="absolute left-0 top-1/2 h-8 w-px -translate-y-1/2 bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                ) : null}
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-secondary/60 ring-1 ring-border text-[10px] font-medium text-foreground">
                  {t.initials}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card",
                      t.severity === "critical" && "bg-[hsl(var(--severity-critical))]",
                      t.severity === "high"     && "bg-[hsl(var(--severity-high))]",
                      t.severity === "medium"   && "bg-[hsl(var(--severity-medium))]",
                      t.severity === "low"      && "bg-[hsl(var(--severity-low))]",
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[12.5px] font-medium text-foreground">{t.name}</span>
                    <span className="num text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">{t.preview}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {t.channels.slice(0, 3).map((c) => (
                      <ChannelChip key={c} channel={c} className="h-3.5 px-1 py-0 text-[8.5px]" />
                    ))}
                    {t.caseId ? (
                      <span className="num text-[9.5px] text-muted-foreground/70">· {t.caseId}</span>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {t.unread ? (
                    <Badge variant="default" className="h-4 px-1.5 py-0 text-[9px]">{t.unread}</Badge>
                  ) : null}
                  <Badge variant="outline" className="h-4 px-1 py-0 text-[8.5px]">{t.language}</Badge>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

// ── Conversation ──────────────────────────────────────────────────────
function Conversation({ thread, messages }: { thread: Thread; messages: Message[] }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <Card elevated>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr_auto]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/5 ring-1 ring-accent/30 text-[14px] font-medium text-accent">
              {thread.initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-[22px] leading-none tracking-tight text-foreground">
                  {thread.name}
                </h2>
                <Badge variant={thread.severity}>{thread.severity}</Badge>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Globe2 className="h-3 w-3" /> {thread.language}
                </span>
                {thread.caseId ? (
                  <Link
                    to={thread.caseId.startsWith("CASE") ? "/cases" : "/claims"}
                    className="num text-primary hover:underline"
                  >
                    · {thread.caseId}
                  </Link>
                ) : null}
                <span>· thread {thread.id}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {thread.channels.map((c) => <ChannelChip key={c} channel={c} />)}
              </div>
            </div>
          </div>

          <div className="rounded-md border border-border-soft bg-card/40 p-3 lg:border-l lg:border-t-0">
            <div className="flex items-center gap-2 pb-2">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="label-cap">AI summary</span>
            </div>
            <p className="text-[12px] leading-snug text-foreground">
              Hospital admission yesterday for acute pancreatitis. Guarantee-of-Payment issued ($14,200);
              hospital confirmed treatment continuing. Traveler sentiment shifted from distress to positive.
              No further escalation needed.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" className="gap-1.5">
              <PhoneCall className="h-3 w-3" /> Call
            </Button>
            <Button size="sm" variant="accent" className="gap-1.5">
              <Sparkles className="h-3 w-3" /> Draft reply
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card elevated>
        <CardHeader>
          <CardTitle>Conversation timeline</CardTitle>
          <CardDescription>Unified across {thread.channels.length} channels · {messages.length} events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {messages.map((m, i) => <MessageBubble key={i} m={m} />)}
        </CardContent>
        <Composer />
      </Card>
    </div>
  )
}

function MessageBubble({ m }: { m: Message }) {
  const isOps      = m.from === "ops"
  const isSystem   = m.from === "system"
  const isTraveler = m.from === "traveler"

  if (isSystem) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-border-soft bg-[hsl(var(--severity-low)/0.05)] px-3 py-2 text-[11px]">
        <CheckCircle2 className="h-3 w-3 text-[hsl(var(--severity-low))]" />
        <ChannelChip channel={m.channel} />
        <span className="text-muted-foreground">{m.body}</span>
        {m.attachments?.map((a) => (
          <span key={a.name} className="ml-auto inline-flex items-center gap-1 text-[10.5px] text-foreground">
            <Paperclip className="h-3 w-3" /> {a.name}
          </span>
        ))}
        <span className="num ml-auto text-[10px] text-muted-foreground">{m.time}</span>
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3", isOps ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium",
          isOps
            ? "bg-primary/15 text-primary ring-1 ring-primary/30"
            : "bg-accent/15 text-accent ring-1 ring-accent/30"
        )}
      >
        {isOps ? "C" : isTraveler ? "·" : "AI"}
      </div>
      <div className={cn("max-w-[640px] flex-1", isOps ? "items-end" : "items-start")}>
        <div className={cn("mb-1 flex items-center gap-2", isOps ? "justify-end" : "")}>
          <ChannelChip channel={m.channel} />
          <span className="num text-[10px] text-muted-foreground">{m.time}</span>
          {m.sentiment === "distress" ? (
            <Badge variant="critical" className="h-4 px-1 py-0 text-[9px]">distress</Badge>
          ) : m.sentiment === "positive" ? (
            <Badge variant="low" className="h-4 px-1 py-0 text-[9px]">positive</Badge>
          ) : null}
        </div>
        <div
          className={cn(
            "rounded-md border px-3 py-2.5",
            isOps
              ? "border-primary/30 bg-primary/10"
              : "border-border-soft bg-card/60"
          )}
        >
          {m.body ? <p className="text-[12.5px] leading-snug text-foreground">{m.body}</p> : null}
          {m.translated ? (
            <p className={cn(
              "mt-2 border-t pt-2 text-[11.5px] leading-snug italic text-muted-foreground",
              isOps ? "border-primary/20" : "border-border-soft"
            )}>
              <span className="label-cap mr-1">EN</span>
              {m.translated}
            </p>
          ) : null}
          {m.attachments?.map((a) => (
            <div key={a.name} className="mt-2 flex items-center gap-2 rounded border border-border-soft bg-card/40 px-2 py-1.5 text-[11px]">
              <FileText className="h-3 w-3 text-primary" />
              <span className="text-foreground">{a.name}</span>
              <span className="ml-auto text-muted-foreground">{a.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Composer() {
  return (
    <div className="border-t border-border-soft bg-card/40 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Wand2 className="h-3 w-3 text-accent" />
        <span className="label-cap">Smart templates</span>
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATES.slice(0, 3).map((t) => (
            <button
              key={t.label}
              className="rounded-sm border border-border-soft bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:border-border hover:text-foreground"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1 rounded-md border border-border-soft bg-background/60 p-2">
          <textarea
            rows={2}
            placeholder="Reply on WhatsApp · auto-translated to ES on send…"
            className="w-full resize-none bg-transparent text-[12.5px] placeholder:text-muted-foreground/60 focus:outline-none"
            defaultValue="Marisol, qué bueno escuchar eso. Si necesitas algo más durante tu recuperación, estamos aquí."
          />
          <div className="mt-2 flex items-center gap-2 border-t border-border-soft pt-2 text-[10.5px] text-muted-foreground">
            <ChannelChip channel="whatsapp" />
            <span>· auto-translate ES on send</span>
            <Button size="sm" variant="ghost" className="ml-auto h-5 gap-1 px-1.5 text-[10px]">
              <Paperclip className="h-3 w-3" /> Attach
            </Button>
          </div>
        </div>
        <Button size="sm" className="h-9 gap-1.5">
          Send <Send className="h-3 w-3" />
        </Button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10.5px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-accent" />
        <span>AI suggested this draft based on positive sentiment + case status closing</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  )
}
