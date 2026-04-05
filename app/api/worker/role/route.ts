import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { workerData } from '@/components/mongooseModels/gigSurveyModel'

export async function PATCH(req: Request) {
  try {
    await connectDB()
    const { phone, workerType } = await req.json()

    if (!phone || !workerType) {
      return NextResponse.json({ success: false, error: 'Phone and role are required' }, { status: 400 })
    }

    const updatedWorker = await workerData.findOneAndUpdate(
      { phone },
      { workerType },
      { new: true }
    )

    if (!updatedWorker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedWorker })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
