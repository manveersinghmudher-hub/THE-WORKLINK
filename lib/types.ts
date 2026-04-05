// Worker workflow types
export type WorkflowStep = 
  | 'selection'
  | 'consumer-sign-in'
  | 'consumer-sign-up'
  | 'consumer-dashboard'
  | 'sign-in'
  | 'gig-survey'
  | 'gig-profile-complete'
  | 'worklink-eligibility'
  | 'worklink-survey'
  | 'document-verification'
  | 'skill-assessment'
  | 'dashboard'
  | 'worklink-dashboard'

export type WorkerType = 'gig' | 'worklink' | null

export interface GigWorkerProfile {
  // Step 1 - Primary Skill
  primarySkill: string
  // Step 2 - Secondary Skills
  secondarySkills: string[]
  // Step 3 - Experience
  yearsOfExperience: string
  workBackground: string
  jobsCompleted: string
  // Step 4 - Tools & Capability
  toolsAvailability: string
  materialHandling: string
  // Step 5 - Availability & Work Preference
  workType: string
  availability: string
  jobPreference: string[]
  // Step 6 - Travel & Mobility
  travelRange: string
  travelWillingness: string
  hasVehicle: string
  // Step 7 - Communication
  languages: string[]
  // Step 8 - Pricing
  paymentPreference: string
  expectedDailyIncome: string
  // Step 9 - Trust & Verification
  idProofType: string
  hasWorkPhotos: string
  hasCertification: string
  // Step 10 - Reliability
  jobCommitment: string
  cancellationBehavior: string
}

export interface WorkLinkEmployeeProfile {
  // Step 1 - Intent
  intent: string
  // Step 2 - Experience
  experienceLevel: string
  jobVolume: string
  workTypeHistory: string
  // Step 3 - Skill Depth
  specialization: string
  problemHandling: string
  // Step 4 - Tools & Setup
  toolsOwnership: string
  workSetup: string
  // Step 5 - Reliability
  commitment: string
  timeliness: string
  cancellation: string
  // Step 6 - Platform Rules
  autoAssignment: string
  paymentStructure: string
  codeOfConduct: string
  // Step 7 - Verification
  idBackgroundCheck: string
  skillAssessment: string
  openToTraining: string
  // Step 8 - Availability
  workMode: string
  dailyAvailability: string
  // Step 9 - Proof of Work
  hasPortfolio: string
  hasReference: string
}

export interface WorkerData {
  name: string
  phone: string
  password?: string
  email?: string
  profileImage?: string
  city?: string
  workerType: WorkerType
  gigProfile: Partial<GigWorkerProfile>
  workLinkProfile: Partial<WorkLinkEmployeeProfile>
  isEligibleForWorkLink: boolean
  workLinkEligibilityScore: number
  skillAssessmentScore: number
  workerRank: 'bronze' | 'silver' | 'gold' | 'platinum' | null
}

export const initialWorkerData: WorkerData = {
  name: '',
  phone: '',
  password: '',
  email: '',
  profileImage: '',
  city: '',
  workerType: null,
  gigProfile: {},
  workLinkProfile: {},
  isEligibleForWorkLink: false,
  workLinkEligibilityScore: 0,
  skillAssessmentScore: 0,
  workerRank: null,
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  city?: string;
  email?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  description: string;
  startingPrice: number;
}

export interface Worker {
  id: string;
  name: string;
  initials: string;
  speciality: string;
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  badge: string;
  yearsExperience?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  bgColor: string;
}

export interface Booking {
  service: string;
  description: string;
  address: string;
  timestamp: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: string;
  type: 'advance' | 'final';
}

export interface FeedbackData {
  rating: number;
  comment?: string;
  issues?: string[];
}

export interface Order {
  id: string;
  booking: Booking;
  worker: Worker;
  payment1?: Payment;
  payment2?: Payment;
  feedback?: FeedbackData;
  totalAmount: number;
  status: 'completed' | 'in-progress' | 'cancelled';
  date: string;
}
