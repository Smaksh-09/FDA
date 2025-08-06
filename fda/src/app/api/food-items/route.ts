import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';

// Zod schema for validating the new food item request body
const createFoodItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().positive("Price must be a positive number"),
  imageUrl: z.string().url("A valid image URL is required"),
  isAvailable: z.boolean().optional().default(true),
});

/**
 * POST handler for adding a new food item to a restaurant's menu.
 * This is a protected route for RESTAURANT_OWNERs only.
 */
export async function POST(request: Request) {
  // Extract user info from headers set by the middleware
  const headersList = await headers();
  //@ts-ignore
  const userId = headersList.get('x-user-id');
  //@ts-ignore
  const userRole = headersList.get('x-user-role');

  // Authorization Check
  if (!userId || userRole !== 'RESTAURANT_OWNER') {
    return NextResponse.json({ error: 'Forbidden: Access is denied.' }, { status: 403 });
  }

  try {
    // An owner must have a restaurant to add food items to it.
    // Find the restaurant owned by this user.
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: userId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'You do not own a restaurant. Please create one first.' }, { status: 404 });
    }

    const body = await request.json();
    const validation = createFoodItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, description, price, imageUrl, isAvailable } = validation.data;

    const newFoodItem = await prisma.foodItem.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        isAvailable,
        restaurantId: restaurant.id, // Link to the owner's restaurant
      },
    });

    return NextResponse.json(newFoodItem, { status: 201 });

  } catch (error) {
    console.error('Failed to create food item:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the food item.' }, { status: 500 });
  }
}