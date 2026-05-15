import { cn } from "@/lib/utils"

interface Region {
  code: string
  label: string
  load: number       // 0–100
  cases: number
  trend: "up" | "down" | "flat"
  hot?: boolean
}

const REGIONS: Region[] = [
  { code: "LATAM", label: "Latin America", load: 88, cases: 64, trend: "up", hot: true },
  { code: "EMEA",  label: "Europe, ME, Africa", load: 72, cases: 91, trend: "flat" },
  { code: "APAC",  label: "Asia Pacific", load: 54, cases: 78, trend: "up" },
  { code: "NA",    label: "North America", load: 41, cases: 52, trend: "down" },
  { code: "OCE",   label: "Oceania", load: 22, cases: 18, trend: "flat" },
  { code: "SSA",   label: "Sub-Saharan", load: 14, cases: 9,  trend: "flat" },
]

export function RegionLoad() {
  return (
    <ul className="divide-y divide-border-soft">
      {REGIONS.map((r) => (
        <li key={r.code} className="flex items-center gap-4 px-1 py-2.5">
          <div className="flex w-20 shrink-0 flex-col leading-tight">
            <span className="label-cap text-[9px]">{r.code}</span>
            <span className="truncate text-[11px] text-muted-foreground">{r.label}</span>
          </div>
          <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/60">
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                r.hot
                  ? "bg-gradient-to-r from-[hsl(var(--severity-high))] to-[hsl(var(--severity-critical))]"
                  : r.load > 50
                  ? "bg-gradient-to-r from-primary/70 to-primary"
                  : "bg-primary/60"
              )}
              style={{ width: `${r.load}%` }}
            />
            {r.hot ? (
              <div className="absolute right-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[hsl(var(--severity-critical))] shadow-[0_0_8px_hsl(var(--severity-critical))]" />
            ) : null}
          </div>
          <div className="w-12 text-right">
            <span className="num text-[12px] font-medium">{r.cases}</span>
          </div>
          <div className="w-6 text-right">
            <span
              className={cn(
                "num text-[10px]",
                r.trend === "up" && "text-[hsl(var(--severity-high))]",
                r.trend === "down" && "text-[hsl(var(--severity-low))]",
                r.trend === "flat" && "text-muted-foreground"
              )}
            >
              {r.trend === "up" ? "▲" : r.trend === "down" ? "▼" : "—"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
