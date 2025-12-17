import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  careRequest: mongoose.Types.ObjectId;
  pet: mongoose.Types.ObjectId;
  activityType: 'feeding' | 'walking' | 'playing' | 'sleeping' | 'medical' | 'other';
  description: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  photos: string[];
  timestamp: Date;
  createdBy: mongoose.Types.ObjectId;
}

const ActivitySchema: Schema = new Schema({
  careRequest: { type: Schema.Types.ObjectId, ref: 'CareRequest', required: true },
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  activityType: { 
    type: String, 
    enum: ['feeding', 'walking', 'playing', 'sleeping', 'medical', 'other'],
    required: true 
  },
  description: { type: String, required: true },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  photos: [{ type: String }],
  timestamp: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
