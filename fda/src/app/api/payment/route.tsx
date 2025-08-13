import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { z } from 'zod';
import { Role } from '@prisma/client';

// Zod schema for creating a payment
const createPaymentSchema = z.object({
  orderId: z.string().cuid("A valid Order ID is required"),
  amount: z.number().positive("Amount must be positive"),
  method: z.string().min(1, "Payment method is required").default("MOCK_QR"),
});

// Zod schema for fetching payments by restaurant (for analytics)
const getPaymentsSchema = z.object({
  restaurantId: z.string().cuid().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

/**
 * POST handler for creating a payment record
 * This should be called after an order is created
 */
export async function POST(request: Request) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

  // Authorization: Only authenticated users can create payments
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createPaymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { orderId, amount, method = "MOCK_QR" } = validation.data;

    // Verify the order exists and belongs to the user
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized: Order does not belong to you.' }, { status: 403 });
    }

    // Check if payment already exists for this order
    const existingPayment = await (prisma as any).payment.findUnique({
      where: { orderId: orderId }
    });

    if (existingPayment) {
      return NextResponse.json({ error: 'Payment already exists for this order.' }, { status: 409 });
    }

    // Create the payment record
    const newPayment = await (prisma as any).payment.create({
      data: {
        orderId: orderId,
        userId: userId,
        amount: amount,
        status: "SUCCESS", // Mock payment always succeeds
        method: method,
        mockTransactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Generate unique mock transaction ID
      },
    });

    return NextResponse.json({ payment: newPayment }, { status: 201 });

  } catch (error) {
    console.error('Failed to create payment:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the payment.' }, { status: 500 });
  }
}

/**
 * GET handler for fetching payments - mainly for restaurant analytics
 * USERs can see their own payments, RESTAURANT_OWNERs see payments for their restaurant
 */
export async function GET(request: Request) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') as string | null;
  const userRole = headersList.get('x-user-role') as Role | string | null;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let payments;
    const includeOptions = {
      order: {
        include: {
          restaurant: {
            select: { id: true, name: true }
          },
          user: {
            select: { id: true, name: true, email: true }
          },
          items: {
            include: {
              foodItem: {
                select: { name: true, price: true }
              }
            }
          }
        }
      }
    };

    // Build date filter if provided
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }
    const dateFilterCondition = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

    if (userRole === Role.USER || userRole === 'USER') {
      // Users can only see their own payments
      payments = await (prisma as any).payment.findMany({
        where: {
          userId: userId,
          ...dateFilterCondition
        },
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    } else if (userRole === Role.RESTAURANT_OWNER || userRole === 'RESTAURANT_OWNER') {
      // Restaurant owners can see payments for their restaurant
      const restaurant = await prisma.restaurant.findUnique({ 
        where: { ownerId: userId }
      });
      
      if (!restaurant) {
        return NextResponse.json({ payments: [] }); // Owner might not have a restaurant yet
      }

      payments = await (prisma as any).payment.findMany({
        where: {
          order: {
            restaurantId: restaurant.id
          },
          ...dateFilterCondition
        },
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // For ADMIN or other roles - can see all payments with optional restaurant filter
      const whereCondition: any = { ...dateFilterCondition };
      if (restaurantId) {
        whereCondition.order = { restaurantId: restaurantId };
      }

      payments = await (prisma as any).payment.findMany({
        where: whereCondition,
        include: includeOptions,
        orderBy: { createdAt: 'desc' },
      });
    }

    // Calculate analytics data for restaurant owners
    if (userRole === Role.RESTAURANT_OWNER || userRole === 'RESTAURANT_OWNER') {
      const totalRevenue = payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      const totalTransactions = payments.length;
      const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      return NextResponse.json({
        payments,
        analytics: {
          totalRevenue,
          totalTransactions,
          avgOrderValue,
          period: {
            startDate: startDate || null,
            endDate: endDate || null
          }
        }
      });
    }

    return NextResponse.json({ payments });

  } catch (error) {
    console.error('Failed to fetch payments:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while fetching payments.' }, { status: 500 });
  }
}
