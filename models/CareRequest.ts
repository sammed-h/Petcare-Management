import mongoose, { Schema, Document } from 'mongoose';

export interface ICareRequest extends Document {
  pet: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  zooManager: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  startDate: Date;
  endDate: Date;
  notes?: string;
  createdAt: Date;
}

const CareRequestSchema: Schema = new Schema({
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  zooManager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CareRequest || mongoose.model<ICareRequest>('CareRequest', CareRequestSchema);
