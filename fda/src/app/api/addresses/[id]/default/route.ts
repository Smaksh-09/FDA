import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const headersList = await headers()
  const userId = headersList.get('x-user-id') as string | null

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({ where: { id } })
      if (!address || address.userId !== userId) {
        throw new Error('Address not found')
      }

      // Unset all defaults for the user
      await tx.address.updateMany({ where: { userId }, data: { isDefault: false } })
      // Set this one as default
      const result = await tx.address.update({ where: { id }, data: { isDefault: true } })
      return result
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to set default address' }, { status: 400 })
  }
}


