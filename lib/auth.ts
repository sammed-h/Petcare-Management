import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: TokenPayload): Promise<string> {
  const secret = getSecret();
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(req: NextRequest): Promise<TokenPayload | null> {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('[AUTH LIB] Verification failed:', error instanceof Error ? error.message : error);
    return null;
  }
}
