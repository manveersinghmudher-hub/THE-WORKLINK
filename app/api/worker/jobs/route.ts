import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/components/mongooseModels/orderModel';
import { workerData } from '@/components/mongooseModels/gigSurveyModel';

const PRIMARY_SKILLS_MAP: Record<string, string> = {
  'electrical': 'Electrician',
  'plumbing': 'Plumber',
  'carpentry': 'Carpenter',
  'cleaning': 'Cleaner',
  'painting': 'Painter',
  'appliance': 'Appliance Technician',
  'mason': 'Mason',
  'other': 'Worker',
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Worker phone required' }, { status: 400 });
    }

    await connectDB();
    const worker = await workerData.findOne({ phone }).lean();

    if (!worker) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }

    // Prepare skills list for matching
    const primarySkillLabel = PRIMARY_SKILLS_MAP[worker.primarySkill as string] || worker.primarySkill;
    const workerSkills = [
      (primarySkillLabel as string).toLowerCase(),
      ...((worker.secondarySkills as string[]) || []).map(s => s.toLowerCase())
    ];

    // Fetch pending orders of matching workerType
    const pendingOrders = await OrderModel.find({ 
      status: 'pending',
      workerType: worker.workerType || 'gig'
    }).sort({ createdAt: -1 }).lean();

    // Filter jobs by matching skills
    const matchingJobs = pendingOrders.filter(order => {
      const orderSkill = order.mainSkill.toLowerCase();
      // Match if order skill matches any of worker's skills
      return workerSkills.includes(orderSkill) || workerSkills.some(ws => orderSkill.includes(ws));
    });

    const transformedJobs = matchingJobs.map((job: any) => {
      if (job.image && job.image.data) {
        const buffer = job.image.data.buffer || job.image.data;
        const b64 = Buffer.from(buffer).toString('base64');
        job.image = {
          ...job.image,
          data: `data:${job.image.contentType};base64,${b64}`
        };
      }
      return job;
    });

    return NextResponse.json({ success: true, data: transformedJobs });
  } catch (error) {
    console.error('Worker Jobs Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
