'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  label?: string
}

export function ProgressBar({ currentStep, totalSteps, label }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm text-muted-foreground">
            {currentStep} of {totalSteps}
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-500 ease-out"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
