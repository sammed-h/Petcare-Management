const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Define Minimal User Schema for the script (to avoid TS compilation issues)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  phone: String,
  address: String,
  isVerified: { type: Boolean, default: false },
  specialization: String,
  experience: String,
  rating: Number,
  serviceCharge: Number,
  companyName: String,
  verification: {
    aadhaarUrl: String,
    companyIdUrl: String,
    companyIdNumber: String,
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const MOCK_CARETAKERS = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.k@petcare.com',
    password: 'Password123!',
    role: 'zoo_manager',
    phone: '+91 98765 43210',
    address: 'Indiranagar, Bangalore',
    specialization: 'Canine Behavior Expert',
    experience: '8 Years',
    rating: 4.8,
    serviceCharge: 1500,
    companyName: 'Paws & Claws Services',
    verification: {
      companyIdNumber: 'PCS-EMP-001',
      // In a real app, these would be valid cloud storage URLs
      companyIdUrl: 'https://placeholder.com/id-card',
      aadhaarUrl: 'https://placeholder.com/aadhaar',
    },
    isVerified: true,
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah.w@petcare.com',
    password: 'Password123!',
    role: 'zoo_manager',
    phone: '+91 87654 32109',
    address: 'Koramangala, Bangalore',
    specialization: 'Feline Care Specialist',
    experience: '5 Years',
    rating: 4.5,
    serviceCharge: 1200,
    companyName: 'Purrfect Care Ltd',
    verification: {
      companyIdNumber: 'PCL-SR-045',
      companyIdUrl: 'https://placeholder.com/id-card-2',
    },
    isVerified: false,
  },
  {
    name: 'Vet. Dr. Anjali Rao',
    email: 'anjali.rao@vetcare.com',
    password: 'Password123!',
    role: 'zoo_manager',
    phone: '+91 76543 21098',
    address: 'Whitefield, Bangalore',
    specialization: 'Exotic Birds & Reptiles',
    experience: '12 Years',
    rating: 5.0,
    serviceCharge: 2500,
    companyName: 'Independent Consultant',
    verification: {
      companyIdNumber: 'VET-REG-8892',
    },
    isVerified: true,
  },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Optional: Clear existing zoo managers to avoid duplicates
    // await User.deleteMany({ role: 'zoo_manager' });
    // console.log('Cleared existing caretakers');

    for (const caretaker of MOCK_CARETAKERS) {
      const exists = await User.findOne({ email: caretaker.email });
      if (exists) {
        console.log(`Skipping ${caretaker.name}, already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(caretaker.password, 10);
      await User.create({
        ...caretaker,
        password: hashedPassword,
      });
      console.log(`Created caretaker: ${caretaker.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
