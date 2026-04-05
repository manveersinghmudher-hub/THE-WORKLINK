'use client'

import { useWorkflow } from '@/lib/workflow-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react'

export function GigProfileComplete() {
  const { workerData, setCurrentStep } = useWorkflow()

  const handleContinueAsGig = () => {
    setCurrentStep('dashboard')
  }

  const handleApplyForWorkLink = () => {
    setCurrentStep('worklink-eligibility')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 border-b border-border bg-card">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">W</span>
          </div>
          <span className="font-semibold text-xl text-foreground">WorkLink</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Profile Created Successfully!
            </h1>
            <p className="text-muted-foreground">
              Welcome, {workerData.name}! You are now registered as a Gig Worker.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Continue as Gig Worker */}
            <Card className="border-2 border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={handleContinueAsGig}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Continue as Gig Worker
                </CardTitle>
                <CardDescription>
                  Start finding jobs immediately
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Browse available jobs in your area</li>
                  <li>• Set your own schedule</li>
                  <li>• Get paid per job</li>
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Apply for WorkLink Employee */}
            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Become a WorkLink Employee
                  </CardTitle>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary text-primary-foreground">
                    Recommended
                  </span>
                </div>
                <CardDescription>
                  Get verified and earn more
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Higher earning potential
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Priority job assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Professional badge & trust
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Insurance & benefits
                  </li>
                </ul>
                <Button className="w-full mt-4" onClick={handleApplyForWorkLink}>
                  Apply for WorkLink Employee
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
