import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { OrderModel } from '@/components/mongooseModels/orderModel';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { consumerPhone, mainSkill, description, budget, image, workerType, isUrgent, urgentHours } = await req.json();

    if (!consumerPhone || !mainSkill || !description || !budget) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    let imageData = null;
    if (image && typeof image === 'string' && image.includes('base64')) {
      const parts = image.split(';base64,');
      const contentType = parts[0].split(':')[1];
      const buffer = Buffer.from(parts[1], 'base64');
      imageData = { data: buffer, contentType };
    }

    const orderData: any = {
      consumerPhone,
      mainSkill,
      description,
      budget,
      workerType: workerType || 'gig',
      status: 'pending',
      ...(isUrgent && { isUrgent, urgentHours })
    };

    if (imageData) {
      orderData.image = imageData;
    }

    const order = await OrderModel.create(orderData);

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order API Error (POST):', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number required' }, { status: 400 });
    }

    await connectDB();
    const orders = await OrderModel.find({ consumerPhone: phone }).sort({ createdAt: -1 }).lean();

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
    console.error('Order API Error (GET):', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, status, paymentStatus, rating } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
    }

    await connectDB();
    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (rating !== undefined) updateData.rating = rating;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order API Error (PUT):', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
    }

    await connectDB();
    const order = await OrderModel.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Order API Error (DELETE):', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
