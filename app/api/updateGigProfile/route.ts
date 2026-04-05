import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { workerData } from '@/components/mongooseModels/gigSurveyModel'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { phone, updates } = body

    if (!phone || !updates) {
      return NextResponse.json(
        { success: false, error: 'Phone and updates are required' },
        { status: 400 }
      )
    }

    let finalUpdates = { ...updates }
    
    if (finalUpdates.password) {
        finalUpdates.password = crypto.createHash('sha256').update(finalUpdates.password).digest('hex'); 
    }

    if (finalUpdates.profilePic && typeof finalUpdates.profilePic === 'string' && finalUpdates.profilePic.startsWith('data:image')) {
      const matches = finalUpdates.profilePic.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        finalUpdates.profilePic = {
          contentType: matches[1],
          data: Buffer.from(matches[2], 'base64')
        };
      }
    } else {
      delete finalUpdates.profilePic;
    }

    const updatedWorker: any = await workerData.findOneAndUpdate(
      { phone },
      { $set: finalUpdates },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedWorker) {
      return NextResponse.json(
        { success: false, error: 'Worker not found' },
        { status: 404 }
      )
    }

    if (updatedWorker.profilePic && updatedWorker.profilePic.data) {
      const buffer = updatedWorker.profilePic.data.buffer || updatedWorker.profilePic.data;
      const b64 = Buffer.from(buffer).toString('base64');
      updatedWorker.profilePic = `data:${updatedWorker.profilePic.contentType};base64,${b64}`;
    } else if (typeof updatedWorker.profilePic === 'string' && updatedWorker.profilePic.startsWith('data:image')) {
      // Keep legacy string format
    } else {
      updatedWorker.profilePic = '';
    }

    return NextResponse.json(
      { success: true, data: updatedWorker },
      { status: 200 }
    )

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Server error: ' + error.message },
      { status: 500 }
    )
  }
}
