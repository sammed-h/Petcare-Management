import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareRequest from '@/models/CareRequest';
import Pet from '@/models/Pet'; // Explicit import for registration
import User from '@/models/User'; // Explicit import for registration
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    let query = {};
    if (user.role === 'user') {
      query = { owner: user.userId };
    } else if (user.role === 'zoo_manager') {
      query = { zooManager: user.userId };
    }

    const requests = await CareRequest.find(query)
      .populate('pet')
      .populate('owner', 'name email phone')
      .populate('zooManager', 'name email phone')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error: any) {
    console.error('Get care requests error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Failed to fetch requests: ' + (error.message || 'Internal Server Error') 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { petId, zooManagerId, startDate, endDate, notes } = await req.json();

    const careRequest = await CareRequest.create({
      pet: petId,
      owner: user.userId,
      zooManager: zooManagerId,
      startDate,
      endDate,
      notes,
      status: 'pending',
    });

    return NextResponse.json(
      { message: 'Care request created', careRequest },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create care request error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json({ 
      error: 'Failed to create request: ' + (error.message || 'Internal Server Error') 
    }, { status: 500 });
  }
}
