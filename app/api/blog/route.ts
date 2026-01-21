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

        if (!body.title || !body.slug || !body.content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const post = await prisma.post.create({
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                image: body.image,
                published: body.published,
                authorId: session.user.id,
            },
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
    }
}
