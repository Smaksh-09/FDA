import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { Role } from '@prisma/client';



/**
 * GET handler for fetching a single order by its ID.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: orderId } = params;
  const headersList = await headers();
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { foodItem: true } },
        restaurant: { select: { name: true, id: true, ownerId: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ownership check
    const isOwner = (userRole === Role.RESTAURANT_OWNER || userRole === 'RESTAURANT_OWNER') && order.restaurant.ownerId === userId;
    const isCustomer = (userRole === Role.USER || userRole === 'USER') && order.userId === userId;

    if (!isOwner && !isCustomer) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to view this order.' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}