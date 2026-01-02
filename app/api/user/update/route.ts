import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    await dbConnect();

    // Prevent updating sensitive fields directly through this endpoint
    delete data.password;
    delete data.role;
    delete data.email; 
    delete data.isVerified;

    // Validate zoo manager fields are numbers
    if (data.serviceCharge) {
      data.serviceCharge = Number(data.serviceCharge);
    }
    if (data.rating) {
      data.rating = Number(data.rating);
    }

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $set: data },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
