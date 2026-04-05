import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { workerData } from '@/components/mongooseModels/gigSurveyModel'

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const worker: any = await workerData.findOne({ phone }).lean()

    if (!worker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      )
    }

    if (worker.profilePic && worker.profilePic.data) {
      const buffer = worker.profilePic.data.buffer || worker.profilePic.data;
      const b64 = Buffer.from(buffer).toString('base64');
      worker.profilePic = `data:${worker.profilePic.contentType};base64,${b64}`;
    } else if (typeof worker.profilePic === 'string' && worker.profilePic.startsWith('data:image')) {
      // Keep legacy string format
    } else {
      worker.profilePic = '';
    }

    return NextResponse.json(
      { success: true, data: worker },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
