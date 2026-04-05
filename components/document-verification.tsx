'use client'

import { useState } from 'react'
import { useWorkflow } from '@/lib/workflow-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from './progress-bar'
import { 
  Upload, CheckCircle, Camera, FileText, 
  ArrowRight, ArrowLeft, Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentItem {
  id: string
  label: string
  description: string
  uploaded: boolean
  icon: React.ReactNode
}

export function DocumentVerification() {
  const { setCurrentStep } = useWorkflow()
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'id-proof',
      label: 'ID Proof',
      description: 'Aadhaar Card, Driving License, or Voter ID',
      uploaded: false,
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'selfie',
      label: 'Selfie with ID',
      description: 'Take a photo holding your ID proof',
      uploaded: false,
      icon: <Camera className="w-5 h-5" />,
    },
    {
      id: 'address-proof',
      label: 'Address Proof',
      description: 'Utility bill, rent agreement, or bank statement',
      uploaded: false,
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'work-photos',
      label: 'Work Portfolio',
      description: 'Photos of your past work (minimum 3)',
      uploaded: false,
      icon: <Camera className="w-5 h-5" />,
    },
  ])

  const uploadedCount = documents.filter(d => d.uploaded).length
  const canProceed = uploadedCount >= 3 // At least 3 documents required

  const handleUpload = (id: string) => {
    // Simulate upload
    setDocuments(prev => 
      prev.map(doc => 
        doc.id === id ? { ...doc, uploaded: true } : doc
      )
    )
  }

  const handleNext = () => {
    setCurrentStep('skill-assessment')
  }

  const handleBack = () => {
    setCurrentStep('worklink-survey')
  }

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
            currentStep={1}
            totalSteps={2}
            label="Verification Step 1"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Document Verification
            </h1>
            <p className="text-muted-foreground">
              Upload your documents to verify your identity and work experience
            </p>
          </div>

          {/* Trust Badge */}
          <Card className="mb-6 bg-primary/5 border-primary/20">
            <CardContent className="flex items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Your documents are secure</p>
                <p className="text-sm text-muted-foreground">
                  We use bank-level encryption to protect your data
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {documents.map((doc) => (
              <Card key={doc.id} className={cn(
                "border-2 transition-colors",
                doc.uploaded ? "border-success bg-success/5" : "border-border"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        doc.uploaded ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      )}>
                        {doc.uploaded ? <CheckCircle className="w-5 h-5" /> : doc.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base">{doc.label}</CardTitle>
                        <CardDescription className="text-xs">
                          {doc.description}
                        </CardDescription>
                      </div>
                    </div>
                    {doc.uploaded && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/10 text-success">
                        Uploaded
                      </span>
                    )}
                  </div>
                </CardHeader>
                {!doc.uploaded && (
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleUpload(doc.id)}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {doc.label}
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="mt-6 p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Upload Progress</span>
              <span className="text-sm text-muted-foreground">
                {uploadedCount}/{documents.length} completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(uploadedCount / documents.length) * 100}%` }}
              />
            </div>
            {!canProceed && (
              <p className="text-xs text-muted-foreground mt-2">
                Upload at least 3 documents to continue
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-card border-t border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          <Button variant="outline" onClick={handleBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed} className="flex-1">
            Continue to Skill Test
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
