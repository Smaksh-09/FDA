import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';
import { Role } from '@prisma/client';

// Zod schema for validating the "Buy Now" request (for reels)
const createOrderFromReelSchema = z.object({
  reelId: z.string().cuid("A valid Reel ID is required"),
  addressId: z.string().cuid("A valid Address ID is required"),
});

// Zod schema for validating the cart order request
const createOrderSchema = z.object({
  restaurantId: z.string().cuid("A valid Restaurant ID is required"),
  items: z.array(z.object({
    foodItemId: z.string().cuid("A valid Food Item ID is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    priceAtTimeOfOrder: z.number().positive("Price must be positive")
  })).min(1, "At least one item is required"),
  totalPrice: z.number().positive("Total price must be positive")
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
    
    // Check if this is a reel order or cart order
    if (body.reelId) {
      // Handle reel-based orders
      const validation = createOrderFromReelSchema.safeParse(body);
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

    } else {
      // Handle cart-based orders (new flow with payment integration)
      const validation = createOrderSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
      }

      const { restaurantId, items, totalPrice } = validation.data;

      // Verify restaurant exists and is open
      const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
      });

      if (!restaurant) {
        return NextResponse.json({ error: 'Restaurant not found.' }, { status: 404 });
      }

      if (!restaurant.isOpen) {
        return NextResponse.json({ error: 'This restaurant is currently closed and not accepting orders.' }, { status: 409 });
      }

      // Verify all food items exist and are available
      const foodItemIds = items.map(item => item.foodItemId);
      const foodItems = await prisma.foodItem.findMany({
        where: { 
          id: { in: foodItemIds },
          restaurantId: restaurantId
        }
      });

      if (foodItems.length !== foodItemIds.length) {
        return NextResponse.json({ error: 'Some food items were not found.' }, { status: 404 });
      }

      // Check if any items are unavailable
      const unavailableItems = foodItems.filter(item => !item.isAvailable);
      if (unavailableItems.length > 0) {
        return NextResponse.json({ 
          error: `Some food items are currently unavailable: ${unavailableItems.map(i => i.name).join(', ')}` 
        }, { status: 409 });
      }

      // Create the order and payment in a transaction (following user's exact design)
      const result = await prisma.$transaction(async (tx) => {
        // 1. Create the Order first
        const newOrder = await tx.order.create({
          data: {
            userId: userId,
            restaurantId: restaurantId,
            totalPrice: totalPrice,
            // Status defaults to PENDING
          },
        });

        // Create order items
        await tx.orderItem.createMany({
          data: items.map(item => ({
            orderId: newOrder.id,
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            priceAtTimeOfOrder: item.priceAtTimeOfOrder
          }))
        });

        // 2. Immediately create the Payment record linked to it
        const newPayment = await (tx as any).payment.create({
          data: {
            orderId: newOrder.id,
            userId: newOrder.userId,
            amount: newOrder.totalPrice,
            status: "SUCCESS", // We assume success in the mock flow
            method: "MOCK_QR",
            mockTransactionId: `MOCK_${Date.now()}` // Generate a simple unique ID
          }
        });

        return { order: newOrder, payment: newPayment };
      });

      // 3. Return a success response
      return NextResponse.json(result, { status: 201 });
    }

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
