import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';
import { Role, OrderStatus } from '@prisma/client';

// Zod schema for validating the status update
const updateStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

interface RouteParams {
  params: { id: string };
}

/**
 * PUT handler for updating an order's status.
 * Protected route for RESTAURANT_OWNERs only.
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const { id: orderId } = params;
  const headersList = await headers();
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

  // Authorization: Only owners can update status
  if (!userId || (userRole !== Role.RESTAURANT_OWNER && userRole !== 'RESTAURANT_OWNER')) {
    return NextResponse.json({ error: 'Forbidden: Access is denied.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    // Check that the restaurant owner owns the order they are trying to update
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { restaurant: { select: { ownerId: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.restaurant.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own the restaurant for this order.' }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: validation.data.status },
    });

    return NextResponse.json(updatedOrder);

  } catch (error) {
    console.error('Failed to update order status:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
