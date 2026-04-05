import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  consumerPhone: string;
  mainSkill: string;
  description: string;
  image?: {
    data: Buffer;
    contentType: String;
  };
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'none' | 'half' | 'full';
  rating?: number;
  workerType: 'gig' | 'worklink';
  workerPhone?: string;
  scheduledTime?: string;
  isUrgent?: boolean;
  urgentHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    consumerPhone: { type: String, required: true },
    mainSkill: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    image: {
      data: Buffer,
      contentType: String
    },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    paymentStatus: {
      type: String,
      enum: ['none', 'half', 'full'],
      default: 'none'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    workerType: { 
      type: String, 
      enum: ['gig', 'worklink'], 
      default: 'gig' 
    },
    workerPhone: { type: String },
    scheduledTime: { type: String },
    isUrgent: { type: Boolean, default: false },
    urgentHours: { type: Number, min: 1, max: 24 }
  },
  { timestamps: true }
);

if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
