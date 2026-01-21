import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { srLatn } from 'date-fns/locale'
import { Metadata } from 'next'

interface BlogPostPageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    })

    if (!post) {
        return {
            title: 'Članak nije pronađen',
        }
    }

    return {
        title: `${post.title} | Grnčarija Savić`,
        description: post.excerpt,
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
        include: { author: true },
    })

    if (!post || (!post.published)) {
        notFound()
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <Link
                href="/blog"
                className="text-clay-600 hover:text-clay-800 mb-8 inline-block"
            >
                &larr; Nazad na blog
            </Link>

            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                {post.image && (
                    <div className="relative h-64 md:h-96 w-full">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="p-8 md:p-12">
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-5xl font-bold text-clay-900 mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-clay-600">
                            <span className="mr-4">
                                {format(new Date(post.createdAt), 'dd. MMM yyyy.', { locale: srLatn })}
                            </span>
                            <span>Autor: {post.author.name || 'Admin'}</span>
                        </div>
                    </header>

                    <div
                        className="prose prose-clay max-w-none text-clay-800"
                        dangerouslySetInnerHTML={{
                            __html: post.content.replace(/\n/g, '<br/>')
                        }}
                    />
                </div>
            </article>
        </div>
    )
}
