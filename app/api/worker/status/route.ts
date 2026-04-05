import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { workerData } from '@/components/mongooseModels/gigSurveyModel';

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { phone, isOnline } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 });
    }

    const worker = await workerData.findOneAndUpdate(
      { phone },
      { isOnline },
      { new: true }
    );

    if (!worker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, isOnline: worker.isOnline });
  } catch (error) {
    console.error('Worker Status API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
