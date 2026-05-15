import { ArrowUpRight, Sparkles } from "lucide-react"
import { useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PlaceholderProps {
  title: string
  description?: string
}

export function Placeholder({ title, description }: PlaceholderProps) {
  const location = useLocation()
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-start justify-center px-8 py-16">
      <div className="rise w-full">
        <div className="flex items-center gap-3">
          <span className="label-cap">In development</span>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-border to-transparent" />
        </div>
        <h1 className="mt-5 font-display text-[44px] leading-[1.05] tracking-tightest text-foreground">
          <span className="gradient-headline font-display-italic">{title.split(" ")[0]}</span>{" "}
          {title.split(" ").slice(1).join(" ")}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground text-balance">
            {description}
          </p>
        ) : null}
        <div className="mt-7 flex items-center gap-2">
          <Badge variant="accent" className="gap-1.5">
            <Sparkles className="h-2.5 w-2.5" /> Up next in the demo build
          </Badge>
          <code className="num rounded border border-border bg-card/60 px-2 py-0.5 text-[10.5px] text-muted-foreground">
            {location.pathname}
          </code>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border-soft md:grid-cols-3">
          {[
            { label: "Records seeded", value: "—" },
            { label: "Demo moment", value: "scripted" },
            { label: "Polish target", value: "Tue 19 May" },
          ].map((cell) => (
            <div key={cell.label} className="bg-[hsl(var(--background-elevated))] px-4 py-3">
              <div className="label-cap">{cell.label}</div>
              <div className="mt-1 text-[14px] font-medium text-foreground">{cell.value}</div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="mt-6 -ml-2 gap-1 text-[11px]" asChild>
          <a href="/">Return to Command Center <ArrowUpRight className="h-3 w-3" /></a>
        </Button>
      </div>
    </div>
  )
}
