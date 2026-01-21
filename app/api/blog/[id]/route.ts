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

        const post = await prisma.post.update({
            where: { id: params.id },
            data: {
                title: body.title,
                slug: body.slug,
                excerpt: body.excerpt,
                content: body.content,
                image: body.image,
                published: body.published,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
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

        await prisma.post.delete({
            where: { id: params.id },
        })

        return NextResponse.json({ message: 'Post deleted' })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
    }
}
