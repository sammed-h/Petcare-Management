import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Activity from '@/models/Activity';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const careRequestId = searchParams.get('careRequestId');
    
    if (!careRequestId) {
      return NextResponse.json({ error: 'Care request ID required' }, { status: 400 });
    }

    const activities = await Activity.find({ careRequest: careRequestId })
      .populate('pet', 'name breed')
      .populate('createdBy', 'name')
      .sort({ timestamp: -1 });
    
    return NextResponse.json({ activities }, { status: 200 });
  } catch (error) {
    console.error('Get activities error:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user || user.role !== 'zoo_manager') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { careRequestId, petId, activityType, description, location, photos } = await req.json();

    const activity = await Activity.create({
      careRequest: careRequestId,
      pet: petId,
      activityType,
      description,
      location,
      photos: photos || [],
      createdBy: user.userId,
    });

    return NextResponse.json(
      { message: 'Activity logged', activity },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create activity error:', error);
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
