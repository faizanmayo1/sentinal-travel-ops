import { Mail, MessageCircle, MessageSquare, Monitor, Phone, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

export type Channel = "whatsapp" | "voice" | "email" | "sms" | "portal" | "app"

const META: Record<Channel, { label: string; icon: typeof Mail; tone: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageCircle, tone: "text-[hsl(158_58%_56%)] bg-[hsl(158_58%_56%/0.12)] border-[hsl(158_58%_56%/0.3)]" },
  voice:    { label: "Voice",    icon: Phone,         tone: "text-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.12)] border-[hsl(var(--accent)/0.3)]" },
  email:    { label: "Email",    icon: Mail,          tone: "text-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.10)] border-[hsl(var(--primary)/0.28)]" },
  sms:      { label: "SMS",      icon: MessageSquare, tone: "text-[hsl(40_92%_60%)] bg-[hsl(40_92%_60%/0.12)] border-[hsl(40_92%_60%/0.3)]" },
  portal:   { label: "Portal",   icon: Monitor,       tone: "text-muted-foreground bg-secondary/60 border-border" },
  app:      { label: "App",      icon: Smartphone,    tone: "text-[hsl(280_70%_70%)] bg-[hsl(280_70%_70%/0.12)] border-[hsl(280_70%_70%/0.3)]" },
}

export function ChannelChip({ channel, className }: { channel: Channel; className?: string }) {
  const m = META[channel]
  const Icon = m.icon
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        m.tone,
        className
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {m.label}
    </span>
  )
}
