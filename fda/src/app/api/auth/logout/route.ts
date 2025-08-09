import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  try {
    // Create a cookie that expires immediately to clear the auth token
    const cookie = serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set expiry to past date to clear cookie
      sameSite: 'strict',
      path: '/',
    });

    // Set the cleared cookie in the response header
    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.headers.set('Set-Cookie', cookie);

    return response;

  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}
