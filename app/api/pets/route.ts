import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Pet from '@/models/Pet';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const pets = await Pet.find({ owner: user.userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({ pets }, { status: 200 });
  } catch (error) {
    console.error('Get pets error:', error);
    return NextResponse.json({ error: 'Failed to fetch pets' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { name, breed, age, medicalInfo, photo } = await req.json();

    const pet = await Pet.create({
      name,
      breed,
      age,
      medicalInfo,
      photo,
      owner: user.userId,
    });

    return NextResponse.json(
      { message: 'Pet added successfully', pet },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add pet error:', error);
    return NextResponse.json({ error: 'Failed to add pet' }, { status: 500 });
  }
}
