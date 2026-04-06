'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUpload from '@/components/ImageUpload'

interface CategoryFormProps {
    initialData?: any
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        image: initialData?.image || '',
    })

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[šđčćž]/g, (match) => {
                const map: any = { š: 's', đ: 'd', č: 'c', ć: 'c', ž: 'z' }
                return map[match] || match
            })
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: initialData ? formData.slug : generateSlug(name),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const url = initialData
                ? `/api/categories/${initialData.id}`
                : '/api/categories'

            const method = initialData ? 'PATCH' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Došlo je do greške')
            }

            router.push('/admin/categories')
            router.refresh()
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                    Naziv *
                </label>
                <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                    Slug (URL) *
                </label>
                <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
                <p className="text-xs text-clay-500 mt-1">
                    URL-friendly verzija naziva (npr. &quot;keramika-za-dom&quot;)
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-clay-700 mb-1">
                    Opis
                </label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-clay-300 rounded-md focus:outline-none focus:ring-2 focus:ring-clay-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-clay-700 mb-2">
                    Slika
                </label>
                <ImageUpload
                    value={formData.image ? [formData.image] : []}
                    onChange={(urls) => setFormData({ ...formData, image: urls[0] || '' })}
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-clay-200">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-clay-600 hover:text-clay-800 font-medium"
                >
                    Otkaži
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-clay-600 text-white rounded-md hover:bg-clay-700 disabled:opacity-50"
                >
                    {loading ? 'Čuvanje...' : 'Sačuvaj'}
                </button>
            </div>
        </form>
    )
}
