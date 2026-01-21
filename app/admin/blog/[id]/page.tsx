import { prisma } from '@/lib/prisma'
import PostForm from '../post-form'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
    params
}: {
    params: { id: string }
}) {
    const post = await prisma.post.findUnique({
        where: { id: params.id },
    })

    if (!post) {
        notFound()
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-clay-800 mb-8">Izmeni Članak</h1>
            <PostForm initialData={post} />
        </div>
    )
}
