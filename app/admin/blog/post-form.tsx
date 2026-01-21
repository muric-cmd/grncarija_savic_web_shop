'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PostFormProps {
    initialData?: any
}

export default function PostForm({ initialData }: PostFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        image: initialData?.image || '',
        published: initialData?.published || false,
    })

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setFormData(prev => ({
            ...prev,
            title,
            slug: !initialData ? title.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '') : prev.slug
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = initialData
                ? `/api/blog/${initialData.id}`
                : '/api/blog'

            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                throw new Error('Došlo je do greške pri čuvanju članka')
            }

            router.push('/admin/blog')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg shadow-md">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-clay-700">Naslov</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-clay-700">Slug (URL)</label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-clay-700">Kratak opis (Excerpt)</label>
                    <textarea
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-clay-700">Sadržaj</label>
                    <textarea
                        rows={15}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500 font-mono"
                        placeholder="Markdown podržan..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-clay-700">Slika (URL)</label>
                    <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-clay-300 px-3 py-2 focus:border-clay-500 focus:ring-clay-500"
                    />
                </div>

                <div className="pt-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="rounded text-clay-600 focus:ring-clay-500"
                        />
                        <span className="text-sm font-medium text-clay-700">Objavljeno</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-clay-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-4 py-2 text-clay-600 hover:text-clay-800 font-medium"
                >
                    Otkaži
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-clay-600 text-white rounded-md hover:bg-clay-700 disabled:opacity-50"
                >
                    {loading ? 'Čuvanje...' : 'Sačuvaj Članak'}
                </button>
            </div>
        </form>
    )
}
