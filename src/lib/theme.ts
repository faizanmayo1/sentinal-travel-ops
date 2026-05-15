import { useEffect, useState } from "react"

export type Theme = "light" | "dark"

const STORAGE_KEY = "sentinel.theme"

function apply(theme: Theme) {
  const root = document.documentElement
  if (theme === "dark") root.classList.add("dark")
  else root.classList.remove("dark")
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark"
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === "light" || stored === "dark") return stored
  } catch { /* ignore */ }
  // Default to dark — the demo's primary aesthetic
  return document.documentElement.classList.contains("dark") ? "dark" : "dark"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    apply(theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
  }, [theme])

  return {
    theme,
    setTheme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  }
}
