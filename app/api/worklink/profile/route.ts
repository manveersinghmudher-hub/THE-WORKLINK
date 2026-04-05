import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { workerData } from '@/components/mongooseModels/gigSurveyModel'

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 })
    }

    const worker: any = await workerData.findOne({ phone }).lean()
    if (!worker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 })
    }

    if (worker.profilePic && worker.profilePic.data) {
        const buffer = worker.profilePic.data.buffer || worker.profilePic.data;
        const b64 = Buffer.from(buffer).toString('base64');
        worker.profilePic = `data:${worker.profilePic.contentType};base64,${b64}`;
    }

    return NextResponse.json({ success: true, data: worker })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { phone, ...updates } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone is required' }, { status: 400 })
    }

    const updatedWorker = await workerData.findOneAndUpdate(
      { phone },
      { $set: updates },
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
