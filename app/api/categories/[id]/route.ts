import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: 'Kategorija nije pronađena' },
                { status: 404 }
            )
        }

        return NextResponse.json(category)
    } catch (error: any) {
        console.error('Error fetching category:', error)
        return NextResponse.json(
            { error: 'Greška pri učitavanju kategorije' },
            { status: 500 }
        )
    }
}

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
        const { name, slug, description, image } = body

        const category = await prisma.category.update({
            where: { id: params.id },
            data: {
                name,
                slug,
                description,
                image,
            },
        })

        return NextResponse.json(category)
    } catch (error: any) {
        console.error('Error updating category:', error)
        return NextResponse.json(
            { error: 'Greška pri ažuriranju kategorije' },
            { status: 500 }
        )
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

        // Check if category has products
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })

        if (!category) {
            return NextResponse.json(
                { error: 'Kategorija nije pronađena' },
                { status: 404 }
            )
        }

        if (category._count.products > 0) {
            return NextResponse.json(
                { error: `Ne možete obrisati kategoriju koja ima ${category._count.products} proizvoda` },
                { status: 400 }
            )
        }

        await prisma.category.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Kategorija obrisana' })
    } catch (error: any) {
        console.error('Error deleting category:', error)
        return NextResponse.json(
            { error: 'Greška pri brisanju kategorije' },
            { status: 500 }
        )
    }
}
