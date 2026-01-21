import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()

        // Basic validation
        if (!body.name || !body.slug || !body.price || !body.categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                stock: body.stock,
                images: body.images,
                dimensions: body.dimensions,
                material: body.material,
                categoryId: body.categoryId,
                featured: body.featured,
                active: body.active,
                variants: {
                    create: body.variants || [],
                },
            },
        })

        return NextResponse.json(product, { status: 201 })
    } catch (error: any) {
        console.error('Create product error:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Product with this slug already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 })
    }
}
