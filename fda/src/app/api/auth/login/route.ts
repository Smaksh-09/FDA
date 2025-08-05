import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePasswords } from '@/lib/password';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const JWT_SECRET = process.env.JWT_SECRET;
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds


if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const { email, password } = validation.data;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      //@ts-ignore
      JWT_SECRET,
      {
        expiresIn: MAX_AGE,
      }
    );

    // Serialize the token into a cookie
    const cookie = serialize('token', token, {
      httpOnly: true, // The cookie is not accessible via client-side JavaScript
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: MAX_AGE,
      sameSite: 'strict', // Helps prevent CSRF attacks
      path: '/', // The cookie is available for all paths
    });

    // Set the cookie in the response header
    const response = NextResponse.json({ message: 'Logged in successfully' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}