import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { workerData } from '@/components/mongooseModels/gigSurveyModel';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json({ success: false, error: 'Phone and password are required' }, { status: 400 });
    }

    const worker = await workerData.findOne({ phone });
    if (!worker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Support both hashed and legacy plain text passwords during transition if needed, 
    // but the saveGigData API hashes them, so mostly hashed.
    if (worker.password !== hashedPassword && worker.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // Convert profilePic to base64 if it exists as Buffer
    let profilePic = '';
    if (worker.profilePic && worker.profilePic.data) {
      const buffer = worker.profilePic.data.buffer || worker.profilePic.data;
      const b64 = Buffer.from(buffer).toString('base64');
      profilePic = `data:${worker.profilePic.contentType};base64,${b64}`;
    } else if (typeof worker.profilePic === 'string') {
      profilePic = worker.profilePic;
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        name: worker.name,
        phone: worker.phone,
        workerType: worker.workerType || 'gig',
        profileImage: profilePic,
        gigProfile: {
          primarySkill: worker.primarySkill,
          secondarySkills: worker.secondarySkills,
          yearsOfExperience: worker.yearsOfExperience,
          workBackground: worker.workBackground,
          jobsCompleted: worker.jobsCompleted,
          toolsAvailability: worker.toolsAvailability,
          materialHandling: worker.materialHandling,
          workType: worker.workType,
          availability: worker.availability,
          jobPreference: worker.jobPreference,
          travelRange: worker.travelRange,
          travelWillingness: worker.travelWillingness,
          hasVehicle: worker.hasVehicle,
          languages: worker.languages,
          paymentPreference: worker.paymentPreference,
          expectedDailyIncome: worker.expectedDailyIncome,
          idProofType: worker.idProofType,
          hasWorkPhotos: worker.hasWorkPhotos,
          hasCertification: worker.hasCertification,
          jobCommitment: worker.jobCommitment,
          cancellationBehavior: worker.cancellationBehavior,
        }
      } 
    });

  } catch (error) {
    console.error('Worker Auth Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
