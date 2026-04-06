import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { srLatn } from 'date-fns/locale'
import DeleteBlogButton from './delete-blog-button'

export default async function AdminBlogPage() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true },
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-clay-800">Blog</h1>
                <Link
                    href="/admin/blog/new"
                    className="bg-clay-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-clay-700 transition-colors"
                >
                    Novi Članak
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                    <thead className="bg-clay-50">
                        <tr>
                            <th className="text-left py-3 px-4 text-clay-700 font-semibold">Naslov</th>
                            <th className="text-left py-3 px-4 text-clay-700 font-semibold">Autor</th>
                            <th className="text-left py-3 px-4 text-clay-700 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-clay-700 font-semibold">Datum</th>
                            <th className="text-left py-3 px-4 text-clay-700 font-semibold">Akcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id} className="border-b border-clay-100">
                                <td className="py-3 px-4">
                                    <Link
                                        href={`/admin/blog/${post.id}`}
                                        className="text-clay-600 hover:text-clay-700 font-medium"
                                    >
                                        {post.title}
                                    </Link>
                                </td>
                                <td className="py-3 px-4 text-clay-700">{post.author.name}</td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 rounded text-sm ${post.published
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {post.published ? 'Objavljeno' : 'U pripremi'}
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-clay-700">
                                    {format(new Date(post.createdAt), 'dd. MMM yyyy.', { locale: srLatn })}
                                </td>
                                <td className="py-3 px-4 space-x-3">
                                    <Link
                                        href={`/admin/blog/${post.id}`}
                                        className="text-clay-600 hover:text-clay-700 text-sm"
                                    >
                                        Izmeni
                                    </Link>
                                    <DeleteBlogButton postId={post.id} postTitle={post.title} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
