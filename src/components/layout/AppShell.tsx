import { NavLink, Outlet, useLocation } from "react-router-dom"
import {
  Activity,
  AlertTriangle,
  Brain,
  Building2,
  ClipboardCheck,
  Command,
  FileText,
  HeartPulse,
  Inbox,
  LayoutDashboard,
  LineChart,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/lib/theme"
import { WorldClock } from "./WorldClock"

type NavGroup = {
  label: string
  items: Array<{
    to: string
    label: string
    icon: typeof LayoutDashboard
    end?: boolean
    badge?: string
    badgeVariant?: "default" | "critical" | "high" | "medium" | "low" | "accent" | "secondary"
  }>
}

const NAV: NavGroup[] = [
  {
    label: "Operations",
    items: [
      { to: "/", label: "Command Center", icon: LayoutDashboard, end: true },
      { to: "/triage", label: "AI Triage", icon: Brain, badge: "8", badgeVariant: "critical" },
      { to: "/cases", label: "Medical Cases", icon: HeartPulse, badge: "15", badgeVariant: "high" },
      { to: "/claims", label: "Claims", icon: ClipboardCheck },
      { to: "/inbox", label: "Inbox", icon: Inbox, badge: "62" },
    ],
  },
  {
    label: "Network",
    items: [
      { to: "/providers", label: "Providers", icon: Building2 },
      { to: "/partners", label: "Partners", icon: Activity },
      { to: "/traveler-portal", label: "Traveler Portal", icon: Smartphone },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/cost-containment", label: "Cost Containment", icon: Wallet, badge: "$1.8M", badgeVariant: "accent" },
      { to: "/risk", label: "Risk & Surge", icon: AlertTriangle, badge: "Storm", badgeVariant: "high" },
      { to: "/documents", label: "Documents", icon: FileText },
      { to: "/executive", label: "Executive BI", icon: LineChart },
    ],
  },
  {
    label: "Compliance",
    items: [
      { to: "/audit", label: "Audit & Access", icon: ShieldCheck },
    ],
  },
]

const ALL = NAV.flatMap((g) => g.items)

export function AppShell() {
  return (
    <div className="flex h-full w-full bg-background text-foreground">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="relative flex-1 overflow-y-auto">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="hidden w-[244px] shrink-0 flex-col border-r border-border bg-[hsl(var(--background-elevated))] lg:flex">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary/30 to-primary/5 ring-1 ring-primary/30 glow-primary">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-display text-[17px] font-normal tracking-tight text-foreground">
            Sentinel
          </span>
          <span className="label-cap text-[9px] -mt-0.5">Travel · Ops</span>
        </div>
        <Badge variant="outline" className="ml-auto h-4 px-1 py-0 text-[8.5px]">
          v3.2
        </Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={group.label} className={cn(gi > 0 && "mt-5")}>
            <div className="flex items-center gap-2 px-2 pb-2">
              <span className="label-cap text-[9px]">{group.label}</span>
              <div className="h-px flex-1 bg-border-soft" />
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] font-medium transition-all",
                        isActive
                          ? "bg-primary/8 text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <span className="absolute left-0 top-1/2 h-4 w-px -translate-y-1/2 bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                        ) : null}
                        <item.icon
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            isActive ? "text-primary" : ""
                          )}
                          strokeWidth={isActive ? 2.25 : 1.75}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <Badge
                            variant={item.badgeVariant ?? "secondary"}
                            className="h-4 px-1 py-0 text-[9px]"
                          >
                            {item.badge}
                          </Badge>
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Live ops footer */}
      <div className="border-t border-border px-3 py-3">
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="label-cap text-[9px]">Live Ops</span>
          <span className="beacon h-1.5 w-1.5 rounded-full text-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low))]" />
        </div>
        <div className="space-y-1.5 rounded-md border border-border-soft bg-card/40 p-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">SLA pace</span>
            <span className="num text-[hsl(var(--severity-low))]">96.8%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Auto-adjudication</span>
            <span className="num text-foreground">62%</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">On call</span>
            <span className="num text-foreground">14 / 18</span>
          </div>
        </div>
        {/* Demo Setup link hidden during live demo. To re-enable:
        <NavLink
          to="/admin/data"
          className="mt-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <Settings className="h-3 w-3" />
          Demo Setup
        </NavLink>
        */}
      </div>
    </aside>
  )
}

function TopBar() {
  const location = useLocation()
  const { theme, toggle } = useTheme()
  const active = ALL.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to)
  )

  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-[hsl(var(--background-elevated))]/80 px-6 backdrop-blur-xl">
      {/* Hairline glow underline */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px gradient-rule opacity-60" />

      <div className="flex items-center gap-3 text-[13px]">
        <span className="label-cap text-[9px]">Workspace</span>
        <span className="text-muted-foreground/40">·</span>
        <span className="font-medium text-foreground">
          {active?.label ?? "Sentinel"}
        </span>
      </div>

      <div className="ml-4 hidden flex-1 md:flex">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search cases, claims, travelers, providers…"
            className="h-8 w-full rounded-md border border-border-soft bg-background/60 pl-9 pr-14 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            <Command className="mr-0.5 inline h-2.5 w-2.5" />K
          </kbd>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <WorldClock />
        <div className="hidden h-5 w-px bg-border xl:block" />
        <div className="flex items-center gap-2 px-2">
          <span className="beacon h-1.5 w-1.5 rounded-full bg-[hsl(var(--severity-low))] text-[hsl(var(--severity-low))]" />
          <span className="label-cap text-[9px]">All Systems</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="h-7 w-7"
        >
          {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
        <Button size="sm" variant="accent" className="h-7 gap-1.5 px-2.5 text-[11px]">
          <Sparkles className="h-3 w-3" /> AI Co-pilot
        </Button>
        <div className="flex items-center gap-2 pl-2">
          <div className="hidden flex-col items-end leading-tight md:flex">
            <span className="text-[11px] font-medium">Aiden K.</span>
            <span className="label-cap text-[8.5px]">Ops Director</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-accent/10 ring-1 ring-accent/30 text-[10px] font-medium text-accent">
            AK
          </div>
        </div>
      </div>
    </header>
  )
}
