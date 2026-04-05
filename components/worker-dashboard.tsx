'use client'

import { useWorkflow } from '@/lib/workflow-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Award, Briefcase, Clock, MapPin, Star, 
  TrendingUp, Wallet, CheckCircle, Shield, ChevronRight, User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const PRIMARY_SKILLS_MAP: Record<string, string> = {
  'electrical': 'Electrical Work',
  'plumbing': 'Plumbing',
  'carpentry': 'Carpentry',
  'cleaning': 'Cleaning',
  'painting': 'Painting',
  'appliance': 'Appliance Repair',
  'mason': 'Mason / Construction',
  'other': 'Other',
}

export function WorkerDashboard() {
  const { workerData, setCurrentStep } = useWorkflow()
  
  const isWorkLinkEmployee = workerData.workerType === 'worklink'
  const rank = workerData.workerRank

  const getRankDetails = () => {
    switch (rank) {
      case 'platinum':
        return {
          color: 'text-foreground',
          bg: 'bg-foreground/10',
          border: 'border-foreground/20',
          label: 'Platinum',
          perks: ['Priority job assignments', 'Highest earning potential', 'Premium badge', 'Insurance coverage'],
        }
      case 'gold':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          label: 'Gold',
          perks: ['High priority jobs', 'Above average earnings', 'Gold badge', 'Basic insurance'],
        }
      case 'silver':
        return {
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          border: 'border-border',
          label: 'Silver',
          perks: ['Regular job flow', 'Standard earnings', 'Silver badge'],
        }
      case 'bronze':
        return {
          color: 'text-chart-4',
          bg: 'bg-chart-4/10',
          border: 'border-chart-4/20',
          label: 'Bronze',
          perks: ['Entry level jobs', 'Training support', 'Bronze badge'],
        }
      default:
        return {
          color: 'text-primary',
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          label: 'Gig Worker',
          perks: ['Flexible work', 'Browse available jobs', 'Set your schedule'],
        }
    }
  }

  const rankDetails = getRankDetails()
  const primarySkill = workerData.gigProfile.primarySkill 
    ? PRIMARY_SKILLS_MAP[workerData.gigProfile.primarySkill] 
    : 'Not set'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">W</span>
              </div>
              <span className="font-semibold text-lg">WorkLink</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold">
              {workerData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{workerData.name}</h1>
              <p className="text-primary-foreground/80 text-sm">{primarySkill}</p>
              <div className="flex items-center gap-2 mt-1">
                {isWorkLinkEmployee ? (
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    rankDetails.bg,
                    rankDetails.color === 'text-foreground' ? 'text-primary' : ''
                  )}>
                    {rankDetails.label} WorkLink Employee
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-foreground/20">
                    Gig Worker
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Rank Card (for WorkLink employees) */}
          {isWorkLinkEmployee && rank && (
            <Card className={cn("border-2", rankDetails.border)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className={cn("w-5 h-5", rankDetails.color)} />
                    Your Rank
                  </CardTitle>
                  <span className={cn(
                    "text-2xl font-bold capitalize",
                    rankDetails.color
                  )}>
                    {rank}
                  </span>
                </div>
                <CardDescription>
                  Skill Assessment Score: {workerData.skillAssessmentScore}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {rankDetails.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={cn("w-4 h-4", rankDetails.color)} />
                      <span className="text-muted-foreground">{perk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Jobs Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">₹0</p>
                    <p className="text-xs text-muted-foreground">Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">-</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-chart-5/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-chart-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">0%</p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade CTA (for Gig workers) */}
          {!isWorkLinkEmployee && (
            <Card className="border-2 border-primary bg-primary/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Become a WorkLink Employee</p>
                    <p className="text-sm text-muted-foreground">Earn more, get priority jobs</p>
                  </div>
                  <Button size="sm" onClick={() => setCurrentStep('worklink-eligibility')}>
                    Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Find Jobs</p>
                        <p className="text-xs text-muted-foreground">Browse available work nearby</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">My Schedule</p>
                        <p className="text-xs text-muted-foreground">View upcoming jobs</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Service Areas</p>
                        <p className="text-xs text-muted-foreground">Update your work locations</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Summary */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Your Profile</h2>
            <Card>
              <CardContent className="py-4 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <span className="text-sm font-medium">{workerData.phone}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Primary Skill</span>
                  <span className="text-sm font-medium">{primarySkill}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <span className="text-sm font-medium">
                    {workerData.gigProfile.yearsOfExperience || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">Work Type</span>
                  <span className="text-sm font-medium">
                    {workerData.gigProfile.workType || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    isWorkLinkEmployee ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                  )}>
                    {isWorkLinkEmployee ? 'Verified' : 'Active'}
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
