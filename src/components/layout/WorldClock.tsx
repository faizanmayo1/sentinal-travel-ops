import { useEffect, useState } from "react"

const ZONES = [
  { code: "NYC", tz: "America/New_York" },
  { code: "LDN", tz: "Europe/London" },
  { code: "DXB", tz: "Asia/Dubai" },
  { code: "HKG", tz: "Asia/Hong_Kong" },
]

function formatTime(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  }).format(date)
}

export function WorldClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="hidden items-center gap-5 xl:flex">
      {ZONES.map((z) => (
        <div key={z.code} className="flex items-baseline gap-1.5">
          <span className="label-cap text-[9px]">{z.code}</span>
          <span className="num text-[11px] font-medium text-foreground/90">
            {formatTime(now, z.tz)}
          </span>
        </div>
      ))}
    </div>
  )
}
