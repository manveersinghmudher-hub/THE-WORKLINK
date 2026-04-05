import mongoose from 'mongoose'

const gigSurveySchema = new mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isOnline: {type: Boolean, default: false},
    profilePic: {
      data: Buffer,
      contentType: String
    },
    // Step 1 - Primary Skill
    primarySkill: {type: String, required: true},
    // Step 2 - Secondary Skills
    secondarySkills: {type: [String], required: true},
    // Step 3 - Experience
    yearsOfExperience: {type: String, required: true},
    workBackground: {type: String, required: true},
    jobsCompleted: {type: String, required: true},
    // Step 4 - Tools & Capability
    toolsAvailability: {type: String, required: true},
    materialHandling: {type: String, required: true},
    // Step 5 - Availability & Work Preference
    workType: {type: String, required: true},
    availability: {type: String, required: true},
    jobPreference: {type: [String], required: true},
    // Step 6 - Travel & Mobility
    travelRange: {type: String, required: true},
    travelWillingness: {type: String, required: true},
    hasVehicle: {type: String, required: true},
    // Step 7 - Communication
    languages: {type: [String], required: true},
    // Step 8 - Pricing
    paymentPreference: {type: String, required: true},
    expectedDailyIncome: {type: String, required: true},
    // Step 9 - Trust & Verification
    idProofType: {type: String, required: true},
    hasWorkPhotos: {type: String, required: true},
    hasCertification: {type: String, required: true},
    // Step 10 - Reliability
    jobCommitment: {type: String, required: true},
    cancellationBehavior: {type: String, required: true},
    
    // Role status
    workerType: { type: String, enum: ['gig', 'worklink'], default: 'gig' },

    // WorkLink Employee Specific Fields
    intent: String,
    experienceLevel: String,
    jobVolume: String,
    workTypeHistory: String,
    specialization: String,
    problemHandling: String,
    toolsOwnership: String,
    workSetup: String,
    commitment: String,
    timeliness: String,
    cancellation: String,
    autoAssignment: String,
    paymentStructure: String,
    codeOfConduct: String,
    idBackgroundCheck: String,
    skillAssessmentScore: { type: Number, default: 0 },
    openToTraining: String,
    workMode: String,
    dailyAvailability: String,
    hasPortfolio: String,
    hasReference: String,
  }, {timestamps: true})

if (mongoose.models.workerdata) {
  delete mongoose.models.workerdata;
}

export const workerData = mongoose.model('workerdata', gigSurveySchema)
