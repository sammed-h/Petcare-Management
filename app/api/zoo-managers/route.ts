import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const zooManagers = await User.find({ 
      role: 'zoo_manager',
      isVerified: true 
    }).select('-password');
    
    console.log(`Found ${zooManagers.length} zoo managers`);
    if (zooManagers.length > 0) {
      console.log('First manager keys:', Object.keys(zooManagers[0].toObject()));
      console.log('First manager profilePhoto exists:', !!zooManagers[0].profilePhoto);
    }

    return NextResponse.json({ zooManagers }, { status: 200 });
  } catch (error) {
    console.error('Get zoo managers error:', error);
    return NextResponse.json({ error: 'Failed to fetch zoo managers' }, { status: 500 });
  }
}
