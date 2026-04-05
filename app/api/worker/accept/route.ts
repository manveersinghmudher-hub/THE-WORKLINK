import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/components/mongooseModels/orderModel';

export async function POST(req: Request) {
  try {
    const { orderId, workerPhone, scheduledTime } = await req.json();

    if (!orderId || !workerPhone || !scheduledTime) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ success: false, error: 'Order is no longer available' }, { status: 400 });
    }

    // Time Constraint Check: Selected time cannot be more than 3 days from order creation
    const orderDate = new Date(order.createdAt);
    const selectedDate = new Date(scheduledTime);
    const diffTime = Math.abs(selectedDate.getTime() - orderDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
      return NextResponse.json({ 
        success: false, 
        error: 'Scheduled time must be within 3 days of the order date.' 
      }, { status: 400 });
    }

    // Update order status
    order.status = 'accepted';
    order.workerPhone = workerPhone;
    order.scheduledTime = scheduledTime;
    await order.save();

    return NextResponse.json({ success: true, message: 'Job accepted successfully' });
  } catch (error) {
    console.error('Job Acceptance Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
