import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { z } from 'zod';

// Define a schema for input validation using Zod
const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});


export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body against the schema
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { name, email, password } = validation.data;

    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    // Create the new user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Role defaults to USER as per schema
      },
    });

    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}