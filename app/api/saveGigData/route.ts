import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { workerData } from '@/components/mongooseModels/gigSurveyModel'
import mongoose from 'mongoose'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const {
      name,
      phone,
      password,
      primarySkill,
      secondarySkills,
      yearsOfExperience,
      workBackground,
      jobsCompleted,
      toolsAvailability,
      materialHandling,
      workType,
      availability,
      jobPreference,
      travelRange,
      travelWillingness,
      hasVehicle,
      languages,
      paymentPreference,
      expectedDailyIncome,
      idProofType,
      hasWorkPhotos,
      hasCertification,
      jobCommitment,
      cancellationBehavior,
    } = body

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and password are required' },
        { status: 400 }
      )
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex')

    const newSignUp = await workerData.create({
      name,
      phone,
      password: hashedPassword,
      primarySkill,
      secondarySkills,
      yearsOfExperience,
      workBackground,
      jobsCompleted,
      toolsAvailability,
      materialHandling,
      workType,
      availability,
      jobPreference,
      travelRange,
      travelWillingness,
      hasVehicle,
      languages,
      paymentPreference,
      expectedDailyIncome,
      idProofType,
      hasWorkPhotos,
      hasCertification,
      jobCommitment,
      cancellationBehavior,
    })

    return NextResponse.json(
      { success: true, data: newSignUp },
      { status: 201 }
    )

  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'This phone number is already registered' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}