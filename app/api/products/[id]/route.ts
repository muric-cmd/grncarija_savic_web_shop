import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { variants, ...productData } = body

        // Update product data
        const product = await prisma.product.update({
            where: { id: params.id },
            data: productData,
        })

        // Handle variants update (delete all and recreate is simplest for now, 
        // or upsert if we track IDs carefully)
        // For simplicity: delete existing not present in new list, upsert others

        // 2. Handle variants using transaction
        const existingVariants = await prisma.productVariant.findMany({
            where: { productId: params.id }
        })

        const existingIds = existingVariants.map(v => v.id)
        const incomingIds = variants.filter((v: any) => v.id).map((v: any) => v.id)

        // Variants to delete (exist in DB but not in payload)
        const toDeleteIds = existingIds.filter(id => !incomingIds.includes(id))

        // Transactions
        await prisma.$transaction(async (tx) => {
            // Delete removed variants
            if (toDeleteIds.length > 0) {
                // Try catch can't be used easily inside transaction bubble for simple skip, 
                // but we will attempt to delete. If they are used in orders, this might fail 
                // (which is correct behavior to prevent checking out bad state, though UI needs to handle it).
                // For now, if it fails, the whole update fails, which is "bulletproof" for integrity.
                await tx.productVariant.deleteMany({
                    where: { id: { in: toDeleteIds } }
                })
            }

            // Upsert (update or create) functionality
            for (const v of variants) {
                if (v.id && existingIds.includes(v.id)) {
                    // Update existing
                    await tx.productVariant.update({
                        where: { id: v.id },
                        data: {
                            name: v.name,
                            price: parseFloat(v.price),
                            stock: parseInt(v.stock),
                        }
                    })
                } else {
                    // Create new
                    await tx.productVariant.create({
                        data: {
                            name: v.name,
                            price: parseFloat(v.price),
                            stock: parseInt(v.stock),
                            productId: params.id
                        }
                    })
                }
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error('Update product error:', error)
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await prisma.product.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Product deleted' })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 })
    }
}
