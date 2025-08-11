import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request: Request) {
  try {
    // Check for JWT_SECRET at runtime
    if (!JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not defined');
      return NextResponse.json({ 
        error: 'Server configuration error. Please contact support.' 
      }, { status: 500 });
    }

    // 1. Get the token from the cookie (await required for dynamic API)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value as string | undefined;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Verify the token and extract payload
    let userId: string | undefined
    try {
      const decoded = jwt.verify(token!, JWT_SECRET) as jwt.JwtPayload | string;
      if (typeof decoded !== 'string') {
        userId = decoded.userId as string | undefined
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 3. Ensure payload has userId and fetch user
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 4. Return the user data
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('Get Me Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}