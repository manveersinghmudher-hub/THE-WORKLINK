'use client'

import { ReactNode } from 'react'
import { ProgressBar } from './progress-bar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface SurveyLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  currentStep: number
  totalSteps: number
  onNext?: () => void
  onBack?: () => void
  nextLabel?: string
  backLabel?: string
  canProceed?: boolean
  showBack?: boolean
}

export function SurveyLayout({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextLabel = 'Continue',
  backLabel = 'Back',
  canProceed = true,
  showBack = true,
}: SurveyLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card border-b border-border px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">W</span>
            </div>
            <span className="font-semibold text-lg text-foreground">WorkLink</span>
          </div>
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            label={`Step ${currentStep}`}
          />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-card border-t border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          {showBack && onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          )}
          {onNext && (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className={showBack && onBack ? "flex-1" : "w-full"}
            >
              {nextLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}
