import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', req.url));
  
  // Clear the authentication cookie
  response.cookies.delete('token');
  
  return response;
}

export async function POST(req: NextRequest) {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
  
  // Clear the authentication cookie
  response.cookies.delete('token');
  
  return response;
}
