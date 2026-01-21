import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { srLatn } from 'date-fns/locale'

export const metadata = {
    title: 'Blog | Grnčarija Savić',
    description: 'Pročitajte najnovije vesti i priče iz sveta grnčarije.',
}

export default async function BlogPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        include: { author: true },
    })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl font-bold text-clay-800 mb-12 text-center">
                Naš Blog
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {post.image && (
                            <div className="relative h-48 w-full">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="text-sm text-clay-500 mb-2">
                                {format(new Date(post.createdAt), 'dd. MMM yyyy.', { locale: srLatn })}
                            </div>
                            <h2 className="text-xl font-bold text-clay-800 mb-3">
                                <Link href={`/blog/${post.slug}`} className="hover:text-clay-600">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-clay-600 mb-4 line-clamp-3">
                                {post.excerpt || post.content.substring(0, 150)}...
                            </p>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="text-clay-600 font-semibold hover:text-clay-800"
                            >
                                Pročitaj više &rarr;
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center text-clay-600 py-12">
                    Trenutno nema objavljenih članaka.
                </div>
            )}
        </div>
    )
}
