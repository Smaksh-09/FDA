import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';
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
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

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
/**
 * GET handler for fetching order history.
 * Behavior depends on the user's role.
 */
export async function GET(request: Request) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    let orders;
    const includeOptions = {
      items: {
        include: {
          foodItem: {
            select: { name: true, imageUrl: true }
          }
        }
      },
      restaurant: {
        select: { name: true }
      },
      user: {
        select: { name: true, email: true }
      }
    };

    if (userRole === Role.USER || userRole === 'USER') {
      orders = await prisma.order.findMany({
        where: { userId: userId },
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    } else if (userRole === Role.RESTAURANT_OWNER || userRole === 'RESTAURANT_OWNER') {
      const restaurant = await prisma.restaurant.findUnique({ where: { ownerId: userId }});
      if (!restaurant) {
        return NextResponse.json({ orders: [] }); // Owner might not have a restaurant yet
      }
      orders = await prisma.order.findMany({
        where: { restaurantId: restaurant.id },
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // For ADMIN or other roles in the future
      orders = await prisma.order.findMany({ 
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json(orders);

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching orders.' }, { status: 500 });
  }
}
