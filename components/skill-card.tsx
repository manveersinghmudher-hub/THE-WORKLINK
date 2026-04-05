'use client'

import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface SkillCardProps {
  icon: React.ReactNode
  label: string
  selected: boolean
  onClick: () => void
}

export function SkillCard({ icon, label, selected, onClick }: SkillCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card"
      )}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" />
        </div>
      )}
      <div className={cn(
        "text-3xl",
        selected ? "text-primary" : "text-muted-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-sm font-medium text-center",
        selected ? "text-primary" : "text-foreground"
      )}>
        {label}
      </span>
    </button>
  )
}
