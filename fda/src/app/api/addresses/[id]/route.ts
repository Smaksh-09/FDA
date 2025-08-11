import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const headersList = await headers()
  const userId = headersList.get('x-user-id') as string | null

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const deleted = await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({ where: { id } })
      if (!address || address.userId !== userId) {
        throw new Error('Address not found')
      }

      await tx.address.delete({ where: { id } })

      if (address.isDefault) {
        const newest = await tx.address.findFirst({
          where: { userId },
          orderBy: { id: 'desc' as const },
        })
        if (newest) {
          await tx.address.update({ where: { id: newest.id }, data: { isDefault: true } })
        }
      }

      return { id }
    })

    return NextResponse.json(deleted)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 400 })
  }
}


