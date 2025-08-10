import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';

// Schema for creating a new reel
const createReelSchema = z.object({
  videoUrl: z.string().url({ message: "A valid video URL is required" }),
  caption: z.string().optional(),
  foodItemId: z.string().cuid({ message: "A valid Food Item ID is required" }),
});

/**
 * GET handler for fetching the reels feed with cursor-based pagination.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const restaurantId = searchParams.get('restaurantId');

  try {
    // We build the Prisma query options dynamically
    const queryOptions = {
      take: limit,
      // Where clause will be added conditionally
      where: {},
      // Include related data to show on the frontend
      include: {
        foodItem: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // Show the newest reels first
      },
      // Add cursor-based pagination logic if a cursor is present
      ...(cursor && {
        skip: 1, // Skip the cursor itself
        cursor: {
          id: cursor,
        },
      }),
    };

    // ** This is the new logic **
    // If a restaurantId is provided in the URL, add it to the 'where' clause
    if (restaurantId) {
      queryOptions.where = {
        restaurantId: restaurantId,
      };
    }
//@ts-ignore
    const reels = await prisma.reel.findMany(queryOptions);

    // Determine the next cursor for infinite scrolling
    let nextCursor: typeof cursor | null = null;
    if (reels.length === limit) {
      nextCursor = reels[reels.length - 1].id;
    }

    return NextResponse.json({
      reels,
      nextCursor,
    });
  } catch (error) {
    console.error('Failed to fetch reels:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching reels.' },
      { status: 500 }
    );
  }
}


/**
 * POST handler for creating a new reel.
 * This is a protected route. The middleware will run first.
 */
export async function POST(request: Request) {
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
    const body = await request.json();
    const validation = createReelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { videoUrl, caption, foodItemId } = validation.data;

    // Verify that the food item exists and belongs to the logged-in restaurant owner
    const foodItem = await prisma.foodItem.findUnique({
      where: { id: foodItemId },
      include: { restaurant: true },
    });

    if (!foodItem) {
      return NextResponse.json({ error: 'Food item not found.' }, { status: 404 });
    }

    if (foodItem.restaurant.ownerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: You do not own the restaurant this food item belongs to.' }, { status: 403 });
    }

    // Create the new reel
    const newReel = await prisma.reel.create({
      data: {
        videoUrl,
        caption,
        foodItemId,
        restaurantId: foodItem.restaurantId,
      },
    });

    return NextResponse.json(newReel, { status: 201 });

  } catch (error) {
    console.error('Failed to create reel:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the reel.' }, { status: 500 });
  }
}