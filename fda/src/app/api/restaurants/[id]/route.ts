import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';

// Zod schema for validating the restaurant update request body
// All fields are optional as the user might only update one thing at a time.
const updateRestaurantSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  imageUrl: z.string().url().optional(),
  isOpen: z.boolean().optional(),
});


interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET handler for fetching a single restaurant by its ID.
 * This is a public route.
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
      include: {
        // Include the menu items when fetching a restaurant
        menuItems: {
          where: { isAvailable: true }, // Only show available items
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch restaurant:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * PUT handler for updating a restaurant.
 * This is a protected route, only the owner can update their restaurant.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const { id: restaurantId } = await params;

  // Extract user info from headers set by the middleware
  const headersList = await headers();
  //@ts-ignore
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  // Authorization Check
  if (!userId || userRole !== 'RESTAURANT_OWNER') {
    return NextResponse.json({ error: 'Forbidden: Access is denied.' }, { status: 403 });
  }

  try {
    // Verify this user is the owner of this specific restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    if (restaurant.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own this restaurant.' }, { status: 403 });
    }

    // Proceed with the update
    const body = await request.json();
    const validation = updateRestaurantSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    
    // The body can be passed directly to prisma.update as it only contains valid, optional fields
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: validation.data,
    });

    return NextResponse.json(updatedRestaurant, { status: 200 });

  } catch (error) {
    console.error('Failed to update restaurant:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}