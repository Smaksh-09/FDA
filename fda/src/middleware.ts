import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // A more modern library for JWT handling

const JWT_SECRET = process.env.JWT_SECRET;

// Create secret encoder - will be null if JWT_SECRET is not defined
const secret = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define which routes are protected and require authentication
  const protectedRoutes = [
    '/api/reels', // Specifically the POST method on this route
    '/api/restaurants',
    '/api/food-items',
    '/api/orders',
    '/api/auth/me'
  ];

  const isProtectedRoute = protectedRoutes.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    // Check if JWT_SECRET is configured
    if (!JWT_SECRET || !secret) {
      console.error('JWT_SECRET environment variable is not defined');
      return NextResponse.json({ 
        error: 'Server configuration error. Authentication unavailable.' 
      }, { status: 503 });
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated: No token provided' }, { status: 401 });
    }

    try {
      // Verify the token and get the payload
      const { payload } = await jwtVerify(token, secret);
      
      // Attach user info to the request headers to be accessed in the API route
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId as string);
      requestHeaders.set('x-user-role', payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (err) {
      console.error('JWT Verification Error:', err);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  // Allow the request to proceed if it's not a protected route
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};