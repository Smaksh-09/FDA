import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';
//@ts-ignore
import { Role } from '@prisma/client';

// Zod schema for validating the "Buy Now" request
const createOrderSchema = z.object({
  reelId: z.string().cuid("A valid Reel ID is required"),
  addressId: z.string().cuid("A valid Address ID is required"),
});

/**
 * POST handler for creating a new order from a reel.
 * Protected route for USERs only.
 */
export async function POST(request: Request) {
  const headersList = await headers();
  //@ts-ignore
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  // Authorization: Only authenticated USERs can create orders.
  if (!userId || userRole !== Role.USER) {
    return NextResponse.json({ error: 'Forbidden: Only users can place orders.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { reelId, addressId } = validation.data;

    // Verify the user's chosen address belongs to them
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: userId },
    });
    if (!address) {
      return NextResponse.json({ error: 'Invalid address selected.' }, { status: 400 });
    }

    // Fetch all necessary data in one go
    const reel = await prisma.reel.findUnique({
      where: { id: reelId },
      include: {
        foodItem: {
          include: {
            restaurant: true,
          },
        },
      },
    });

    if (!reel || !reel.foodItem || !reel.foodItem.restaurant) {
      return NextResponse.json({ error: 'The item from this reel could not be found.' }, { status: 404 });
    }

    // Business logic validation
    if (!reel.foodItem.restaurant.isOpen) {
      return NextResponse.json({ error: 'This restaurant is currently closed and not accepting orders.' }, { status: 409 });
    }
    if (!reel.foodItem.isAvailable) {
      return NextResponse.json({ error: 'This food item is currently unavailable.' }, { status: 409 });
    }

    // Create the order using a transaction
    //@ts-ignore
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: userId,
          restaurantId: reel.foodItem.restaurantId,
          totalPrice: reel.foodItem.price,
          // Status defaults to PENDING
        },
      });

      await tx.orderItem.create({
        data: {
          orderId: order.id,
          foodItemId: reel.foodItemId,
          quantity: 1, // Defaulting to quantity of 1 for "Buy Now"
          priceAtTimeOfOrder: reel.foodItem.price,
        },
      });

      return order;
    });

    return NextResponse.json(newOrder, { status: 201 });

  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the order.' }, { status: 500 });
  }
}