import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signToken({ 
      userId: user._id.toString(), 
      email: user.email, 
      role: user.role 
    });

    console.log(`[LOGIN API] Token generated for ${user.email}`);

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      { status: 200 }
    );

    // Optimized cookie settings for deployment stability
    const isProduction = process.env.NODE_ENV === 'production';
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction, // Only true on HTTPS production
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { error: 'Login failed: ' + (error.message || 'Internal Server Error') },
      { status: 500 }
    );
  }
}
