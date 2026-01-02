import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'zoo_manager' | 'admin';
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: Date;
  // Caretaker specific fields
  profilePhoto?: string;
  pincode?: string;
  specialization?: string;
  experience?: string;
  rating?: number;
  serviceCharge?: number;
  companyName?: string;
  verification?: {
    aadhaarUrl?: string;
    companyIdUrl?: string;
    companyIdNumber?: string;
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'zoo_manager', 'admin'], default: 'user' },
  phone: { type: String },
  address: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  // Caretaker specific fields
  profilePhoto: { type: String },
  pincode: { type: String },
  specialization: { type: String },
  experience: { type: String },
  rating: { type: Number, default: 0 },
  serviceCharge: { type: Number },
  companyName: { type: String },
  verification: {
    aadhaarUrl: { type: String },
    companyIdUrl: { type: String },
    companyIdNumber: { type: String },
  },
});

// Force model recompilation to pick up new schema fields
if (mongoose.models.User) {
  delete mongoose.models.User;
}
export default mongoose.model<IUser>('User', UserSchema);
