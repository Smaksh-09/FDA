import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { headers } from 'next/headers';


const restaurantSchema = z.object({ name: z.string().min(3, "Name must be at least 3 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    address: z.string().min(5, "Address is required"),
    imageUrl: z.string().url("A valid image URL is required").optional(),
});

export async function POST(request: Request) {
    const headersList = headers();
    //@ts-ignore
    const userId = headersList.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try{
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: { ownerId: userId },
        });
        if(existingRestaurant) {
            return NextResponse.json({ error: "You already have a restaurant" }, { status: 400 });
        }
        const body = await request.json();
        const validation = restaurantSchema.safeParse(body);
        if(!validation.success) {
            return NextResponse.json({ error: "Invalid restaurant data" }, { status: 400 });
        }
        const { name, description, address, imageUrl } = validation.data;

    // Use a transaction to ensure both operations (creating restaurant and updating user role) succeed or fail together.
    //@ts-ignore
    const newRestaurant = await prisma.$transaction(async (tx) => {
      const restaurant = await tx.restaurant.create({
        data: {
          name,
          description,
          address,
          imageUrl,
          owner: {
            connect: { id: userId },
          },
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { role: 'RESTAURANT_OWNER' },
      });

      return restaurant;
    });

    return NextResponse.json(newRestaurant, { status: 201 });

  } catch (error) {
    console.error('Failed to create restaurant:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while creating the restaurant.' }, { status: 500 });
  }
}