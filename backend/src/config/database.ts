import { config } from 'dotenv';
import mongoose from 'mongoose';
import { ICounter } from '@/types/database';

config();

const MONGODB_URI = process.env.MONGODB_URI as string;

/**
 * Connect to MongoDB database
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

/**
 * Counter schema for auto-incrementing IDs
 */
const CounterSchema = new mongoose.Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100 }
});

export const CounterModel = mongoose.model<ICounter>('Counter', CounterSchema);

/**
 * Get next sequence number for auto-increment functionality
 */
export async function getNextSequence(name: string): Promise<number> {
  try {
    const result = await CounterModel.findByIdAndUpdate(
      name,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return result?.seq || 100;
  } catch (err) {
    console.error('Error getting next sequence:', err);
    throw err;
  }
}