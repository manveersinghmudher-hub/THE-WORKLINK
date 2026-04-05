import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ConsumerModel } from '@/components/mongooseModels/consumerModel';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    
    await connectDB();
    const data = await req.json();

    if (action === 'signup') {
      const { fullName, phone, city, password } = data;
      
      const existingConsumer = await ConsumerModel.findOne({ phone });
      if (existingConsumer) {
        return NextResponse.json({ success: false, error: 'Phone number already registered' }, { status: 400 });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      const newConsumer = await ConsumerModel.create({
        fullName,
        phone,
        city,
        password: hashedPassword,
        profileImage: '', // Initially empty
      });

      return NextResponse.json({ success: true, data: { fullName: newConsumer.fullName, phone: newConsumer.phone, city: newConsumer.city, profileImage: '' } });
    }

    if (action === 'signin') {
      const { phone, password } = data;
      
      const consumer = await ConsumerModel.findOne({ phone });
      if (!consumer) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

      if (consumer.password !== hashedPassword) {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }

      return NextResponse.json({ success: true, data: { fullName: consumer.fullName, phone: consumer.phone, city: consumer.city, profileImage: consumer.profileImage } });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Consumer API Error:', error);
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
    const consumer = await ConsumerModel.findOne({ phone }).lean();
    
    if (!consumer) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Explicitly add password removal if we were using .select('-password')
    if (consumer.password) delete consumer.password;

    return NextResponse.json({ success: true, data: consumer });
  } catch (error) {
    console.error('Consumer API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    await connectDB();
    const data = await req.json();
    
    // Profile Update Logic
    if (action === 'updateProfile') {
      const { currentPhone, fullName, phone, city, profileImage } = data;
      
      const updateData: any = {};
      if (fullName) updateData.fullName = fullName;
      if (city) updateData.city = city;
      if (profileImage !== undefined) updateData.profileImage = profileImage;

      // Ensure we check if the new phone is available if it's being changed
      if (phone && phone !== currentPhone) {
        const phoneTaken = await ConsumerModel.findOne({ phone });
        if (phoneTaken) {
          return NextResponse.json({ success: false, error: 'New phone number is already registered' }, { status: 400 });
        }
        updateData.phone = phone;
      }

      const updatedConsumer = await ConsumerModel.findOneAndUpdate(
        { phone: currentPhone },
        { $set: updateData },
        { new: true, strict: false } // strict: false allows saving fields not in original (cached) schema
      ).lean();

      if (!updatedConsumer) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      console.log("Consumer profile updated successfully");
      return NextResponse.json({ 
        success: true, 
        message: 'Profile updated successfully', 
        data: { 
          fullName: updatedConsumer.fullName, 
          phone: updatedConsumer.phone, 
          city: updatedConsumer.city, 
          profileImage: updatedConsumer.profileImage 
        } 
      });
    }

    if (action === 'changePassword') {
      const { phone, oldPassword, newPassword } = data;

      const consumer = await ConsumerModel.findOne({ phone });
      if (!consumer) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      const hashedOldPassword = crypto.createHash('sha256').update(oldPassword).digest('hex');

      if (consumer.password !== hashedOldPassword) {
        return NextResponse.json({ success: false, error: 'Incorrect old password' }, { status: 401 });
      }

      const hashedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
      consumer.password = hashedNewPassword;
      await consumer.save();

      return NextResponse.json({ success: true, message: 'Password updated successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Consumer API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
