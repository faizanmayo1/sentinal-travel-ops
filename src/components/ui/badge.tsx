import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] transition-colors focus:outline-none focus:ring-1 focus:ring-ring",
  {
    variants: {
      variant: {
        default:
          "border-primary/30 bg-primary/12 text-primary",
        secondary:
          "border-border bg-secondary/60 text-muted-foreground",
        outline:
          "border-border text-muted-foreground bg-transparent",
        accent:
          "border-accent/30 bg-accent/12 text-accent",
        gold:
          "border-gold/30 bg-gold/12 text-gold",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive",
        critical:
          "border-[hsl(var(--severity-critical)/0.35)] bg-[hsl(var(--severity-critical)/0.12)] text-[hsl(var(--severity-critical))]",
        high:
          "border-[hsl(var(--severity-high)/0.35)] bg-[hsl(var(--severity-high)/0.12)] text-[hsl(var(--severity-high))]",
        medium:
          "border-[hsl(var(--severity-medium)/0.35)] bg-[hsl(var(--severity-medium)/0.12)] text-[hsl(var(--severity-medium))]",
        low:
          "border-[hsl(var(--severity-low)/0.35)] bg-[hsl(var(--severity-low)/0.12)] text-[hsl(var(--severity-low))]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
