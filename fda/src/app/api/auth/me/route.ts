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

    // 1. Get the token from the cookie
    const cookieStore = cookies();
    //@ts-ignore
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Verify the token
    let decoded;
    try {
      //@ts-ignore
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string, role: string };
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 3. Find the user in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      // Select the fields you want to return, excluding the password
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