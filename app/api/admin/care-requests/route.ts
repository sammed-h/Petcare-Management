import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareRequest from '@/models/CareRequest';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const requests = await CareRequest.find()
      .populate('pet')
      .populate('owner', 'name email')
      .populate('zooManager', 'name email')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error('Get care requests error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
