import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/components/mongooseModels/orderModel';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Worker phone required' }, { status: 400 });
    }

    await connectDB();
    const orders = await OrderModel.find({ 
      workerPhone: phone, 
      status: { $in: ['accepted', 'ongoing', 'completed'] } 
    }).sort({ updatedAt: -1 }).lean();

    const transformedOrders = orders.map((order: any) => {
      if (order.image && order.image.data) {
        const buffer = order.image.data.buffer || order.image.data;
        const b64 = Buffer.from(buffer).toString('base64');
        order.image = {
          ...order.image,
          data: `data:${order.image.contentType};base64,${b64}`
        };
      }
      return order;
    });

    return NextResponse.json({ success: true, data: transformedOrders });
  } catch (error) {
    console.error('Worker Accepted Jobs Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
