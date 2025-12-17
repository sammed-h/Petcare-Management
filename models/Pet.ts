import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
  name: string;
  breed: string;
  age: number;
  owner: mongoose.Types.ObjectId;
  medicalInfo?: string;
  photo?: string;
  createdAt: Date;
}

const PetSchema: Schema = new Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  medicalInfo: { type: String },
  photo: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Pet || mongoose.model<IPet>('Pet', PetSchema);
