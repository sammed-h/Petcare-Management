import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { 
      name, email, password, role, phone, address, pincode,
      specialization, experience, serviceCharge, companyName, companyIdNumber, profilePhoto 
    } = await req.json();

    console.log('Registering user:', name, email);
    if (profilePhoto) {
      console.log('Profile photo received, length:', profilePhoto.length);
    } else {
      console.log('No profile photo received');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phone,
      address,
      pincode,
      isVerified: role === 'user' ? true : false,
      // Caretaker specific
      profilePhoto,
      specialization,
      experience,
      serviceCharge: serviceCharge ? Number(serviceCharge) : undefined,
      companyName,
      verification: companyIdNumber ? {
        companyIdNumber,
        companyIdUrl: '', // Default empty until file upload implemented
        aadhaarUrl: ''
      } : undefined
    });

    return NextResponse.json(
      { message: 'User created successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
