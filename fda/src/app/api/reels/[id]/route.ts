import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * DELETE handler for deleting a reel by ID.
 * This is a protected route - only restaurant owners can delete their own reels.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Extract user info from headers set by the middleware
  const headersList = await headers();
  //@ts-ignore
  const userId = headersList.get('x-user-id');
  const userRole = headersList.get('x-user-role');

  // Authorization Check
  if (!userId || userRole !== 'RESTAURANT_OWNER') {
    return NextResponse.json({ error: 'Forbidden: Access is denied.' }, { status: 403 });
  }

  const reelId = params.id;

  if (!reelId) {
    return NextResponse.json({ error: 'Reel ID is required.' }, { status: 400 });
  }

  try {
    // Find the reel and verify ownership
    const reel = await prisma.reel.findUnique({
      where: { id: reelId },
      include: {
        restaurant: {
          select: { ownerId: true }
        }
      }
    });

    if (!reel) {
      return NextResponse.json({ error: 'Reel not found.' }, { status: 404 });
    }

    // Check if the current user owns the restaurant this reel belongs to
    if (reel.restaurant.ownerId !== userId) {
      return NextResponse.json({ 
        error: 'Forbidden: You can only delete reels from your own restaurant.' 
      }, { status: 403 });
    }

    // Delete the reel
    await prisma.reel.delete({
      where: { id: reelId }
    });

    return NextResponse.json({ 
      message: 'Reel deleted successfully.',
      deletedReelId: reelId 
    }, { status: 200 });

  } catch (error) {
    console.error('Failed to delete reel:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while deleting the reel.' },
      { status: 500 }
    );
  }
}
