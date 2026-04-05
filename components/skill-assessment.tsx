'use client'

import { useState, useEffect } from 'react'
import { useWorkflow } from '@/lib/workflow-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from './progress-bar'
import { 
  CheckCircle, ArrowRight, ArrowLeft, Clock, 
  Award, Target, Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: 'What is the first step when starting electrical repair work?',
    options: [
      'Start working immediately',
      'Turn off the main power supply',
      'Call the client',
      'Check your tools',
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'Which tool is used for measuring electrical current?',
    options: [
      'Screwdriver',
      'Plier',
      'Multimeter',
      'Hammer',
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: 'What should you do if a customer is not satisfied with your work?',
    options: [
      'Leave immediately',
      'Argue with them',
      'Listen to their concern and try to fix it',
      'Ask for full payment anyway',
    ],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'What is the correct way to handle work materials?',
    options: [
      'Use any material available',
      'Use only quality materials recommended for the job',
      'Use the cheapest option always',
      'Let the client decide everything',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'If you cannot complete a job on time, what should you do?',
    options: [
      'Just leave without telling anyone',
      'Inform the customer in advance and reschedule',
      'Complete it poorly to save time',
      'Cancel the job without notice',
    ],
    correctAnswer: 1,
  },
]

export function SkillAssessment() {
  const { updateWorkerData, setCurrentStep } = useWorkflow()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per question

  useEffect(() => {
    if (showResult || timeLeft <= 0) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResult])

  const handleNext = () => {
    const newAnswers = [...answers, selectedAnswer ?? -1]
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(60)
    } else {
      // Calculate score
      const correctCount = newAnswers.filter(
        (answer, index) => answer === QUESTIONS[index].correctAnswer
      ).length
      const score = Math.round((correctCount / QUESTIONS.length) * 100)

      // Determine rank based on score
      let rank: 'bronze' | 'silver' | 'gold' | 'platinum'
      if (score >= 90) rank = 'platinum'
      else if (score >= 70) rank = 'gold'
      else if (score >= 50) rank = 'silver'
      else rank = 'bronze'

      updateWorkerData({
        skillAssessmentScore: score,
        workerRank: rank,
        workerType: 'worklink',
      })
      setShowResult(true)
    }
  }

  const handleBack = () => {
    setCurrentStep('document-verification')
  }

  const handleGoToDashboard = () => {
    setCurrentStep('dashboard')
  }

  const score = Math.round(
    (answers.filter((answer, index) => answer === QUESTIONS[index].correctAnswer).length / 
    QUESTIONS.length) * 100
  )

  if (showResult) {
    const correctCount = answers.filter(
      (answer, index) => answer === QUESTIONS[index].correctAnswer
    ).length
    const finalScore = Math.round((correctCount / QUESTIONS.length) * 100)
    
    let rank: 'bronze' | 'silver' | 'gold' | 'platinum'
    let rankColor: string
    let rankBg: string
    
    if (finalScore >= 90) {
      rank = 'platinum'
      rankColor = 'text-foreground'
      rankBg = 'bg-foreground/10'
    } else if (finalScore >= 70) {
      rank = 'gold'
      rankColor = 'text-warning'
      rankBg = 'bg-warning/10'
    } else if (finalScore >= 50) {
      rank = 'silver'
      rankColor = 'text-muted-foreground'
      rankBg = 'bg-muted'
    } else {
      rank = 'bronze'
      rankColor = 'text-chart-4'
      rankBg = 'bg-chart-4/10'
    }

    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="px-4 py-6 border-b border-border bg-card">
          <div className="max-w-md mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">W</span>
            </div>
            <span className="font-semibold text-xl text-foreground">WorkLink</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
              rankBg
            )}>
              <Award className={cn("w-12 h-12", rankColor)} />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Skill Assessment Complete!
            </h1>
            <p className="text-muted-foreground mb-8">
              Based on your performance, you have been assigned a rank
            </p>

            <Card className="mb-6">
              <CardContent className="py-6">
                <div className="text-5xl font-bold text-primary mb-2">
                  {finalScore}%
                </div>
                <p className="text-muted-foreground">
                  {correctCount} out of {QUESTIONS.length} correct
                </p>
              </CardContent>
            </Card>

            <Card className={cn("border-2", rankBg)}>
              <CardHeader>
                <CardTitle className={cn("text-2xl capitalize", rankColor)}>
                  {rank} Rank
                </CardTitle>
                <CardDescription>
                  {rank === 'platinum' && 'Excellent! You are a top-tier professional'}
                  {rank === 'gold' && 'Great job! You have strong skills'}
                  {rank === 'silver' && 'Good work! Keep improving'}
                  {rank === 'bronze' && 'You passed! Training recommended'}
                </CardDescription>
              </CardHeader>
            </Card>

            <Button className="w-full mt-8" size="lg" onClick={handleGoToDashboard}>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]

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
            currentStep={2}
            totalSteps={2}
            label="Verification Step 2"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Skill Assessment
            </h1>
            <p className="text-muted-foreground">
              Answer these questions to evaluate your skill level
            </p>
          </div>

          {/* Timer and Progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-medium">
                Question {currentQuestion + 1} of {QUESTIONS.length}
              </span>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-3 py-1 rounded-full",
              timeLeft <= 10 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-medium">{timeLeft}s</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Skill Question
                </span>
              </div>
              <CardTitle className="text-lg leading-relaxed">
                {question.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => setSelectedAnswer(parseInt(value))}
                className="space-y-3"
              >
                {question.options.map((option, index) => (
                  <label
                    key={index}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                      selectedAnswer === index
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem value={index.toString()} />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Question Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {QUESTIONS.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentQuestion
                    ? "bg-primary"
                    : index < currentQuestion
                    ? "bg-success"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-card border-t border-border px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-4">
          {currentQuestion === 0 ? (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div className="flex-1" />
          )}
          <Button 
            onClick={handleNext} 
            disabled={selectedAnswer === null}
            className="flex-1"
          >
            {currentQuestion === QUESTIONS.length - 1 ? 'Submit' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </footer>
    </div>
  )
}
