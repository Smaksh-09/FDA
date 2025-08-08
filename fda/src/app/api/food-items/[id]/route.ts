import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';

// Zod schema for validating the food item update request body
// All fields are optional.
const updateFoodItemSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PUT handler for updating a food item.
 * Protected route for the restaurant owner only.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const { id: foodItemId } = await params;

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
    // First, find the food item to ensure it exists
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
      include: { restaurant: true },
    });

    if (!foodItem) {
      return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
    }

    // Ownership Check: Ensure the user owns the restaurant this item belongs to
    if (foodItem.restaurant.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to modify this item.' }, { status: 403 });
    }

    const body = await request.json();
    const validation = updateFoodItemSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const updatedFoodItem = await prisma.foodItem.update({
      where: { id: foodItemId },
      data: validation.data,
    });

    return NextResponse.json(updatedFoodItem, { status: 200 });

  } catch (error) {
    console.error('Failed to update food item:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}

/**
 * DELETE handler for removing a food item.
 * Protected route for the restaurant owner only.
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    const { id: foodItemId } = await params;

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
        // Find the food item to verify ownership before deleting
        const foodItem = await prisma.foodItem.findUnique({
            where: { id: foodItemId },
            select: { restaurant: { select: { ownerId: true } } },
        });

        if (!foodItem) {
            return NextResponse.json({ error: 'Food item not found' }, { status: 404 });
        }

        // Ownership Check
        if (foodItem.restaurant.ownerId !== userId) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this item.' }, { status: 403 });
        }

        // Note: Deleting a food item could have cascading effects on past orders.
        // The schema uses a restrictive relation, which might cause deletion to fail if the item is part of an order.
        // For a real app, you might "soft delete" by setting `isAvailable` to false instead.
        await prisma.foodItem.delete({
            where: { id: foodItemId },
        });

        return NextResponse.json({ message: 'Food item deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Failed to delete food item:', error);
        // Handle potential errors if the item is part of an existing order
        //@ts-ignore
        if (error instanceof prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
             return NextResponse.json({ error: 'Cannot delete this item as it is part of an existing order. Consider making it unavailable instead.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}