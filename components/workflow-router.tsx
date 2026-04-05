'use client'

import { useWorkflow } from '@/lib/workflow-context'
import { SelectionScreen } from './selection-screen'
import { SignIn } from './sign-in'
import { GigWorkerSurvey } from './gig-worker-survey'
import { GigProfileComplete } from './gig-profile-complete'
import { WorkLinkEligibility } from './worklink-eligibility'
import { WorkLinkSurvey } from './worklink-survey'
import { DocumentVerification } from './document-verification'
import { SkillAssessment } from './skill-assessment'
import { GigWorkerDashboard } from './gig-worker-dashboard'
import { WorkLinkEmployeeDashboard } from './worklink-employee-dashboard'
import { ConsumerSignIn } from './consumer/consumer-sign-in'
import { ConsumerSignUp } from './consumer/consumer-sign-up'
import { ConsumerDashboard } from './consumer/consumer-dashboard'
export function WorkflowRouter() {
  const { currentStep, workerData } = useWorkflow()

  switch (currentStep) {
    case 'selection':
      return <SelectionScreen />
    case 'consumer-sign-in':
      return <ConsumerSignIn />
    case 'consumer-sign-up':
      return <ConsumerSignUp />
    case 'consumer-dashboard':
      return <ConsumerDashboard />
    case 'sign-in':
      return <SignIn />
    case 'gig-survey':
      return <GigWorkerSurvey />
    case 'gig-profile-complete':
      return <GigProfileComplete />
    case 'worklink-eligibility':
      return <WorkLinkEligibility />
    case 'worklink-survey':
      return <WorkLinkSurvey />
    case 'document-verification':
      return <DocumentVerification />
    case 'skill-assessment':
      return <SkillAssessment />
    case 'dashboard':
      return <GigWorkerDashboard />
    case 'worklink-dashboard':
      return <WorkLinkEmployeeDashboard />
    default:
      return <SelectionScreen />
  }
}
