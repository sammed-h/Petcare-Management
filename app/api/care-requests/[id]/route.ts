import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CareRequest from '@/models/CareRequest';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { status } = await req.json();
    const { id } = await params;
    
    const careRequest = await CareRequest.findById(id);
    
    if (!careRequest) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (user.role === 'zoo_manager' && careRequest.zooManager.toString() !== user.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    careRequest.status = status;
    await careRequest.save();

    return NextResponse.json(
      { message: 'Request updated', careRequest },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update care request error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
