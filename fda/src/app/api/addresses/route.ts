import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { z } from 'zod'


interface Address {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export async function GET() {
  const headersList = await headers()
  const userId = headersList.get('x-user-id') as string | null

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' as const }],
  })

  return NextResponse.json({ addresses })
}

// Schema for creating an address
const createAddressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(3, 'Zip code is required'),
  country: z.string().min(2, 'Country is required').default('India'),
  isDefault: z.boolean().optional(),
})

export async function POST(request: Request) {
  const headersList = await headers()
  const userId = headersList.get('x-user-id') as string | null

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const json = await request.json()
    const parsed = createAddressSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { street, city, state, zipCode, country, isDefault } = parsed.data

    const created = await prisma.$transaction(async (tx) => {
      // If first address or explicitly default, unset others
      const existingCount = await tx.address.count({ where: { userId } })
      const shouldBeDefault = isDefault === true || existingCount === 0

      if (shouldBeDefault) {
        await tx.address.updateMany({ where: { userId }, data: { isDefault: false } })
      }

      const address = await tx.address.create({
        data: {
          userId,
          street,
          city,
          state,
          zipCode,
          country,
          isDefault: shouldBeDefault,
        },
      })

      return address
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Create Address Error:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}

