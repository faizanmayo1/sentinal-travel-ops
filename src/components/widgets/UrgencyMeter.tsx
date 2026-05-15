import { cn } from "@/lib/utils"

interface UrgencyMeterProps {
  score: number // 0-100
  label?: string
  className?: string
  size?: "sm" | "md"
}

function tone(score: number) {
  if (score >= 85) return { text: "text-[hsl(var(--severity-critical))]", grad: "from-[hsl(var(--severity-critical))] to-[hsl(var(--severity-high))]" }
  if (score >= 65) return { text: "text-[hsl(var(--severity-high))]", grad: "from-[hsl(var(--severity-high))] to-[hsl(var(--severity-medium))]" }
  if (score >= 40) return { text: "text-[hsl(var(--severity-medium))]", grad: "from-[hsl(var(--severity-medium))] to-[hsl(var(--severity-low))]" }
  return { text: "text-[hsl(var(--severity-low))]", grad: "from-[hsl(var(--severity-low))] to-[hsl(var(--severity-low))]" }
}

export function UrgencyMeter({ score, label = "Urgency", className, size = "md" }: UrgencyMeterProps) {
  const t = tone(score)
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between">
        <span className="label-cap text-[9px]">{label}</span>
        <span className={cn("num font-medium leading-none", t.text, size === "md" ? "text-[14px]" : "text-[11px]")}>
          {score}
          <span className="ml-0.5 text-[8.5px] text-muted-foreground/70">/100</span>
        </span>
      </div>
      <div className={cn("relative w-full overflow-hidden rounded-full bg-secondary/50", size === "md" ? "h-1.5" : "h-1")}>
        <div
          className={cn("h-full rounded-full bg-gradient-to-r", t.grad)}
          style={{ width: `${score}%` }}
        />
        {/* tick marks at 40 / 65 / 85 */}
        {[40, 65, 85].map((tick) => (
          <span
            key={tick}
            className="absolute top-0 h-full w-px bg-background/80"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>
    </div>
  )
}
