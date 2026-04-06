import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        })

        return NextResponse.json(categories)
    } catch (error: any) {
        console.error('Error fetching categories:', error)
        return NextResponse.json(
            { error: 'Greška pri učitavanju kategorija' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, slug, description, image } = body

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Naziv i slug su obavezni' },
                { status: 400 }
            )
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
            },
        })

        return NextResponse.json(category, { status: 201 })
    } catch (error: any) {
        console.error('Error creating category:', error)
        return NextResponse.json(
            { error: error.message || 'Greška pri kreiranju kategorije' },
            { status: 500 }
        )
    }
}
